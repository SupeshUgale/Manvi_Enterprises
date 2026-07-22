import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Building2,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Truck,
  Package,
  Landmark,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: contextCartItems, subtotal: contextSubtotal, gst: contextGst, grandTotal: contextGrandTotal, delivery: contextDelivery } = useCart();

  const state = location.state || {};
  const cartItems = state.cartItems || contextCartItems;
  const subtotal = state.subtotal ?? contextSubtotal;
  const gst = state.gst ?? contextGst;
  const delivery = state.delivery ?? contextDelivery;
  const grandTotal = state.grandTotal ?? contextGrandTotal;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [upiId, setUpiId] = useState('');

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [formData, setFormData] = useState({
    companyName: '',
    gstin: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let paymentLabel = 'Online Card Payment';
    if (paymentMethod === 'netbanking') {
      paymentLabel = `Net Banking (${selectedBank})`;
    } else if (paymentMethod === 'upi') {
      paymentLabel = `UPI Payment (${upiId || 'GPay / PhonePe'})`;
    } else if (paymentMethod === 'card') {
      paymentLabel = `Credit/Debit Card (ending in ${cardData.cardNumber.slice(-4) || '4242'})`;
    }

    navigate('/order-success', {
      state: {
        orderDetails: {
          orderId: `ME-ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          ...formData,
          paymentMethod: paymentLabel,
          cartItems,
          subtotal,
          gst,
          delivery,
          grandTotal,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
          }),
        },
      },
      replace: true,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAFAF7] min-h-screen flex items-center justify-center text-[#222222]">
        <div className="text-center space-y-4 max-w-sm bg-[#F2F5EF] p-8 rounded-3xl border border-[#C7D3C1] shadow-xs">
          <Package className="w-16 h-16 mx-auto text-[#8E9C86]" />
          <h2 className="text-xl font-bold text-[#222222]">No items to checkout</h2>
          <p className="text-slate-600 text-sm">Please add products to your cart first.</p>
          <Link to="/product" className="inline-block mt-2 bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-xs">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF7] text-[#222222] min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="mb-8 flex items-center justify-between border-b border-[#C7D3C1] pb-4">
          <Link to="/cart" className="inline-flex items-center text-xs font-semibold text-[#8E9C86] hover:text-[#222222] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Cart
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Lock className="w-3.5 h-3.5 text-[#8E9C86]" /> 256-bit SSL Encrypted Secure Checkout
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Form Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section 1: Contact Information */}
            <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#222222] font-bold text-lg border-b border-[#C7D3C1]/60 pb-3">
                <Building2 className="w-5 h-5 text-[#8E9C86]" /> Contact Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                    Full Name / Enterprise Name *
                  </label>
                  <input
                    type="text" required name="companyName" value={formData.companyName}
                    onChange={handleChange} placeholder="Rajesh Verma / Acme Enterprise"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text" name="gstin" value={formData.gstin}
                    onChange={handleChange} placeholder="27AABCU9603R1ZN"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email" required name="email" value={formData.email}
                    onChange={handleChange} placeholder="name@company.com"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel" required name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="+91 98765 43210"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#222222] font-bold text-lg border-b border-[#C7D3C1]/60 pb-3">
                <Truck className="w-5 h-5 text-[#8E9C86]" /> Delivery Address
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                  Street / Area / Locality *
                </label>
                <input
                  type="text" required name="address" value={formData.address}
                  onChange={handleChange} placeholder="Plot 14, Industrial Area, Sector 5"
                  className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">City *</label>
                  <input
                    type="text" required name="city" value={formData.city}
                    onChange={handleChange} placeholder="Nagpur"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">State *</label>
                  <input
                    type="text" required name="state" value={formData.state}
                    onChange={handleChange} placeholder="Maharashtra"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">PIN Code *</label>
                  <input
                    type="text" required name="pincode" value={formData.pincode}
                    onChange={handleChange} placeholder="440016"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Online Payment Methods */}
            <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#C7D3C1]/60 pb-3">
                <div className="flex items-center gap-2 text-[#222222] font-bold text-lg">
                  <CreditCard className="w-5 h-5 text-[#8E9C86]" /> Online Payment Options
                </div>
                <span className="text-[11px] text-[#8E9C86] font-bold bg-[#C7D3C1]/50 px-2.5 py-1 rounded-full border border-[#C7D3C1] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Instant &amp; Safe
                </span>
              </div>

              {/* Payment Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis', icon: Landmark },
                  { id: 'upi', label: 'UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm', icon: QrCode },
                ].map(({ id, label, desc, icon: Icon }) => (
                  <div
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === id
                        ? 'border-[#A8B5A0] bg-[#FAFAF7] shadow-xs'
                        : 'border-[#C7D3C1] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${paymentMethod === id ? 'text-[#8E9C86]' : 'text-slate-400'}`} />
                    <div className="font-bold text-sm text-[#222222]">{label}</div>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              {/* CARD INPUTS */}
              {paymentMethod === 'card' && (
                <div className="bg-[#FAFAF7] p-5 rounded-2xl border border-[#C7D3C1] space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#222222] uppercase tracking-wider">Card Payment Details</span>
                    <span className="text-xs text-slate-400 font-mono">256-Bit SSL Encrypted</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Card Number *</label>
                    <input
                      type="text" required={paymentMethod === 'card'} name="cardNumber" maxLength="19"
                      value={cardData.cardNumber} onChange={handleCardChange} placeholder="4532 •••• •••• 8921"
                      className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cardholder Name *</label>
                    <input
                      type="text" required={paymentMethod === 'card'} name="cardHolder"
                      value={cardData.cardHolder} onChange={handleCardChange} placeholder="e.g. Rajesh Verma"
                      className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date (MM/YY) *</label>
                      <input
                        type="text" required={paymentMethod === 'card'} name="expiry" maxLength="5"
                        value={cardData.expiry} onChange={handleCardChange} placeholder="08/28"
                        className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">CVV / CVC *</label>
                      <input
                        type="password" required={paymentMethod === 'card'} name="cvv" maxLength="4"
                        value={cardData.cvv} onChange={handleCardChange} placeholder="•••"
                        className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-[#FAFAF7] p-5 rounded-2xl border border-[#C7D3C1] space-y-3 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider">Select Your Bank *</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl p-3 text-sm font-semibold focus:outline-none"
                  >
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="Axis">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* UPI PAYMENT */}
              {paymentMethod === 'upi' && (
                <div className="bg-[#FAFAF7] p-5 rounded-2xl border border-[#C7D3C1] space-y-3 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider">Enter Virtual Payment Address (VPA) / UPI ID *</label>
                  <input
                    type="text"
                    required={paymentMethod === 'upi'}
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobileNumber@upi or username@okicici"
                    className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Order Summary (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-6 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-[#222222] border-b border-[#C7D3C1]/60 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg border border-[#C7D3C1] bg-white p-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#222222] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[#222222]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-[#C7D3C1]/60 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-[#222222]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[#222222]">₹{Math.round(gst).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-[#8E9C86] font-bold' : 'font-semibold text-[#222222]'}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#C7D3C1]/60 pt-3 flex justify-between items-center text-lg font-extrabold text-[#222222]">
                <span>Total Amount</span>
                <span className="text-[#8E9C86]">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Pay ₹{Math.round(grandTotal).toLocaleString('en-IN')} &amp; Place Order
              </button>

              <div className="text-xs text-slate-500 text-center leading-relaxed flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#8E9C86]" />
                Encrypted &amp; 100% Safe Online Transaction
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}