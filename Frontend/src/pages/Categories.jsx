import React from "react";
import { Link } from "react-router-dom";
import { BatteryCharging, Zap, Droplet, Layers, ShieldCheck, ArrowRight, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

const ICON_MAP = {
  BatteryCharging,
  Zap,
  Droplet,
  Layers,
};

export default function Categories() {
  const { categories, products } = useProduct();
  const { user } = useAuth();

  const getProductCount = (slug) => {
    const count = products.filter(
      (p) => p.category === slug || (slug === "Inverter" && (p.category === "Inverter" || p.category === "UPS"))
    ).length;
    return `${count} Product${count === 1 ? "" : "s"} Available`;
  };


  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em] stats-font">
            Product Divisions
          </span>
          <h1 className="text-4xl font-bold font-heading text-[#1F2937]">Browse Categories</h1>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Manvi Enterprises distributes authentic high-performance electrical products, batteries, and industrial power solutions across national channels.
          </p>
        </div>

        {/* Admin Quick Action Banner */}
        {user?.role === "admin" && (
          <div className="bg-[#2F5D50]/10 border border-[#2F5D50]/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2F5D50]">
              <ShieldCheck className="w-4 h-4" /> Admin Access: You can add or edit product categories dynamically.
            </div>
            <Link
              to="/dashboard?tab=categories"
              className="bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Manage Categories
            </Link>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = ICON_MAP[cat.icon] || Layers;
            const countText = getProductCount(cat.slug);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-[#E5E7EB] hover:border-[#2F5D50] rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative bg-[#F2F4F3] border-b border-[#E5E7EB]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-xs font-black uppercase tracking-wider stats-font bg-[#2F5D50] px-3 py-1 rounded-full shadow-xs">
                      {countText}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center text-[#2F5D50]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1F2937] font-heading">{cat.name}</h2>
                  </div>

                  <p className="text-xs text-[#4B5563] leading-relaxed flex-grow">
                    {cat.desc}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={`/product?category=${cat.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#F2F4F3] group-hover:bg-[#2F5D50] text-[#1F2937] group-hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-300 cursor-pointer"
                    >
                      Explore division
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Banner Section */}
        <div className="bg-[#2F5D50] rounded-3xl border border-[#2F5D50] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs mt-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold font-heading">Certified Distribution Partner</h3>
            <p className="text-xs text-[#8FAE9D] max-w-xl font-sans">
              All inventory segments undergo double QA auditing protocols for backup parameters, voltage output checks, and synthetic multi-grade compliance parameters.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#D4A64A]" />
            <span className="text-xs font-bold font-sans">100% Original Brand Assured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
