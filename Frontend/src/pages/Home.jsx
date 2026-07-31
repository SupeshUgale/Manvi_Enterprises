import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, BatteryCharging, Zap, Sun, Droplet,
  CheckCircle2, ChevronRight, Star, Mail, Award, Truck, HeadphonesIcon,
  TrendingUp, Users, Package, Clock, Quote, Sparkles, Layers, Check
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import ProductCard from "../Components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";

// ─── Animated Counter Component ──────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/\D/g, ""), 10);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {typeof count === "number" ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

// ─── Motion Fade-Up Section Wrapper ──────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProduct();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("featured");

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  };

  // ─── Preserved Data Structures ─────────────────────────────────────────────
  const stats = [
    { value: "15", suffix: "+", label: "Premium Brands", icon: Award },
    { value: "10000", suffix: "+", label: "Happy Clients", icon: Users },
    { value: "100", suffix: "%", label: "Genuine Assured", icon: ShieldCheck },
    { value: "24", suffix: "/7", label: "Corporate Support", icon: Clock },
  ];

  const categories = [
    { title: "Batteries", desc: "Automotive, tubular & deep cycle solar batteries for every need.", icon: BatteryCharging, cat: "Battery", color: "from-emerald-500/10 via-emerald-500/5 to-transparent", accent: "text-emerald-500", border: "hover:border-emerald-500/40" },
    { title: "Inverters & UPS", desc: "Pure sine wave home & industrial backup power systems.", icon: Zap, cat: "Inverter", color: "from-amber-500/10 via-amber-500/5 to-transparent", accent: "text-amber-500", border: "hover:border-amber-500/40" },
    { title: "Solar Systems", desc: "High-efficiency monocrystalline PV panels & solar solutions.", icon: Sun, cat: "Battery", color: "from-orange-500/10 via-orange-500/5 to-transparent", accent: "text-orange-500", border: "hover:border-orange-500/40" },
    { title: "Engine Oils", desc: "Premium synthetic multi-grade vehicle & industrial lubricants.", icon: Droplet, cat: "Engine Oil", color: "from-blue-500/10 via-blue-500/5 to-transparent", accent: "text-blue-500", border: "hover:border-blue-500/40" },
  ];

  const whyUs = [
    { title: "100% Genuine Guarantee", desc: "Sourced directly from official brand pipelines with complete manufacturer warranty tags.", icon: ShieldCheck },
    { title: "Fast Local Shipment", desc: "Rapid logistics with direct doorstep delivery and professional technician setup.", icon: Truck },
    { title: "Corporate GST Support", desc: "Fully eligible for business procurement and instant Input Tax Credit filings.", icon: Award },
    { title: "24/7 Expert Support", desc: "Dedicated technical helpdesk for troubleshooting, guidance and post-sale support.", icon: HeadphonesIcon },
  ];

  const testimonials = [
    { name: "Suresh Patil", role: "Logistics Manager, FreightCo", comment: "Outstanding bulk supply of Amaron tubular batteries. Zero voltage drops, robust structure. Highly recommended for warehouses.", rating: 5, avatar: "SP" },
    { name: "Vikram Malhotra", role: "System Integrator, TechBridge", comment: "The pure sine-wave Luminous backup sets resolved our critical server downtime. Excellent logistics and product quality.", rating: 5, avatar: "VM" },
    { name: "Priya Iyer", role: "Procurement Head, BuildTech", comment: "Castrol and Shell oils from Manvi are always genuine. Quick delivery and proper GST invoicing makes corporate procurement easy.", rating: 4, avatar: "PI" },
    { name: "Arjun Nair", role: "Solar Consultant, GreenPath", comment: "Amazing inverter-battery combo packages. Their team helped configure the exact spec for our 5KW solar plant. Top-notch service!", rating: 5, avatar: "AN" },
  ];

  const trustedBrands = ["Amaron", "Exide", "Luminous", "Castrol", "Shell", "Powerzone", "Dreams", "MasterLine", "Tata Power", "Amara Raja", "Su-Kam", "Microtek"];

  const services = [
    { title: "Battery Installation", desc: "Professional on-site fitting", icon: BatteryCharging },
    { title: "Inverter Setup", desc: "Complete home UPS installation", icon: Zap },
    { title: "Annual Maintenance", desc: "Scheduled upkeep contracts", icon: Clock },
    { title: "Corporate Supply", desc: "Bulk B2B procurement channel", icon: Package },
  ];

  // Preserved Filtered Products Data
  const featuredProducts = products.filter((_, i) => i < 4);
  const bestSellers = products.filter(p => p.badge === "Best Seller" || p.badge === "Top Rated" || p.badge === "Top Choice").slice(0, 4);
  const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] dark:bg-gray-950 text-gray-700 dark:text-gray-300 min-h-screen overflow-x-hidden font-sans selection:bg-[#2F5D50] selection:text-white">

      {/* ══════════════════ HERO SECTION (Asymmetric Editorial) ══════════════════ */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle Ambient Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-gradient-to-br from-[#2F5D50]/10 via-[#8FAE9D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[500px] h-[500px] bg-gradient-to-tr from-[#D4A64A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-[#2F5D50] animate-pulse" />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
                  Authorized National Distributor
                </span>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-xs text-[#2F5D50] dark:text-[#8FAE9D] font-bold">15+ Top Brands</span>
              </motion.div>

              <motion.h1
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
  className="relative z-10 text-4xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight"
>
  <span className="text-gray-900 dark:text-white">
    Industrial Power
  </span>

  <br />

  <span
    style={{
      display: "inline-block",
      background: "linear-gradient(90deg, #5FAF98 0%, #8BC7B5 50%, #D4A64A 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    Engineered For Scale.
  </span>
</motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-normal"
              >
                Manvi Enterprises powers residential, commercial, and heavy industrial infrastructure with direct factory-tier access to high-capacity batteries, sine-wave inverters, and premium lubricants.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/product"
                  className="inline-flex items-center gap-3 bg-[#2F5D50] hover:bg-[#244A40] text-white px-7 py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-[#2F5D50]/20 hover:shadow-xl hover:shadow-[#2F5D50]/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 hover:border-[#2F5D50] dark:hover:border-[#8FAE9D] px-7 py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Request Consultation
                  <ChevronRight className="w-4 h-4 text-[#D4A64A]" />
                </button>
              </motion.div>

              {/* Minimal Trust Indicator Footnote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-6 border-t border-gray-200/60 dark:border-gray-800/80 flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5D50] dark:text-[#8FAE9D]" />
                  <span>Direct OEM Warranties</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5D50] dark:text-[#8FAE9D]" />
                  <span>GST Credit Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5D50] dark:text-[#8FAE9D]" />
                  <span>On-Site Fitting Support</span>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Visual Card Stack (5 cols) */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                {/* Main Visual Display Block */}
                <div className="relative rounded-3xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/90 border border-gray-200/80 dark:border-gray-800 p-7 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Enterprise Power Solutions</h4>
                        <p className="text-[11px] text-gray-500">Verified OEM Grade Hardware</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-[#D4A64A]/10 text-[#D4A64A] tracking-wider">
                      Live Catalog
                    </span>
                  </div>

                  {/* Grid of Highlighted Categories */}
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((c) => {
                      const Icon = c.icon;
                      return (
                        <Link
                          key={c.title}
                          to={`/product?category=${c.cat}`}
                          className="group p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-xs"
                        >
                          <Icon className={`w-5 h-5 mb-2 ${c.accent} transition-transform group-hover:scale-110`} />
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#2F5D50] dark:group-hover:text-[#8FAE9D]">{c.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">Explore line →</p>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Floating Metric Callout Card */}
                  <div className="rounded-2xl bg-[#2F5D50] text-white p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-[#D4A64A]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">100% Genuine Certified</p>
                        <p className="text-[10px] text-[#8FAE9D]">Official Factory Warranties</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#D4A64A]">ASSURED</span>
                  </div>
                </div>

                {/* Overlapping Floating Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4A64A]/20 flex items-center justify-center text-[#D4A64A]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">10,000+</p>
                    <p className="text-[10px] font-medium text-gray-500">Corporate & Retail Clients</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════ MARQUEE BRAND STRIP ══════════════════ */}
      <section className="py-8 bg-white dark:bg-gray-900 border-y border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            Authorized Procurement & Supply Partners
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 animate-marquee w-max items-center">
            {[...trustedBrands, ...trustedBrands].map((brand, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 shrink-0 text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-[#2F5D50] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A64A]" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORIES SECTION ══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <FadeUp className="max-w-3xl space-y-3">
          <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em]">Product Divisions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            High-Performance Power Infrastructure
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Select from our specialized inventory tiers engineered to deliver uninterrupted energy and smooth mechanical efficiency.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <FadeUp key={cat.title} delay={idx * 0.08}>
                <Link
                  to={`/product?category=${cat.cat}`}
                  className={`group relative flex flex-col justify-between h-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 ${cat.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-bl-full pointer-events-none`} />
                  
                  <div className="space-y-4 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center ${cat.accent} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cat.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-8 relative z-10 flex items-center justify-between text-xs font-bold text-[#2F5D50] dark:text-[#8FAE9D] group-hover:translate-x-1 transition-transform">
                    <span>View Catalog Section</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ══════════════════ TABBED PRODUCT SHOWCASE ══════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900/50 border-y border-gray-200/80 dark:border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
            <FadeUp className="space-y-2">
              <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em]">Curated Inventory</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Explore Premium Products</h2>
            </FadeUp>

            {/* Custom Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 max-w-max">
              {[
                { id: "featured", label: "Featured Tiers", count: featuredProducts.length },
                { id: "bestsellers", label: "Best Sellers", count: bestSellers.length },
                { id: "latest", label: "Latest Arrivals", count: latestProducts.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-900 text-[#2F5D50] dark:text-[#8FAE9D] shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid Rendering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTab === "featured" &&
              featuredProducts.map((product, idx) => (
                <FadeUp key={product.id} delay={idx * 0.06}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </FadeUp>
              ))}

            {activeTab === "bestsellers" &&
              (bestSellers.length > 0 ? bestSellers : products.slice(4, 8)).map((product, idx) => (
                <FadeUp key={product.id} delay={idx * 0.06}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </FadeUp>
              ))}

            {activeTab === "latest" &&
              latestProducts.map((product, idx) => (
                <FadeUp key={product.id} delay={idx * 0.06}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </FadeUp>
              ))}
          </div>

          {/* Section Footnote Callout */}
          <div className="pt-4 text-center">
            <Link
              to="/product"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2F5D50] dark:text-[#8FAE9D] hover:underline"
            >
              Browse complete index of power solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ VALUE PROPOSITION / WHY US ══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#2F5D50] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl space-y-12">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A64A]/10 rounded-full blur-3xl pointer-events-none" />

          <FadeUp className="max-w-2xl space-y-3 relative z-10">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em]">Why Corporate Buyers Partner With Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Built on Integrity. Delivered with Speed.</h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {whyUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={idx * 0.08} className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4A64A]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-[#8FAE9D] leading-relaxed">{item.desc}</p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ METRICS & STATS ══════════════════ */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-200/80 dark:border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <FadeUp key={stat.label} delay={idx * 0.08} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D] mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                    <AnimatedCounter target={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ SERVICES STRIP ══════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em]">End-to-End Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">On-Site Technical Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#2F5D50] transition-colors shadow-xs"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#8FAE9D] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{svc.title}</h4>
                    <p className="text-xs text-gray-500">{svc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-200/80 dark:border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em]">Verified Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Trusted by Industry Leaders</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-6 shadow-xs flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-[#D4A64A]">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#D4A64A]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-[#2F5D50] text-white flex items-center justify-center font-extrabold text-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEWSLETTER ══════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <FadeUp>
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-[#1F2937] text-white p-10 sm:p-14 border border-gray-800 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/20 text-[#D4A64A] flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold">Subscribe to Corporate Updates</h2>
              <p className="text-xs text-gray-400">Receive trade discount bulletins, bulk pricing catalogs, and new product inventory alerts directly.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter work email address"
                required
                className="flex-1 px-4 py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#2F5D50]"
              />
              <button
                type="submit"
                className="bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Join Network
              </button>
            </form>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════ GET STARTED MODAL (Preserved Logic) ══════════════════ */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#8FAE9D] rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connect with Manvi Enterprises</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Select how you would like to proceed. Our technical procurement experts are ready to assist you.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => { setShowModal(false); navigate("/product"); }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <span>Browse Full Product Line</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setShowModal(false); navigate("/contact"); }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <span>Request Corporate Quote</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;