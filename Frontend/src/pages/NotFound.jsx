import React from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-[#FAFAF8] min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 text-center font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm space-y-6"
      >
        <AlertOctagon className="w-16 h-16 text-[#D4A64A] mx-auto stroke-1 animate-bounce" />
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-[#1F2937] font-stats">404</h1>
          <h2 className="text-xl font-bold text-[#1F2937] font-heading">Page Not Found</h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            The requested page is missing or has been relocated within the Manvi Enterprises network.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-2.5 px-6 rounded-xl transition duration-300 text-xs cursor-pointer shadow-xs"
          >
            <Home className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
