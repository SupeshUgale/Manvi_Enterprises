import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, BatteryCharging, Zap, Sun, Droplet,
  CheckCircle2, ChevronRight, Star, Mail, Award, Truck, HeadphonesIcon,
  TrendingUp, Users, Package, Clock, Quote
} from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import ProductCard from "../Components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";

// ─── Animated Counter ────────────────────────────────────────────────────────
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
    <span ref={ref}>
      {typeof count === "number" ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

// ─── Section Fade-up Wrapper ──────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  };

  // ─── Data ───────────────────────────────────────────────────────────────────
  const stats = [
    { value: "15", suffix: "+", label: "Premium Brands", icon: Award },
    { value: "10000", suffix: "+", label: "Happy Clients", icon: Users },
    { value: "100", suffix: "%", label: "Genuine Assured", icon: ShieldCheck },
    { value: "24", suffix: "/7", label: "Corporate Support", icon: Clock },
  ];

  const categories = [
    { title: "Batteries", desc: "Automotive, tubular & deep cycle solar batteries for every need.", icon: BatteryCharging, cat: "Battery", color: "from-emerald-500/10 to-emerald-600/5", border: "hover:border-emerald-300" },
    { title: "Inverters & UPS", desc: "Pure sine wave home & industrial backup power systems.", icon: Zap, cat: "Inverter", color: "from-amber-500/10 to-amber-600/5", border: "hover:border-amber-300" },
    { title: "Solar Systems", desc: "High-efficiency monocrystalline PV panels & solar solutions.", icon: Sun, cat: "Battery", color: "from-orange-500/10 to-orange-600/5", border: "hover:border-orange-300" },
    { title: "Engine Oils", desc: "Premium synthetic multi-grade vehicle & industrial lubricants.", icon: Droplet, cat: "Engine Oil", color: "from-blue-500/10 to-blue-600/5", border: "hover:border-blue-300" },
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

  // Filter products
  const featuredProducts = products.filter((_, i) => i < 4);
  const bestSellers = products.filter(p => p.badge === "Best Seller" || p.badge === "Top Rated" || p.badge === "Top Choice").slice(0, 4);
  const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <div className="bg-[#FAFAF8] dark:bg-gray-900 text-[#4B5563] dark:text-gray-300 min-h-screen overflow-x-hidden font-sans">

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <section className="relative min-h-[88vh] w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#FAFAF8] via-white to-[#F2F4F3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#2F5D50]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4A64A]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8FAE9D]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-7">
          {/* Eyebrow badge */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 text-[#2F5D50] dark:text-[#8FAE9D] text-xs font-bold uppercase tracking-wider border border-[#2F5D50]/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Authorized Distribution Partner — 15+ Premium Brands
          </motion.span>

          {/* Main heading */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tight uppercase font-heading text-[#1F2937] dark:text-white leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Manvi{" "}
            <span className="text-[#2F5D50] dark:text-[#8FAE9D]">Enterprises</span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#D4A64A] via-[#e8c075] to-[#D4A64A] rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="text-base sm:text-lg text-[#4B5563] dark:text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Distributing premium industrial power components — tubular solar batteries, pure sine wave inverters, and heavy-duty engine lubricants directly from authorized brand channels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/product"
              className="bg-[#2F5D50] hover:bg-[#244A40] text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 active:scale-95"
            >
              Browse Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="border-2 border-[#2F5D50] text-[#2F5D50] dark:text-[#8FAE9D] dark:border-[#8FAE9D] hover:bg-[#2F5D50] hover:text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Get in Touch <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Mini stats strip */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              { v: "15+", l: "Brands" },
              { v: "10K+", l: "Clients" },
              { v: "100%", l: "Genuine" },
              { v: "24/7", l: "Support" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-2 text-sm">
                <span className="font-black text-[#2F5D50] dark:text-[#8FAE9D] stats-font text-lg">{s.v}</span>
                <span className="text-[#4B5563] dark:text-gray-400 text-xs">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-5 h-8 border-2 border-[#8FAE9D] rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#2F5D50] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ FEATURED CATEGORIES ══════════════════ */}
      <section className="bg-[#F2F4F3] dark:bg-gray-800/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Product Divisions</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading tracking-tight">
              Engineered for Maximum Reliability
            </h2>
            <p className="text-[#4B5563] dark:text-gray-400 text-sm">
              Top-tier power solutions from authorized brand channels — batteries, inverters, solar, and lubricants.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <FadeUp key={cat.title} delay={idx * 0.08}>
                  <Link
                    to={`/product?category=${cat.cat}`}
                    className={`group block bg-white dark:bg-gray-800 p-6 rounded-2xl border border-[#E5E7EB] dark:border-gray-700 ${cat.border} dark:hover:border-[#2F5D50] hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 h-full`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} border border-[#E5E7EB] dark:border-gray-700 text-[#2F5D50] dark:text-[#8FAE9D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#1F2937] dark:text-white mb-1.5 font-heading">{cat.title}</h3>
                    <p className="text-xs text-[#4B5563] dark:text-gray-400 leading-relaxed mb-4">{cat.desc}</p>
                    <span className="text-xs font-bold text-[#2F5D50] dark:text-[#8FAE9D] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore division <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED PRODUCTS ══════════════════ */}
      <section className="bg-[#FAFAF8] dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Hand Picked</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">Featured Products</h2>
            </div>
            <Link
              to="/product"
              className="flex items-center gap-2 text-sm font-bold text-[#2F5D50] dark:text-[#8FAE9D] hover:gap-3 transition-all"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <FadeUp key={product.id} delay={idx * 0.07}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BEST SELLERS ══════════════════ */}
      <section className="bg-[#F2F4F3] dark:bg-gray-800/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Most Popular</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">Best Sellers</h2>
            </div>
            <Link
              to="/product"
              className="flex items-center gap-2 text-sm font-bold text-[#2F5D50] dark:text-[#8FAE9D] hover:gap-3 transition-all"
            >
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(bestSellers.length > 0 ? bestSellers : products.slice(4, 8)).map((product, idx) => (
              <FadeUp key={product.id} delay={idx * 0.07}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ LATEST PRODUCTS ══════════════════ */}
      <section className="bg-[#FAFAF8] dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Just In</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">Latest Products</h2>
            </div>
            <Link
              to="/product"
              className="flex items-center gap-2 text-sm font-bold text-[#2F5D50] dark:text-[#8FAE9D] hover:gap-3 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product, idx) => (
              <FadeUp key={product.id} delay={idx * 0.07}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY CHOOSE US ══════════════════ */}
      <section className="bg-[#2F5D50] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Our Promise</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading">Why Choose Manvi Enterprises?</h2>
            <p className="text-[#8FAE9D] text-sm">Built on trust, powered by quality. We deliver more than products — we deliver peace of mind.</p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={idx * 0.08}>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="w-12 h-12 bg-[#D4A64A]/20 rounded-xl flex items-center justify-center text-[#D4A64A] group-hover:bg-[#D4A64A] group-hover:text-[#1F2937] transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                    <p className="text-xs text-[#8FAE9D] leading-relaxed">{item.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATISTICS ══════════════════ */}
      <section className="bg-[#F2F4F3] dark:bg-gray-800/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <FadeUp key={stat.label} delay={idx * 0.1}>
                  <div className="text-center space-y-2 group">
                    <div className="w-12 h-12 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-xl flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D] mx-auto mb-3 group-hover:bg-[#2F5D50] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-4xl sm:text-5xl font-bold text-[#2F5D50] dark:text-[#8FAE9D] stats-font">
                      <AnimatedCounter target={stat.value} />
                      {stat.suffix}
                    </p>
                    <p className="text-xs font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ SERVICES STRIP ══════════════════ */}
      <section className="bg-[#FAFAF8] dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((svc, idx) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.title} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-xl hover:border-[#2F5D50] transition-colors duration-300 group cursor-pointer">
                    <div className="w-9 h-9 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-lg flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D] shrink-0 group-hover:bg-[#2F5D50] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F2937] dark:text-white">{svc.title}</p>
                      <p className="text-[10px] text-[#4B5563] dark:text-gray-400">{svc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="bg-[#F2F4F3] dark:bg-gray-800/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Corporate Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">What Our Clients Say</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-2xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
                  <Quote className="w-7 h-7 text-[#D4A64A]/40" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#D4A64A] text-[#D4A64A]" />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-[#E5E7EB]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                  <div className="flex items-center gap-3 pt-1 border-t border-[#E5E7EB] dark:border-gray-700">
                    <div className="w-9 h-9 bg-[#2F5D50] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2937] dark:text-white text-sm">{t.name}</p>
                      <p className="text-[10px] text-[#8FAE9D] uppercase tracking-wider font-bold">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TRUSTED BRANDS MARQUEE ══════════════════ */}
      <section className="bg-[#FAFAF8] dark:bg-gray-900 py-14 px-4 overflow-hidden border-b border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <FadeUp>
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Authorized Dealer</span>
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white font-heading mt-2">Trusted Brands We Carry</h2>
          </FadeUp>
        </div>

        {/* Marquee Track */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAFAF8] dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAFAF8] dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-marquee w-max">
            {[...trustedBrands, ...trustedBrands].map((brand, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer group"
              >
                <div className="w-6 h-6 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-md flex items-center justify-center group-hover:bg-[#2F5D50] transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2F5D50] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-[#1F2937] dark:text-white whitespace-nowrap">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEWSLETTER ══════════════════ */}
      <section className="bg-[#1F2937] dark:bg-gray-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-gradient-to-br from-[#2F5D50] to-[#244A40] rounded-3xl p-10 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl border border-white/10">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4A64A]/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative">
                <div className="w-12 h-12 bg-[#D4A64A]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#D4A64A]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                  Get Exclusive Deals & Offers
                </h2>
                <p className="text-[#8FAE9D] text-sm mt-2 max-w-lg mx-auto">
                  Subscribe to our newsletter for new product launches, seasonal discounts, and corporate procurement offers delivered to your inbox.
                </p>
              </div>

              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
                onSubmit={(e) => { e.preventDefault(); }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A64A] transition"
                />
                <button
                  type="submit"
                  className="bg-[#D4A64A] hover:bg-[#b8893d] text-[#1F2937] font-black px-6 py-3 rounded-xl text-sm transition-all duration-300 shrink-0 cursor-pointer flex items-center gap-2"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[10px] text-white/30 relative">
                No spam ever. Unsubscribe anytime. By subscribing you agree to our privacy policy.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════ GET STARTED MODAL ══════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F2F4F3] dark:bg-gray-700 flex items-center justify-center text-[#4B5563] dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition cursor-pointer"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#2F5D50] dark:text-[#8FAE9D]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white font-heading">Welcome to Manvi Enterprises</h3>
              <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-xs leading-relaxed">
                Browse through our authorized product divisions — Exide, Luminous, Amaron, Castrol & Shell — configured for robust backup cycles.
              </p>
              <div className="w-full space-y-2.5 pt-2">
                <button
                  onClick={() => { setShowModal(false); navigate("/product"); }}
                  className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white py-3 rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  Explore Full Catalog
                </button>
                <button
                  onClick={() => { setShowModal(false); navigate("/contact"); }}
                  className="w-full border border-[#2F5D50] text-[#2F5D50] dark:text-[#8FAE9D] dark:border-[#8FAE9D] hover:bg-[#2F5D50] hover:text-white py-3 rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;