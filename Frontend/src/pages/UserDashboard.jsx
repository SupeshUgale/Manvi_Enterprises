import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AdminProductManager from "../Components/AdminProductManager";
import {
  User, ShoppingBag, Heart, Settings, LogOut, MapPin, Mail,
  Phone, Calendar, PackageCheck, ChevronRight, Edit3, Save,
  Bell, Lock, Shield, Eye, EyeOff, CheckCircle2, Star,
  Truck, AlertCircle, XCircle, TrendingUp, Home, ArrowRight,
  LayoutDashboard, X, Package, Layers, Crown, ShieldCheck
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const BASE_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

const ORDER_STATUS = {
  Delivered: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  Shipped: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", icon: TrendingUp },
  Processing: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: AlertCircle },
  Pending: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", icon: XCircle },
};

const DUMMY_ORDERS = [
  { id: "ME-ORD-2026-9041", date: "July 20, 2026", items: 2, total: 12400, status: "Shipped", products: ["Amaron Car Battery", "Luminous Zelio+ 1100"] },
  { id: "ME-ORD-2026-8812", date: "July 15, 2026", items: 1, total: 6200, status: "Delivered", products: ["Exide GQP 1050VA Inverter"] },
  { id: "ME-ORD-2026-7540", date: "July 5, 2026", items: 3, total: 4800, status: "Delivered", products: ["Castrol GTX 3L", "Dreams EcoDrive 2", "MasterLine 1L"] },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const editFromUrl = queryParams.get("edit");

  const [activeTab, setActiveTab] = useState(
    tabFromUrl === "products" || tabFromUrl === "admin" || editFromUrl
      ? "admin-products"
      : tabFromUrl || "overview"
  );

  const [orders] = useState(DUMMY_ORDERS);
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
  });

  const [passwordData, setPasswordData] = useState({ current: "", newPw: "", confirm: "" });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false,
  });

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const updated = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSaving(false);
      Swal.fire({
        icon: "success", title: "Profile Updated!",
        text: "Your profile has been saved.",
        timer: 1500, showConfirmButton: false,
        customClass: { popup: "rounded-2xl shadow-xl" },
      });
    }, 800);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordData.current) {
      Swal.fire("Error", "Enter your current password.", "error"); return;
    }
    if (passwordData.newPw !== passwordData.confirm) {
      Swal.fire("Error", "New passwords do not match.", "error"); return;
    }
    if (passwordData.newPw.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters.", "error"); return;
    }
    Swal.fire({ icon: "success", title: "Password Changed!", timer: 1500, showConfirmButton: false, customClass: { popup: "rounded-2xl shadow-xl" } });
    setPasswordData({ current: "", newPw: "", confirm: "" });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sign out?", text: "You will be logged out of your account.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#2F5D50", cancelButtonColor: "#8FAE9D",
      confirmButtonText: "Yes, sign out",
      customClass: { popup: "rounded-2xl shadow-xl" },
    }).then(res => {
      if (res.isConfirmed) {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/", { replace: true });
      }
    });
  };

  const inp = "w-full px-3 py-2.5 text-xs border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-[#1F2937] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/50 transition placeholder-gray-400";
  const lbl = "text-[10px] font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider mb-1 block";

  if (!user) return null;

  // ─── TAB RENDERERS ───────────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#2F5D50] to-[#244A40] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/10 border-2 border-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs text-[#8FAE9D]">Welcome back,</p>
              <h2 className="text-lg font-bold font-heading">{user.name}</h2>
            </div>
          </div>
          <p className="text-xs text-[#8FAE9D]">{user.email}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold stats-font">{orders.length}</p>
              <p className="text-[10px] text-[#8FAE9D]">Orders</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold stats-font">{wishlistItems.length}</p>
              <p className="text-[10px] text-[#8FAE9D]">Wishlist</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold stats-font">{cartItems.length}</p>
              <p className="text-[10px] text-[#8FAE9D]">In Cart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Spent", value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString("en-IN")}`, icon: ShoppingBag, color: "text-[#2F5D50] dark:text-[#8FAE9D]", bg: "bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20" },
          { label: "Orders Placed", value: orders.length, icon: PackageCheck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/20" },
          { label: "Wishlist Items", value: wishlistItems.length, icon: Heart, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/20" },
          { label: "Cart Items", value: cartItems.length, icon: ShoppingBag, color: "text-[#D4A64A]", bg: "bg-[#D4A64A]/10 dark:bg-[#D4A64A]/20" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-4 space-y-2">
              <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-[#1F2937] dark:text-white stats-font">{stat.value}</p>
              <p className="text-[10px] font-semibold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-[#1F2937] dark:text-white text-sm">Recent Orders</h3>
          <button onClick={() => setActiveTab("orders")} className="text-xs text-[#2F5D50] dark:text-[#8FAE9D] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-gray-700">
          {orders.slice(0, 3).map(order => {
            const s = ORDER_STATUS[order.status] || ORDER_STATUS.Pending;
            const SIcon = s.icon;
            return (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAF8] dark:hover:bg-gray-700/50 transition">
                <div>
                  <p className="text-xs font-bold text-[#1F2937] dark:text-white font-mono">{order.id}</p>
                  <p className="text-[10px] text-[#8FAE9D] mt-0.5">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#1F2937] dark:text-white">₹{order.total.toLocaleString("en-IN")}</span>
                  <span className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                    <SIcon className="w-2.5 h-2.5" /> {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/product" className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-2xl p-4 transition group">
          <div className="w-9 h-9 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-xl flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F2937] dark:text-white">Shop Now</p>
            <p className="text-[10px] text-[#8FAE9D]">Browse catalog</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8FAE9D] ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link to="/cart" className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-2xl p-4 transition group">
          <div className="w-9 h-9 bg-[#D4A64A]/10 dark:bg-[#D4A64A]/20 rounded-xl flex items-center justify-center text-[#D4A64A]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F2937] dark:text-white">My Cart</p>
            <p className="text-[10px] text-[#8FAE9D]">{cartItems.length} items</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8FAE9D] ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] dark:text-white font-heading">My Orders</h2>
        <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">{orders.length} orders placed</p>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-12 text-center">
          <PackageCheck className="w-12 h-12 text-[#8FAE9D] mx-auto mb-3 stroke-1" />
          <h3 className="font-bold text-[#1F2937] dark:text-white text-sm mb-2">No orders yet</h3>
          <Link to="/product" className="text-xs text-[#2F5D50] dark:text-[#8FAE9D] font-semibold hover:underline">Browse catalog →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s = ORDER_STATUS[order.status] || ORDER_STATUS.Pending;
            const SIcon = s.icon;
            return (
              <div key={order.id} className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-2xl overflow-hidden transition">
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E7EB] dark:border-gray-700 bg-[#FAFAF8] dark:bg-gray-700/30">
                  <div>
                    <span className="text-xs font-black text-[#2F5D50] dark:text-[#8FAE9D] font-mono">{order.id}</span>
                    <p className="text-[10px] text-[#8FAE9D] mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#1F2937] dark:text-white">₹{order.total.toLocaleString("en-IN")}</span>
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1.5 rounded-full ${s.bg} ${s.text}`}>
                      <SIcon className="w-2.5 h-2.5" /> {order.status}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-2">
                  <p className="text-[10px] font-bold text-[#8FAE9D] uppercase tracking-wider">Products Ordered ({order.items})</p>
                  {order.products.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#8FAE9D] rounded-full shrink-0" />
                      <span className="text-xs text-[#4B5563] dark:text-gray-400">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4 flex gap-2">
                  <button className="text-xs font-bold px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-gray-600 text-[#4B5563] dark:text-gray-400 hover:border-[#2F5D50] hover:text-[#2F5D50] transition cursor-pointer">
                    View Details
                  </button>
                  {order.status === "Delivered" && (
                    <button className="text-xs font-bold px-4 py-2 rounded-xl bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 text-[#2F5D50] dark:text-[#8FAE9D] hover:bg-[#2F5D50] hover:text-white transition cursor-pointer">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] dark:text-white font-heading">My Wishlist</h2>
        <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">{wishlistItems.length} saved items</p>
      </div>
      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-12 text-center">
          <Heart className="w-12 h-12 text-[#8FAE9D] mx-auto mb-3 stroke-1 animate-pulse" />
          <h3 className="font-bold text-[#1F2937] dark:text-white text-sm mb-2">Your wishlist is empty</h3>
          <Link to="/product" className="text-xs text-[#2F5D50] dark:text-[#8FAE9D] font-semibold hover:underline">Browse products →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistItems.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-2xl p-4 flex items-center gap-4 transition group">
              <div className="w-16 h-16 bg-[#F2F4F3] dark:bg-gray-700 rounded-xl overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white line-clamp-2 leading-tight">{product.name}</p>
                <p className="text-[10px] text-[#8FAE9D] mt-0.5 uppercase tracking-wider">{product.brand}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-black text-[#1F2937] dark:text-white stats-font">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-[#4B5563]/50 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => addToCart(product)}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#2F5D50] text-white hover:bg-[#244A40] transition cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] dark:text-white font-heading">Edit Profile</h2>
        <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">Update your personal information</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E7EB] dark:border-gray-700">
          <div className="w-16 h-16 bg-[#2F5D50] text-white rounded-2xl flex items-center justify-center font-bold text-2xl">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-bold text-[#1F2937] dark:text-white">{user.name}</h3>
            <p className="text-xs text-[#8FAE9D]">{user.email}</p>
            <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 text-[#2F5D50] dark:text-[#8FAE9D] uppercase tracking-wider">
              {user.role || "user"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8FAE9D]" />
                <input value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className={`${inp} pl-8`} placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className={lbl}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8FAE9D]" />
                <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className={`${inp} pl-8`} placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className={lbl}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8FAE9D]" />
                <input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className={`${inp} pl-8`} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className={lbl}>City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8FAE9D]" />
                <input value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} className={`${inp} pl-8`} placeholder="Your city" />
              </div>
            </div>
          </div>
          <div>
            <label className={lbl}>Delivery Address</label>
            <div className="relative">
              <Home className="absolute left-3 top-3 w-3.5 h-3.5 text-[#8FAE9D]" />
              <textarea value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} rows={2} className={`${inp} pl-8 resize-none`} placeholder="Full delivery address" />
            </div>
          </div>
          <div>
            <label className={lbl}>PIN Code</label>
            <input value={profileData.pincode} onChange={e => setProfileData({ ...profileData, pincode: e.target.value })} className={inp} placeholder="6-digit PIN code" maxLength={6} />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save Profile</>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#1F2937] dark:text-white font-heading">Account Settings</h2>
        <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Password Change */}
        <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] dark:border-gray-700">
            <div className="w-8 h-8 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-lg flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] dark:text-white text-sm">Change Password</h3>
              <p className="text-[10px] text-[#8FAE9D]">Update your account password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {[
              { key: "current", label: "Current Password", ph: "Current password" },
              { key: "newPw", label: "New Password", ph: "Min. 6 characters" },
              { key: "confirm", label: "Confirm New Password", ph: "Repeat new password" },
            ].map(f => (
              <div key={f.key}>
                <label className={lbl}>{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={passwordData[f.key]}
                    onChange={e => setPasswordData({ ...passwordData, [f.key]: e.target.value })}
                    className={`${inp} pr-9`}
                    placeholder={f.ph}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FAE9D] hover:text-[#2F5D50] transition cursor-pointer">
                    {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer">
              Update Password
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] dark:border-gray-700">
            <div className="w-8 h-8 bg-[#D4A64A]/10 dark:bg-[#D4A64A]/20 rounded-lg flex items-center justify-center text-[#D4A64A]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] dark:text-white text-sm">Notifications</h3>
              <p className="text-[10px] text-[#8FAE9D]">Control what you receive</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "orderUpdates", label: "Order Updates", desc: "Shipping and delivery notifications" },
              { key: "promotions", label: "Promotions & Deals", desc: "Exclusive offers and discounts" },
              { key: "newsletter", label: "Newsletter", desc: "Weekly product news and tips" },
              { key: "sms", label: "SMS Alerts", desc: "Text notifications for orders" },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-[#1F2937] dark:text-white">{n.label}</p>
                  <p className="text-[10px] text-[#8FAE9D]">{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${notifications[n.key] ? "bg-[#2F5D50]" : "bg-[#E5E7EB] dark:bg-gray-600"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications[n.key] ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] dark:border-gray-700">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] dark:text-white text-sm">Privacy & Security</h3>
              <p className="text-[10px] text-[#8FAE9D]">Account security settings</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Authentication", desc: "Add extra security to your account", badge: "Inactive", color: "bg-rose-100 text-rose-600" },
              { label: "Login History", desc: "View recent login sessions", badge: "View", color: "bg-[#F2F4F3] text-[#4B5563] dark:bg-gray-700 dark:text-gray-400" },
              { label: "Account Visibility", desc: "Control who sees your profile", badge: "Private", color: "bg-[#2F5D50]/10 text-[#2F5D50] dark:bg-[#2F5D50]/20 dark:text-[#8FAE9D]" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-[#1F2937] dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-[#8FAE9D]">{item.desc}</p>
                </div>
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full cursor-pointer ${item.color}`}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-900">
            <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/20 rounded-lg flex items-center justify-center text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-rose-600 text-sm">Danger Zone</h3>
              <p className="text-[10px] text-rose-400">Irreversible actions</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1F2937] dark:text-white">Sign Out</p>
                <p className="text-[10px] text-[#8FAE9D]">Log out from this session</p>
              </div>
              <button onClick={handleLogout} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition cursor-pointer">
                Sign Out
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-[#E5E7EB] dark:border-gray-700 pt-3">
              <div>
                <p className="text-xs font-semibold text-[#1F2937] dark:text-white">Delete Account</p>
                <p className="text-[10px] text-[#8FAE9D]">Permanently remove your account</p>
              </div>
              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const isUserAdmin = user?.role === "admin";

  const tabsToDisplay = [
    ...(isUserAdmin
      ? [{ id: "admin-products", label: "Admin Hub", icon: Package }]
      : []),
    ...BASE_TABS,
  ];

  const renderAdminProducts = () => <AdminProductManager initialEditId={editFromUrl} />;

  const tabContent = {
    overview: renderOverview,
    orders: renderOrders,
    wishlist: renderWishlist,
    profile: renderProfile,
    settings: renderSettings,
    "admin-products": renderAdminProducts,
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAFAF8] dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="hidden md:flex flex-col w-52 shrink-0 space-y-1">
            {/* User Card */}
            <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-4 mb-2 text-center relative group">
              <div className="w-14 h-14 bg-[#2F5D50] text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-2">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#8FAE9D] truncate">{user.email}</p>

              <div className="mt-2 pt-2 border-t border-[#E5E7EB] dark:border-gray-700">
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isUserAdmin
                    ? "bg-[#D4A64A] text-[#1F2937]"
                    : "bg-[#2F5D50]/10 text-[#2F5D50] dark:bg-[#2F5D50]/20 dark:text-[#8FAE9D]"
                }`}>
                  {user.role || "Customer"}
                </span>
              </div>
            </div>

            {/* Nav */}
            {tabsToDisplay.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#2F5D50] text-white"
                      : "text-[#4B5563] dark:text-gray-400 hover:bg-[#F2F4F3] dark:hover:bg-gray-800 hover:text-[#1F2937] dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-[#8FAE9D]"}`} />
                  {tab.label}
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </aside>

          {/* ── Mobile Tab Bar ────────────────────────────────────────────────── */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-[#E5E7EB] dark:border-gray-700 px-2 py-2 flex justify-around">
            {tabsToDisplay.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? "text-[#2F5D50] dark:text-[#8FAE9D]" : "text-[#8FAE9D]"}`}>
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-[9px] font-bold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Main Content ─────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {tabContent[activeTab]?.()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
