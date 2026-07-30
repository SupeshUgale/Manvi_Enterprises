import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/auth";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithOtp } = useAuth();
  
  const email = location.state?.email;
  const redirect = location.state?.redirect || "/";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(2); // 2 seconds
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[focusIndex].focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Incomplete OTP",
        text: "Please enter all 6 digits.",
        confirmButtonColor: "#2F5D50"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const user = await loginWithOtp(email, otpValue);
      setIsSuccess(true);
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(redirect === "/" ? "/dashboard" : redirect, { replace: true });
        }
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "Invalid OTP entered.",
        confirmButtonColor: "#2F5D50"
      });
    } finally {
      if (!isSuccess) setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.sendOtp(email);
      setTimer(2);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      Swal.fire({
        icon: "success",
        title: "OTP Resent",
        text: "A new OTP has been sent to your email.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not resend OTP. Please try again.",
      });
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-gray-900 flex items-center justify-center p-4 py-20 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-[#E5E7EB] dark:border-gray-700 rounded-3xl p-8 shadow-2xl"
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white font-heading">Verified Successfully</h2>
            <p className="text-sm text-[#4B5563] dark:text-gray-400">Redirecting you securely...</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 bg-[#2F5D50]/10 text-[#2F5D50] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-[#1F2937] dark:text-white font-heading tracking-tight">
                Verify Your Account
              </h1>
              <p className="text-sm text-[#4B5563] dark:text-gray-400 font-medium">
                We've sent a 6-digit secure code to <br/>
                <span className="font-bold text-[#1F2937] dark:text-white">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    name="otp"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-bold bg-[#F2F4F3] dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-xl focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1F2937] dark:text-white transition-all outline-none"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-[#4B5563] dark:text-gray-400">
                  Time remaining: <span className="text-[#2F5D50] font-mono">{formatTime(timer)}</span>
                </span>
                <button
                  type="button"
                  disabled={!canResend || isVerifying}
                  onClick={handleResend}
                  className={`flex items-center gap-1.5 transition-colors ${
                    canResend 
                      ? "text-[#D4A64A] hover:text-[#b8893d] cursor-pointer" 
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${!canResend && timer > 0 ? "animate-spin-slow" : ""}`} />
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify & Proceed"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#4B5563] dark:text-gray-400 hover:text-[#2F5D50] dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
