import React from "react";
import { Link } from "react-router-dom";
import {
  BatteryCharging, Zap, Sun, Droplet, Shield, Truck, HeadphonesIcon,
  Settings, CheckCircle2, ArrowRight, Building2, Star, Clock,
  Users, Award, ChevronRight, Wrench, Phone
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "../Components/Breadcrumb";

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const services = [
  {
    icon: BatteryCharging,
    title: "Battery Installation & Replacement",
    desc: "Professional on-site battery installation for automotive, inverter, and solar applications with proper torque calibration and terminal protection.",
    features: ["Car & Bike Battery Fitting", "Inverter Battery Setup", "Solar Battery Bank Wiring", "Old Battery Disposal"],
    tag: "Field Service",
    color: "from-emerald-500/10 to-transparent",
    border: "border-emerald-200",
  },
  {
    icon: Zap,
    title: "Inverter & UPS Setup",
    desc: "End-to-end installation of home and office UPS systems including wiring, load balancing, and safety circuit breaker integration.",
    features: ["Home UPS Wiring", "Office Power Backup", "Load Balancing", "MCB & Earthing Setup"],
    tag: "Installation",
    color: "from-amber-500/10 to-transparent",
    border: "border-amber-200",
  },
  {
    icon: Sun,
    title: "Solar Power Solutions",
    desc: "Design and deployment of residential and commercial solar PV systems with MPPT charge controllers and net metering documentation.",
    features: ["System Design & Sizing", "Panel Mounting & Wiring", "MPPT Configuration", "Net Metering Assistance"],
    tag: "Green Energy",
    color: "from-orange-500/10 to-transparent",
    border: "border-orange-200",
  },
  {
    icon: Shield,
    title: "Annual Maintenance Contracts",
    desc: "Scheduled preventive maintenance for batteries, inverters, and solar plants ensuring peak performance and extended equipment life.",
    features: ["Quarterly Inspections", "Battery Water Top-Up", "Terminal Cleaning", "Performance Reports"],
    tag: "AMC Plans",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-200",
  },
  {
    icon: Building2,
    title: "Corporate & B2B Supply",
    desc: "Bulk procurement channel for enterprises, factories, and institutions with GST invoicing, credit lines, and dedicated account managers.",
    features: ["Volume Discounts", "GST B2B Invoices", "Credit Facility", "Dedicated Account Manager"],
    tag: "Enterprise",
    color: "from-violet-500/10 to-transparent",
    border: "border-violet-200",
  },
  {
    icon: Wrench,
    title: "Technical Consultation",
    desc: "Expert advisory on selecting the right power backup configuration, battery chemistry, and inverter ratings for your specific load requirements.",
    features: ["Load Calculation", "Battery Selection Guide", "Inverter Sizing", "Post-sale Support"],
    tag: "Expert Advice",
    color: "from-rose-500/10 to-transparent",
    border: "border-rose-200",
  },
];

const process = [
  { step: "01", title: "Enquire", desc: "Contact us via call, email, or the website form with your requirements.", icon: Phone },
  { step: "02", title: "Consultation", desc: "Our technical team assesses your load requirement and recommends the right setup.", icon: Users },
  { step: "03", title: "Quotation", desc: "Receive a detailed itemized quote with all specifications and warranty terms.", icon: Award },
  { step: "04", title: "Delivery & Install", desc: "Products are delivered and installed by our certified field technicians.", icon: Truck },
  { step: "05", title: "After-Sales Support", desc: "Dedicated post-installation support and annual maintenance plans available.", icon: HeadphonesIcon },
];

const highlights = [
  { value: "15+", label: "Premium Brands" },
  { value: "10K+", label: "Installations Done" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5yr", label: "Avg. Battery Life" },
];

export default function Services() {
  return (
    <div className="bg-[#FAFAF8] dark:bg-gray-900 min-h-screen font-sans">

      {/* ──── PAGE HERO ──── */}
      <section className="relative bg-gradient-to-br from-[#2F5D50] via-[#244A40] to-[#1a3830] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D4A64A]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <Breadcrumb items={[{ label: "Services" }]} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mt-6 space-y-4"
          >
            <span className="inline-block text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">
              What We Offer
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-heading leading-tight">
              End-to-End Power Solutions for Every Need
            </h1>
            <p className="text-[#8FAE9D] text-base leading-relaxed max-w-2xl">
              From battery installation and inverter setup to corporate bulk supply and technical consultation — Manvi Enterprises provides comprehensive energy and power services backed by authorized brand support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#D4A64A] hover:bg-[#b8893d] text-[#1F2937] font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300"
              >
                Request a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/product"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300"
              >
                Browse Products <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── HIGHLIGHT STATS ──── */}
      <section className="border-b border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {highlights.map((h, idx) => (
              <FadeUp key={h.label} delay={idx * 0.08}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#2F5D50] dark:text-[#8FAE9D] stats-font">{h.value}</p>
                  <p className="text-xs font-semibold text-[#4B5563] dark:text-gray-400 mt-1 uppercase tracking-wider">{h.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ──── SERVICE CARDS ──── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">
              Comprehensive Service Portfolio
            </h2>
            <p className="text-[#4B5563] dark:text-gray-400 text-sm">
              Certified technicians, genuine products, and professional aftercare — everything your power infrastructure needs.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <FadeUp key={svc.title} delay={idx * 0.07}>
                  <div className={`group bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] dark:hover:border-[#2F5D50] rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full`}>
                    {/* Icon + Tag */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} border ${svc.border} flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D] group-hover:bg-[#2F5D50] group-hover:text-white group-hover:border-[#2F5D50] transition-all duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#8FAE9D] bg-[#F2F4F3] dark:bg-gray-700 px-2.5 py-1 rounded-full">
                        {svc.tag}
                      </span>
                    </div>

                    <div className="space-y-2 flex-grow">
                      <h3 className="text-base font-bold text-[#1F2937] dark:text-white font-heading group-hover:text-[#2F5D50] dark:group-hover:text-[#8FAE9D] transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-[#4B5563] dark:text-gray-400 leading-relaxed">{svc.desc}</p>
                    </div>

                    {/* Feature List */}
                    <ul className="space-y-1.5 pt-2 border-t border-[#E5E7EB] dark:border-gray-700">
                      {svc.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#4B5563] dark:text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5D50] dark:text-[#8FAE9D] shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#2F5D50] dark:text-[#8FAE9D] hover:gap-3 transition-all pt-1"
                    >
                      Enquire Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── PROCESS STEPS ──── */}
      <section className="bg-[#F2F4F3] dark:bg-gray-800/60 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E7EB] dark:border-gray-700">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeUp className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-heading">Our Service Process</h2>
            <p className="text-[#4B5563] dark:text-gray-400 text-sm">Simple, transparent, and fully managed — from enquiry to installation.</p>
          </FadeUp>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] dark:via-gray-600 to-transparent z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {process.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <FadeUp key={step.step} delay={idx * 0.1}>
                    <div className="relative flex flex-col items-center text-center space-y-3 z-10">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-[#2F5D50] rounded-2xl flex items-center justify-center text-[#2F5D50] dark:text-[#8FAE9D] shadow-md relative">
                        <Icon className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4A64A] text-[#1F2937] text-[9px] font-black rounded-full flex items-center justify-center">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1F2937] dark:text-white text-sm font-heading">{step.title}</h3>
                      <p className="text-xs text-[#4B5563] dark:text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──── QUALITY PROMISE ──── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="bg-[#2F5D50] rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="space-y-4">
                <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.25em] stats-font">Quality Promise</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                  Certified Distribution with Zero Compromise
                </h2>
                <p className="text-[#8FAE9D] text-sm leading-relaxed">
                  All inventory undergoes double QA auditing for voltage output compliance, warranty registration, and brand authenticity. Every product comes with the full manufacturer warranty.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {["Original Warranty Seal", "Brand Authenticated Stock", "GST Compliant Invoicing", "Post-Install Support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#D4A64A] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#D4A64A] text-[#D4A64A]" />
                    <span className="text-white font-bold text-sm">4.9/5 Average Rating</span>
                  </div>
                  <p className="text-[#8FAE9D] text-xs">Based on 10,000+ verified corporate client reviews.</p>
                </div>
                <Link
                  to="/contact"
                  className="w-full bg-[#D4A64A] hover:bg-[#b8893d] text-[#1F2937] font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/product"
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10 font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Product Catalog <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
