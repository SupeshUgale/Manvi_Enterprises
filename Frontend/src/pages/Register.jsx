import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { UserPlus, ArrowRight, Mail, User, Phone, MapPin, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const from = location.state?.from?.pathname || "/";

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const validateForm = () => {
    const { username, email, password, confirmPassword, phone, address } = formData;

    if (!username.trim() || !email.trim() || !password || !confirmPassword || !phone.trim() || !address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#2F5D50",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#2F5D50",
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
        confirmButtonColor: "#2F5D50",
      });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
        confirmButtonColor: "#2F5D50",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
     await authService.register({
  name: formData.username,
  email: formData.email,
  password: formData.password,
  phone: formData.phone,
  address: formData.address,
});

      Swal.fire({
        icon: "success",
        title: "Registration Pending",
        text: `An OTP has been sent to ${formData.email} to verify your account.`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/verify-otp", { state: { email: formData.email, redirect: from } });
      });
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.message || "Could not register your account. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: serverMessage,
        confirmButtonColor: "#2F5D50",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common UI classes
  const inputClass =
    "w-full bg-[#FAFAF8] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-700 text-[#1F2937] dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 focus:border-[#2F5D50] transition-all duration-200 placeholder:text-gray-400";
  const labelClass =
    "block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500";

  return (
    <div className="bg-[#FAFAF8] dark:bg-gray-950 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 rounded-2xl flex items-center justify-center mx-auto text-[#2F5D50] dark:text-[#8FAE9D] shadow-inner">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white font-heading">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Join Manvi Enterprises to manage orders and delivery
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Full Name */}
          <div>
            <label className={labelClass}>Username / Full Name *</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                required
                autoComplete="name"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address *</label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Password & Confirm Password - Grid on medium+ screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password *</label>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirm Password *</label>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className={labelClass}>Mobile Number *</label>
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className={inputClass}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Delivery Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Flat No, Building, Street, City, State, PIN"
                rows={2}
                className={`${inputClass} pl-10 pr-4 py-2.5 resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="text-[#2F5D50] dark:text-[#8FAE9D] font-bold hover:underline transition-all"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}