import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
function resolveImageUrl(img) {
  if (!img) return 'https://placehold.co/80x80?text=?';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/product/')) return img;
  if (img.startsWith('/uploads/')) return `${BACKEND_URL}${img}`;
  return img;
}
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    subtotal,
    gst,
    delivery,
    grandTotal,
  } = useCart();

  const [orderType, setOrderType] = useState('direct');
  const [instructions, setInstructions] = useState('');

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        subtotal,
        gst,
        delivery,
        grandTotal,
        orderType,
        instructions,
      },
    });
  };

  return (
    <div className="bg-[#FAFAF7] text-[#222222] min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C7D3C1] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#8E9C86] font-bold text-xs uppercase tracking-widest bg-[#C7D3C1]/50 px-3 py-1 rounded-full border border-[#C7D3C1]">
                Shopping Cart
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#222222]">Your Requisition Cart</h1>
          </div>
          <div className="text-sm text-slate-600 font-medium">
            Items in Cart:{' '}
            <span className="font-bold text-[#8E9C86]">{cartItems.length}</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-12 text-center shadow-xs max-w-2xl mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-[#C7D3C1]/50 text-[#8E9C86] rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#222222]">Your cart is empty</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Explore our product catalog and add batteries, inverters, or engine oils to your cart.
            </p>
            <div className="pt-4">
              <Link
                to="/product"
                className="inline-flex items-center gap-2 bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors"
              >
                <Package className="w-4 h-4" />
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left 8 Columns: Item List */}
            <div className="lg:col-span-8 space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F2F5EF] rounded-2xl border border-[#C7D3C1] p-5 shadow-xs hover:border-[#A8B5A0] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Image & Product Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-xl border border-[#C7D3C1] bg-white flex-shrink-0 p-1"
                      onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=?'; }}
                    />
                    <div>
                      <span className="text-xs font-bold text-[#8E9C86] bg-[#C7D3C1]/50 px-2.5 py-0.5 rounded border border-[#C7D3C1]">
                        {item.brand} · {item.category}
                      </span>
                      <h3 className="font-bold text-[#222222] text-sm sm:text-base mt-1 line-clamp-2 max-w-xs">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        SKU: {item.sku}
                      </p>
                      {item.warranty && item.warranty !== 'No Warranty' && (
                        <p className="text-xs text-[#8E9C86] font-bold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {item.warranty} Warranty
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Price */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#C7D3C1]/60">

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#C7D3C1] rounded-xl bg-white">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="p-2 text-[#222222] hover:text-[#8E9C86] transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold text-[#222222]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="p-2 text-[#222222] hover:text-[#8E9C86] transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="text-right">
                      <div className="text-base font-bold text-[#222222]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-500">
                        ₹{item.price.toLocaleString('en-IN')} / unit
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Order Notes / Instructions */}
              <div className="bg-[#F2F5EF] rounded-2xl border border-[#C7D3C1] p-5 shadow-xs mt-6">
                <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-2">
                  Special Delivery Instructions / Notes
                </label>
                <textarea
                  rows="3"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Mention any specific delivery or packaging instructions here..."
                  className="w-full bg-white border border-[#C7D3C1] focus:border-[#A8B5A0] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]/40 transition-all"
                ></textarea>
              </div>

              {/* Continue Shopping */}
              <Link
                to="/product"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#8E9C86] hover:text-[#222222] transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Right 4 Columns: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-6 shadow-sm sticky top-24 space-y-6">

                <h2 className="text-lg font-bold text-[#222222] border-b border-[#C7D3C1]/60 pb-3">
                  Order Summary
                </h2>

                {/* Mode Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Order Mode
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-[#FAFAF7] p-1 rounded-xl text-xs font-semibold border border-[#C7D3C1]">
                    <button
                      type="button"
                      onClick={() => setOrderType('direct')}
                      className={`py-2 rounded-lg transition-all ${
                        orderType === 'direct'
                          ? 'bg-[#A8B5A0] text-white shadow-xs font-bold'
                          : 'text-[#222222] hover:bg-[#C7D3C1]/40'
                      }`}
                    >
                      Direct Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('quote')}
                      className={`py-2 rounded-lg transition-all ${
                        orderType === 'quote'
                          ? 'bg-[#A8B5A0] text-white shadow-xs font-bold'
                          : 'text-[#222222] hover:bg-[#C7D3C1]/40'
                      }`}
                    >
                      Request Quote
                    </button>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-3 text-sm border-b border-[#C7D3C1]/60 pb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#222222]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      GST (18%){' '}
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <span className="font-semibold text-[#222222]">
                      ₹{Math.round(gst).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-[#8E9C86] font-bold' : 'font-semibold text-[#222222]'}>
                      {delivery === 0 ? 'FREE' : `₹${delivery}`}
                    </span>
                  </div>
                  {delivery === 0 && (
                    <p className="text-[11px] text-[#8E9C86] font-bold">
                      ✓ Free delivery on orders above ₹5,000
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-extrabold text-[#222222]">
                  <span>Total Amount</span>
                  <span className="text-[#8E9C86]">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {orderType === 'direct' ? (
                    <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>Generate Quote <FileText className="w-4 h-4" /></>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="bg-[#FAFAF7] p-4 rounded-2xl border border-[#C7D3C1] space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-[#222222]">
                    <ShieldCheck className="w-4 h-4 text-[#8E9C86]" /> Manvi Assured Quality
                  </div>
                  <p className="leading-relaxed">
                    100% genuine products with official warranty. GST invoice included with every order.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}