import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Clock,
  BatteryCharging,
  Sun,
  Flame,
  Droplet,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Eye,
  Building2,
  Box,
  BadgePercent,
  ChevronRight,
  Users,
} from "lucide-react";
import { enterpriseInfo } from "../data/aboutC";

export default function About() {
  const stats = [
    { value: "10+", label: "Years Experience", icon: Clock, description: "Serving India with pride" },
    { value: "5000+", label: "Happy Customers", icon: Users, description: "Residential & Corporate" },
    { value: "100+", label: "Products Offered", icon: Box, description: "Top-tier brand lineup" },
    { value: "24/7", label: "Customer Support", icon: Headphones, description: "Dedicated corporate team" },
  ];

  const categories = [
    { title: "Battery Solutions", description: "High-performance automotive, tubular, and solar batteries.", icon: BatteryCharging, path: "/product?category=Battery" },
    { title: "Solar Panels", description: "High-efficiency monocrystalline solar systems for clean power.", icon: Sun, path: "/product?category=Battery" },
    { title: "Inverters", description: "Pure sine wave home inverters & heavy-duty industrial UPS.", icon: Zap, path: "/product?category=Inverter" },
    { title: "Engine Oils", description: "Premium synthetic & mineral lubricants for maximum engine protection.", icon: Droplet, path: "/product?category=Engine Oil" },
  ];

  const whyChooseUs = [
    { title: "100% Genuine Products", description: "Sourced from authorized brand channels with warranty.", icon: ShieldCheck },
    { title: "Affordable Pricing", description: "Wholesale and retail pricing with maximum trade-in value.", icon: BadgePercent },
    { title: "Fast Local Delivery", description: "Prompt doorstep delivery across Nagpur and regions.", icon: Truck },
    { title: "Expert Guidance", description: "Technical specialists to calculate exact load capacity.", icon: Award },
    { title: "Trusted Brands", description: "Authorized distributor for Exide, Amaron, Luminous, etc.", icon: Building2 },
    { title: "After Sales Support", description: "Hassle-free warranty replacements and checkups.", icon: Headphones },
  ];

  const brands = [
    { name: "Exide", tag: "Batteries" },
    { name: "Amaron", tag: "Power" },
    { name: "Luminous", tag: "Solar & UPS" },
    { name: "Livguard", tag: "Energy" },
    { name: "Microtek", tag: "Inverters" },
    { name: "Shell", tag: "Lubricants" },
  ];

  return (
    <div className="bg-[#FAFAF8] text-[#4B5563] antialiased font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8FAE9D]/20 border border-[#8FAE9D]/30 text-[#2F5D50] text-xs font-bold tracking-wide stats-font">
              <Sparkles className="w-4 h-4 text-[#2F5D50]" />
              <span>About {enterpriseInfo.name}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F2937] tracking-tight leading-[1.15] font-heading">
              Powering Homes &amp; Industries Across <span className="text-[#2F5D50]">India</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed font-normal">
              {enterpriseInfo.name} is a trusted distributor of premium Batteries, Solar Panels, Inverters, Engine Oils, and Power Solutions. {enterpriseInfo.mission}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold text-base shadow-xs transition-all duration-300"
              >
                Explore Catalog
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#8FAE9D] hover:bg-[#2F5D50] hover:text-white text-[#1F2937] font-semibold text-base transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COMPANY OVERVIEW (SECTION BG: #F2F4F3) */}
      <section className="py-20 bg-[#F2F4F3] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Side Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200"
                  alt="Technician working on energy systems"
                  className="w-full h-[380px] sm:h-[450px] object-cover"
                />
              </div>
            </div>

            {/* Right Side Info */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-bold text-[#2F5D50] uppercase tracking-wider bg-[#8FAE9D]/20 px-3 py-1 rounded-full border border-[#8FAE9D]/30 stats-font">
                Who We Are
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] tracking-tight font-heading">
                {enterpriseInfo.tagline}
              </h2>

              <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed">
                Founded with a vision to deliver uncompromised energy solutions, {enterpriseInfo.name} has grown into a leading distributor of batteries, solar modules, pure sine wave inverters, and lubricants. We manage complex industrial installations with guaranteed manufacturer compliance.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  "Genuine Products",
                  "Fast Delivery",
                  "Expert Support",
                  "Fair Prices",
                  "Warranty Assured",
                  "Site Diagnostics",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1F2937]">
                    <CheckCircle2 className="w-4 h-4 text-[#2F5D50] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATS SECTION (#FAFAF8) */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F2F4F3] p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#2F5D50] transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl sm:text-4xl font-semibold text-[#2F5D50] stats-font">
                      {stat.value}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#8FAE9D]/20 text-[#2F5D50] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937] font-heading">{stat.label}</h3>
                  <p className="text-xs text-[#4B5563] mt-1">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION (#F2F4F3) */}
      <section className="py-20 bg-[#F2F4F3] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#2F5D50] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#2F5D50]/15 text-[#2F5D50] flex items-center justify-center mb-6">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-heading">Our Mission</h3>
              <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed">
                "{enterpriseInfo.mission}"
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#2F5D50] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#8FAE9D]/20 text-[#2F5D50] flex items-center justify-center mb-6">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-heading">Our Vision</h3>
              <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed">
                "{enterpriseInfo.vision}"
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRODUCTS WE OFFER (#FAFAF8) */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em] stats-font">
              Catalog Overview
            </span>
            <h2 className="text-3xl font-bold text-[#1F2937] font-heading">
              Products &amp; Services We Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F2F4F3] p-7 rounded-2xl border border-[#E5E7EB] hover:border-[#2F5D50] shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#8FAE9D]/20 text-[#2F5D50] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937] font-heading">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <Link to={cat.path} className="pt-6 mt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-[#2F5D50] hover:text-[#244A40]">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. TRUSTED BRANDS (#F2F4F3) */}
      <section className="py-16 bg-[#F2F4F3] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-[#1F2937] mb-8 font-heading">
            Trusted Manufacturer Brand Partners
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-white py-6 px-4 rounded-2xl border border-[#E5E7EB] flex flex-col items-center justify-center shadow-xs"
              >
                <span className="text-lg font-black text-[#1F2937] uppercase tracking-wider font-heading">
                  {brand.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#8FAE9D] mt-0.5 stats-font">
                  {brand.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}