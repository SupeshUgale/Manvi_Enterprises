import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Zap,
  BatteryCharging,
  Droplet,
  ChevronRight,
  Send,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { enterpriseInfo } from "../data/aboutC";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/product" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const categoryLinks = [
  { label: "Batteries", path: "/product?category=Battery", icon: BatteryCharging },
  { label: "Inverters & UPS", path: "/product?category=Inverter", icon: Zap },
  { label: "Engine Oils", path: "/product?category=Engine+Oil", icon: Droplet },
];

const socialLinks = [
  { Icon: FaFacebookF, href: enterpriseInfo.socialLinks.facebook, label: "Facebook" },
  { Icon: FaInstagram, href: enterpriseInfo.socialLinks.instagram, label: "Instagram" },
  { Icon: FaTwitter, href: enterpriseInfo.socialLinks.twitter, label: "Twitter" },
  { Icon: FaLinkedinIn, href: enterpriseInfo.socialLinks.linkedin, label: "LinkedIn" },
  { Icon: FaYoutube, href: enterpriseInfo.socialLinks.youtube, label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#1F2937] dark:bg-gray-950 text-white mt-0">
      {/* Newsletter Banner */}
      <div className="bg-[#2F5D50] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold font-heading text-white">
                Stay Updated with {enterpriseInfo.name}
              </h3>
              <p className="text-[#8FAE9D] text-sm mt-1">
                Get exclusive deals, product launches & industry insights.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A64A] transition"
              />
              <button
                type="submit"
                className="bg-[#D4A64A] hover:bg-[#b8893d] text-[#1F2937] font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {subscribed ? (
                  "✓ Subscribed!"
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2F5D50] flex items-center justify-center text-white font-black text-base">
                ME
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight logo-font">MANVI</span>
                <span className="text-[10px] font-bold text-[#8FAE9D] tracking-[0.2em] uppercase">ENTERPRISES</span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              {enterpriseInfo.description}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-[#D4A64A] shrink-0" />
                100% Genuine Products Guaranteed
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-[#D4A64A] shrink-0" />
                GST Registered Business (GSTIN Verified)
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#2F5D50] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#2F5D50] group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-extrabold text-white uppercase tracking-widest mt-7 mb-5">
              User
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors duration-200 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#2F5D50] group-hover:translate-x-0.5 transition-transform" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors duration-200 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#2F5D50] group-hover:translate-x-0.5 transition-transform" />
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors duration-200 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#2F5D50] group-hover:translate-x-0.5 transition-transform" />
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors duration-200 group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#2F5D50] group-hover:translate-x-0.5 transition-transform" />
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">
              Product Categories
            </h4>
            <ul className="space-y-3">
              {categoryLinks.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#2F5D50] flex items-center justify-center transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[#8FAE9D] group-hover:text-white" />
                    </div>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Featured Brands */}
            <div className="mt-8">
              <h5 className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-3">
                Featured Brands
              </h5>
              <div className="flex flex-wrap gap-2">
                {["Amaron", "Exide", "Luminous", "Castrol", "Shell", "Dreams"].map((brand) => (
                  <Link
                    key={brand}
                    to={`/product?brand=${brand}`}
                    className="text-[10px] font-semibold px-2.5 py-1 bg-white/5 hover:bg-[#2F5D50] text-gray-400 hover:text-white rounded-lg transition-all duration-200"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#D4A64A] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {enterpriseInfo.contact.shortAddress.split(', ').join(',\n')}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4A64A] shrink-0" />
                <a href={`tel:${enterpriseInfo.contact.phonePrimary.replace(/\s+/g, '')}`} className="text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors">
                  {enterpriseInfo.contact.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4A64A] shrink-0" />
                <a href={`mailto:${enterpriseInfo.contact.supportEmail}`} className="text-sm text-gray-400 hover:text-[#8FAE9D] transition-colors break-all">
                  {enterpriseInfo.contact.supportEmail}
                </a>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs font-bold text-[#8FAE9D] uppercase tracking-wider mb-3">
                Business Hours
              </p>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>{enterpriseInfo.businessHours.workingDays}</span>
                  <span className="text-white font-semibold">{enterpriseInfo.businessHours.timing}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#D4A64A] font-semibold">{enterpriseInfo.businessHours.sunday}</span>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2F5D50] hover:bg-[#244A40] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300"
            >
              Get in Touch <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {enterpriseInfo.name}. All rights reserved. | Authorized Distributor
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-[#8FAE9D] transition-colors">Privacy Policy</a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-[#8FAE9D] transition-colors">Terms of Service</a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-[#8FAE9D] transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
