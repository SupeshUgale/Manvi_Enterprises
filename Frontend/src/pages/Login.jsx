import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import users from "../data/users";
import Swal from "sweetalert2";
import { authService } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { 
  Building2, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck,
  Zap,
  Crown,
  User,
  RefreshCw
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [portalType, setPortalType] = useState('client'); 
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    rememberMe: false,
  });

  // Where to redirect after login (default is home)
  const from = location.state?.from?.pathname || "/";

  // If user is already logged in, send them straight away
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const parsedUser = JSON.parse(loggedUser);
      if (parsedUser.role === "admin") {
        navigate("/dashboard?tab=products", { replace: true });
      } else {
        navigate(from === "/" ? "/dashboard" : from, { replace: true });
      }
    }
  }, [navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const sendOtpReq = async (email) => {
    if (!email) return;
    setIsSending(true);
    try {
      // Bypassing OTP logic for now, using a mock OTP "123456" to login directly
      const user = await login(email, "123456");
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user.name}!`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
      }).then(() => {
        if (user.role === "admin") {
          navigate("/dashboard?tab=products", { replace: true });
        } else {
          navigate(from === "/" ? "/dashboard" : from, { replace: true });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to login. Please try again.",
        confirmButtonColor: "#2F5D50",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickLogin = (role) => {
    let email = '';
    if (role === 'user') {
      email = users.find(u => u.role === 'user').email;
      setPortalType('client');
    } else {
      email = users.find(u => u.role === 'admin').email;
      setPortalType('employee');
    }
    setFormData({ email, rememberMe: true });
    sendOtpReq(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendOtpReq(formData.email);
  };

  return (
    <div className="bg-[#FAFAF8] text-[#4B5563] min-h-screen flex flex-col justify-center py-16 px-6 sm:px-12 font-sans">
      
      {/* Container Box */}
      <div className="max-w-md w-full mx-auto bg-[#F2F4F3] rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-[#2F5D50] text-white p-8 text-center relative">
          <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Building2 className="w-6 h-6 text-[#8FAE9D]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Manvi Enterprises</h2>
          <p className="text-[10px] text-white/90 mt-1 uppercase tracking-widest font-bold">
            Secure Portal Access
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="bg-[#FAFAF8] p-4 border-b border-[#E5E7EB]">
          <p className="text-[10px] font-bold text-[#2F5D50] uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5 stats-font">
            <Zap className="w-3.5 h-3.5 fill-[#D4A64A] text-[#D4A64A] border-none" /> Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleQuickLogin('user')}
              className="py-2.5 px-3 bg-white hover:bg-[#F2F4F3] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] shadow-xs transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <User className="w-3.5 h-3.5 text-[#8FAE9D]" />
              User Demo
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleQuickLogin('admin')}
              className="py-2.5 px-3 bg-white hover:bg-[#F2F4F3] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] shadow-xs transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Crown className="w-3.5 h-3.5 text-[#8FAE9D]" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* SIGN IN FORM */}
        <div>
          {/* Portal Type Switcher (Tabs) */}
          <div className="grid grid-cols-2 bg-[#FAFAF8] p-1.5 border-b border-[#E5E7EB] text-xs font-bold">
            <button
              type="button"
              onClick={() => setPortalType('client')}
              className={`py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                portalType === 'client'
                  ? 'bg-[#2F5D50] text-white font-bold shadow-xs'
                  : 'text-[#1F2937] hover:bg-[#F2F4F3]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              User Portal
            </button>
            
            <button
              type="button"
              onClick={() => setPortalType('employee')}
              className={`py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                portalType === 'employee'
                  ? 'bg-[#2F5D50] text-white font-bold shadow-xs'
                  : 'text-[#1F2937] hover:bg-[#F2F4F3]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {/* Form Body */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
              
              {/* Email / ID */}
              <div>
                <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">
                  {portalType === 'employee' ? 'Employee Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5563]/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={portalType === 'employee' ? 'admin@manvienterprises.in' : 'user@example.com'}
                    className="w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl pl-10 pr-4 py-2.5 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2F5D50] focus:ring-[#2F5D50] border-[#E5E7EB] rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2.5 block font-bold text-[#4B5563] cursor-pointer">
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending || !formData.email}
                className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-3 px-4 rounded-xl shadow-xs transition duration-300 flex items-center justify-center gap-2 mt-2 cursor-pointer text-xs disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    Login Securely <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center font-sans text-xs text-[#4B5563] mt-4 pt-4 border-t border-[#E5E7EB]">
              New customer?{" "}
              <Link to="/register" state={{ from: location.state?.from }} className="text-[#2F5D50] font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}