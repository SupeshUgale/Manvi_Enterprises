import React, { useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
function resolveImageUrl(img) {
  if (!img) return 'https://placehold.co/40x40?text=?';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/product/')) return img;
  if (img.startsWith('/uploads/')) return `${BACKEND_URL}${img}`;
  return img;
}
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  CheckCircle2,
  Printer,
  Download,
  Building2,
  Truck,
  Mail,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const { clearCart } = useCart();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (orderDetails && typeof clearCart === 'function') {
      clearCart();
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!orderDetails) {
    return (
      <div className="bg-[#FAFAF7] min-h-screen flex items-center justify-center text-[#222222]">
        <div className="text-center space-y-4 max-w-sm bg-[#F2F5EF] p-8 rounded-3xl border border-[#C7D3C1] shadow-xs">
          <Package className="w-16 h-16 mx-auto text-[#8E9C86]" />
          <h2 className="text-xl font-bold text-[#222222]">No order found</h2>
          <p className="text-slate-600 text-sm">
            This page is shown after a successful checkout. Please start from the products page.
          </p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-xs"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const {
    orderId,
    date,
    companyName,
    gstin,
    contactName,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    paymentMethod,
    cartItems,
    subtotal,
    gst,
    delivery,
    grandTotal,
    estimatedDelivery,
  } = orderDetails;

  return (
    <div className="bg-[#FAFAF7] text-[#222222] min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Top Banner Actions (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-[#A8B5A0] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Order Successfully Placed
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#C7D3C1] hover:bg-[#A8B5A0] hover:text-white text-[#222222] font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Summary
            </button>
            <button
              onClick={() => alert('Invoice download link has been emailed to ' + email)}
              className="bg-[#A8B5A0] hover:bg-[#8E9C86] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Invoice
            </button>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] shadow-sm overflow-hidden print:shadow-none print:border-none">

          {/* Invoice Header Banner */}
          <div className="bg-[#A8B5A0] text-white p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-white" />
                <span className="text-xl font-bold tracking-tight">Manvi Enterprises</span>
              </div>
              <p className="text-xs text-white/90">
                Nagpur, Maharashtra, India<br />
                info@manvienterprises.com | +91 98765 43210
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-mono font-bold text-[#222222] bg-[#FAFAF7] px-3 py-1 rounded-full uppercase">
                Order Confirmation
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">{orderId}</h2>
              <p className="text-xs text-white/90 mt-1">Date: {date}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[#C7D3C1]/60 text-xs sm:text-sm">

            {/* Customer Details */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#8E9C86] text-xs uppercase tracking-wider">
                Customer Details
              </h3>
              <p className="font-bold text-[#222222] text-base">{companyName}</p>
              {gstin && <p className="text-slate-600 font-mono">GSTIN: {gstin}</p>}
              <p className="text-slate-600">Contact: {contactName}</p>
              <p className="text-slate-600">{email}</p>
              <p className="text-slate-600">{phone}</p>
              <p className="text-slate-600 font-medium pt-1">
                Payment Method: <span className="text-[#222222] font-bold">{paymentMethod}</span>
              </p>
            </div>

            {/* Delivery Destination */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#8E9C86] text-xs uppercase tracking-wider flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#8E9C86]" /> Delivery Address
              </h3>
              <p className="text-slate-700 leading-relaxed font-medium">
                {address}, {city}, {state} - {pincode}
              </p>
              <div className="bg-[#FAFAF7] border border-[#C7D3C1] rounded-xl p-3 mt-3">
                <span className="text-xs font-bold text-slate-500 block uppercase">Estimated Delivery</span>
                <span className="text-sm font-bold text-[#8E9C86]">{estimatedDelivery}</span>
              </div>
            </div>

          </div>

          {/* Itemized Table */}
          <div className="p-8 space-y-6">
            <h3 className="font-bold text-[#222222] text-sm uppercase tracking-wider">
              Order Items
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-[#C7D3C1] text-slate-500 uppercase text-[11px] font-bold">
                    <th className="py-3 px-2">Product</th>
                    <th className="py-3 px-2 text-center">Brand</th>
                    <th className="py-3 px-2 text-center">Qty</th>
                    <th className="py-3 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C7D3C1]/50">
                  {(cartItems || []).map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <img src={resolveImageUrl(item.image)} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-white border border-[#C7D3C1] p-0.5 flex-shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }} />
                          <div>
                            <p className="font-bold text-[#222222]">{item.name}</p>
                            <p className="text-xs text-slate-500 font-mono">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center text-slate-600 font-medium">{item.brand}</td>
                      <td className="py-4 px-2 text-center font-bold text-[#222222]">{item.quantity}</td>
                      <td className="py-4 px-2 text-right font-bold text-[#222222]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="border-t border-[#C7D3C1] pt-4 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#222222]">₹{subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-bold text-[#222222]">₹{Math.round(gst || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-[#8E9C86] font-bold' : 'font-bold text-[#222222]'}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                <div className="border-t border-[#C7D3C1] pt-2 flex justify-between font-extrabold text-base text-[#222222]">
                  <span>Grand Total</span>
                  <span className="text-[#8E9C86]">₹{Math.round(grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Quality Note */}
          <div className="bg-[#FAFAF7] p-6 border-t border-[#C7D3C1] text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8E9C86] flex-shrink-0" />
              <span>100% genuine products. GST invoice eligible for full ITC credit.</span>
            </div>
            <span className="font-mono text-slate-400">Manvi Enterprises · {orderId}</span>
          </div>

        </div>

        {/* Next Steps Card (Hidden on print) */}
        <div className="bg-[#F2F5EF] rounded-3xl border border-[#C7D3C1] p-8 shadow-xs print:hidden space-y-6">
          <h3 className="text-lg font-bold text-[#222222] border-b border-[#C7D3C1]/60 pb-3">
            What Happens Next?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            {[
              { step: '1', title: 'Order Confirmed', desc: 'Your order has been received and is being processed by our team.' },
              { step: '2', title: 'Preparation & Packing', desc: 'Items are quality checked, packed, and prepared for dispatch.' },
              { step: '3', title: 'Delivery to Your Door', desc: `Expected delivery by ${estimatedDelivery}. You'll receive tracking updates.` },
            ].map(({ step, title, desc }) => (
              <div key={step} className="space-y-2">
                <div className="w-8 h-8 bg-[#A8B5A0] text-white font-black rounded-xl flex items-center justify-center">
                  {step}
                </div>
                <h4 className="font-bold text-[#222222]">{title}</h4>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Assistance Contact */}
          <div className="pt-4 border-t border-[#C7D3C1]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Questions about your order? We're here to help.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:support@manvienterprises.com"
                className="inline-flex items-center text-xs font-bold text-[#8E9C86] hover:underline"
              >
                <Mail className="w-3.5 h-3.5 mr-1" /> Email Support
              </a>
              <Link
                to="/"
                className="inline-flex items-center text-xs font-bold bg-[#A8B5A0] hover:bg-[#8E9C86] text-white px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Back to Home <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}