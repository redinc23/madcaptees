import { useState } from 'react';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import type { CartItem, AppView, OrderStatus } from '@/types';
import { formatPrice, addOrder } from '@/lib/data';

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onNavigate: (view: AppView) => void;
  onClearCart: () => void;
}

export function CheckoutPage({ items, subtotal, shipping, total, onNavigate, onClearCart }: CheckoutPageProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '' });
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timestamp = Date.now();
    const orderId = `ord-${timestamp}`;
    const newOrder: any = {
      id: orderId,
      user_id: null,
      stripe_session_id: `cs_demo_${timestamp}`,
      total_amount: total,
      subtotal,
      shipping_cost: shipping,
      status: 'paid' as OrderStatus,
      email,
      shipping_address: { name, line1: address.line1, line2: address.line2, city: address.city, state: address.state, zip: address.zip, country: 'US' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: items.map((item, i) => ({
        id: `oi-${timestamp}-${i}`,
        order_id: orderId,
        product_variant_id: item.product_variant_id,
        title_at_time: item.title,
        size_at_time: item.size,
        color_at_time: item.color,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      })),
    };
    addOrder(newOrder);
    setOrderNumber(newOrder.id);
    onClearCart();
    setStep('success');
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>CHECKOUT</h1>
        <p className="text-[#64748B] mb-6">Your cart is empty</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 text-white text-sm uppercase tracking-wider"
          style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <button
        onClick={() => onNavigate('shop')}
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0A0A0A] transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Shopping
      </button>

      {/* Success State */}
      {step === 'success' && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00C853] flex items-center justify-center">
            <Check size={32} className="text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#0A0A0A] mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            ORDER CONFIRMED
          </h1>
          <p className="text-[#64748B] mb-2">Thank you for your order!</p>
          <p className="text-sm text-[#64748B] mb-8" style={{ fontFamily: "'Space Mono', monospace" }}>
            Order #{orderNumber}
          </p>
          <p className="text-sm text-[#64748B] mb-8 max-w-md mx-auto">
            A confirmation email has been sent to {email}. Your order will be produced and shipped within 7 business days.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 text-white text-sm uppercase tracking-wider"
            style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {/* Checkout Form */}
      {step !== 'success' && (
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === 'info' ? 'text-[#0A0A0A]' : 'text-[#00C853]'}`}>
                <div className={`w-8 h-8 flex items-center justify-center border ${step === 'info' ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#00C853] bg-[#00C853] text-white'}`}>
                  {step === 'info' ? '1' : <Check size={14} />}
                </div>
                <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>Info</span>
              </div>
              <div className="flex-1 h-px bg-[#0A0A0A]/20" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#0A0A0A]' : 'text-[#64748B]'}`}>
                <div className={`w-8 h-8 flex items-center justify-center border ${step === 'payment' ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#0A0A0A]/30 text-[#64748B]'}`}>
                  2
                </div>
                <span className="text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>Payment</span>
              </div>
            </div>

            {step === 'info' && (
              <form onSubmit={handleSubmitInfo} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm mb-3"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    placeholder="123 Main St"
                  />
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    placeholder="Apt 4B (optional)"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>City</label>
                    <input type="text" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>State</label>
                    <input type="text" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm" placeholder="NJ" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>ZIP</label>
                    <input type="text" required value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none text-sm" placeholder="07712" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 text-white text-sm uppercase tracking-wider hover:translate-y-[-2px] transition-all"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="p-6 bg-[#F5F0E8] border border-[#0A0A0A]/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard size={20} className="text-[#0A0A0A]" />
                    <h3 className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Demo Payment</h3>
                  </div>
                  <p className="text-sm text-[#64748B] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    This is a demo checkout. In production, this connects to Stripe Checkout.
                  </p>
                  <div className="space-y-2 text-xs text-[#64748B]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    <p>Test Card: 4242 4242 4242 4242</p>
                    <p>Expiry: Any future date</p>
                    <p>CVC: Any 3 digits</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F5F0E8]">
                  <div>
                    <p className="text-sm text-[#64748B]">Shipping to</p>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-[#64748B]">{address.line1}, {address.city}, {address.state} {address.zip}</p>
                  </div>
                  <button onClick={() => setStep('info')} className="text-xs text-[#C41E3A] hover:underline">Change</button>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 text-white text-sm uppercase tracking-wider hover:translate-y-[-2px] transition-all"
                  style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
                >
                  Place Order — {formatPrice(total)}
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#F5F0E8] p-6 border border-[#0A0A0A]/10">
              <h3 className="text-sm uppercase tracking-wider text-[#64748B] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product_variant_id} className="flex gap-3">
                    <div className="w-16 h-16 bg-white border border-[#0A0A0A]/10 flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-[#64748B]">{item.size} / {item.color}</p>
                      <p className="text-xs text-[#64748B]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-[#0A0A0A]/10">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#0A0A0A]/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
