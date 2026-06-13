-- ============================================
-- Madcap Tees — Supabase Initial Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  base_price decimal(10,2) not null check (base_price > 0),
  sale_price decimal(10,2),
  category text check (category in ('tees','hoodies','longsleeve','hats','stickers')),
  tags text[] default '{}',
  themes text[] default '{}',
  published boolean default false,
  featured boolean default false,
  best_seller boolean default false,
  made_to_order boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_text text,
  is_primary boolean default false,
  sort_order integer default 0
);

-- ============================================
-- PRODUCT VARIANTS TABLE
-- ============================================
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  size text not null,
  color text not null,
  sku text unique,
  pod_variant_id text,
  price_adjustment decimal(10,2) default 0,
  stock integer,
  available boolean default true
);

-- ============================================
-- COLLECTIONS TABLE
-- ============================================
create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text
);

-- ============================================
-- PRODUCT-COLLECTIONS JOIN TABLE
-- ============================================
create table product_collections (
  product_id uuid references products(id) on delete cascade,
  collection_id uuid references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  total_amount decimal(10,2) not null,
  subtotal decimal(10,2) not null,
  shipping_cost decimal(10,2) default 0,
  status text default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  email text not null,
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_variant_id uuid references product_variants(id),
  title_at_time text not null,
  size_at_time text not null,
  color_at_time text not null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null
);

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at on products
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================
create index idx_products_published on products(published);
create index idx_products_slug on products(slug);
create index idx_products_category on products(category);
create index idx_products_themes on products using gin(themes);
create index idx_products_tags on products using gin(tags);
create index idx_products_featured on products(featured);
create index idx_products_best_seller on products(best_seller);
create index idx_products_created_at on products(created_at desc);
create index idx_images_product on product_images(product_id);
create index idx_variants_product on product_variants(product_id);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_order_items_order on order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table collections enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table profiles enable row level security;

-- ============================================
-- RLS POLICIES: PUBLIC READ (published products only)
-- ============================================

CREATE POLICY "public_read_published_products"
  ON products FOR SELECT
  USING (published = true);

CREATE POLICY "public_read_published_images"
  ON product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = product_images.product_id AND p.published = true
  ));

CREATE POLICY "public_read_published_variants"
  ON product_variants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = product_variants.product_id AND p.published = true
  ));

CREATE POLICY "public_read_collections"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "public_read_product_collections"
  ON product_collections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p 
    WHERE p.id = product_collections.product_id AND p.published = true
  ));

-- ============================================
-- RLS POLICIES: AUTHENTICATED USER
-- ============================================

-- Users can read their own orders
CREATE POLICY "owner_read_orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own order items
CREATE POLICY "owner_read_order_items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  ));

-- Users can read/update their own profile
CREATE POLICY "owner_profile_all"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES: ADMIN FULL ACCESS
-- ============================================

CREATE POLICY "admin_all_products"
  ON products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_images"
  ON product_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_variants"
  ON product_variants FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_collections"
  ON collections FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_product_collections"
  ON product_collections FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_orders"
  ON orders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_order_items"
  ON order_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

CREATE POLICY "admin_all_profiles"
  ON profiles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ));

-- ============================================
-- RLS POLICIES: SERVICE ROLE (Stripe webhooks, etc.)
-- ============================================

CREATE POLICY "service_insert_orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_insert_order_items"
  ON order_items FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- SEED DATA: Collections
-- ============================================

INSERT INTO collections (name, slug, description) VALUES
  ('New Arrivals', 'new-arrivals', 'Fresh drops, trending designs, and brand-new takes on pop culture.'),
  ('Best Sellers', 'best-sellers', 'The most-loved graphic tees, hoodies, and hats that fans keep coming back to.'),
  ('NJ Flavor', 'nj-flavor', 'Garden State pride, pork roll supremacy, and shore-town humor.'),
  ('Satirical', 'satirical', 'Mad Magazine-style humor, conspiracy theories, and social commentary.'),
  ('Retro', 'retro', '80s/90s nostalgia, chrome typography, and vintage gaming vibes.'),
  ('Band Merch', 'band-merch', 'Music-inspired designs for the audiophiles and concert-goers.')
ON CONFLICT (slug) DO NOTHING;
