import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { UserPlus, ArrowRight, Mail, User, Phone, MapPin, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const from = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) navigate(from, { replace: true });
  }, [navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register(formData);
      Swal.fire({
        icon: "success",
        title: "Registration Pending",
        text: `An OTP has been sent to ${formData.email} to verify your account.`,
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
      }).then(() => {
        navigate("/verify-otp", { state: { email: formData.email, redirect: from } });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Could not register your account. Please try again.",
        confirmButtonColor: "#2F5D50",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp = "w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl pl-10 pr-4 py-2.5 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 transition-all duration-300 text-sm";
  const lbl = "block text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-2";

  return (
    <div className="bg-[#FAFAF8] dark:bg-gray-900 min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-3xl p-8 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-2xl flex items-center justify-center mx-auto text-[#2F5D50] dark:text-[#8FAE9D] mb-4">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-white font-heading">
            Create an Account
          </h2>
          <p className="text-sm text-[#4B5563] dark:text-gray-400 mt-1">
            Join Manvi Enterprises today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={lbl}>Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]/60" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className={inp}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={lbl}>Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]/60" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={inp}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={lbl}>Mobile Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]/60" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className={inp}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={lbl}>Complete Delivery Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#4B5563]/60" />
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Flat No, Building, Street, City, State, PIN"
                rows={3}
                className="w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl pl-10 pr-4 py-2.5 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 transition-all duration-300 text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-3 rounded-xl transition duration-300 shadow-sm flex items-center justify-center gap-2 group cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#4B5563] dark:text-gray-400 pt-2 border-t border-[#E5E7EB] dark:border-gray-700">
          Already have an account?{" "}
          <Link to="/login" state={{ from: location.state?.from }} className="text-[#2F5D50] dark:text-[#8FAE9D] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
