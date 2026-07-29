import React, { useState } from "react";
import { ShoppingCart, Heart, Eye, Star, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Stock badge logic
function StockBadge({ stock }) {
  if (stock > 20) {
    return (
      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-2.5 h-2.5" /> In Stock
      </span>
    );
  } else if (stock > 0) {
    return (
      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <AlertTriangle className="w-2.5 h-2.5" /> Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
      <XCircle className="w-2.5 h-2.5" /> Out of Stock
    </span>
  );
}

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Resolve product image URL correctly:
 * - /product/... → served from Netlify frontend CDN (relative path)
 * - /uploads/... → served from Render backend (prefix with backend URL)
 * - http(s)://... → absolute URL, use as-is
 */
function resolveImageUrl(img) {
  if (!img) return 'https://placehold.co/200x200?text=No+Image';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/product/')) return img; // served by Netlify CDN
  if (img.startsWith('/uploads/')) return `${BACKEND_URL}${img}`;
  return img;
}

const ProductCard = ({ product, onAddToCart }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlisted = isInWishlist(product.id);
  const [addedFlash, setAddedFlash] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;

    requireAuth(() => {
      if (typeof onAddToCart === "function") {
        onAddToCart(e, product);          // fly-to-cart animation on Product page
      } else {
        addToCart(product);               // direct add on Home / Wishlist / etc.
      }
      setAddedFlash(true);
      setTimeout(() => setAddedFlash(false), 1500);
    }, () => {
      navigate("/login", { state: { from: location } });
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    requireAuth(() => {
      toggleWishlist(product);
    }, () => {
      navigate("/login", { state: { from: location } });
    });
  };

  // Badge color mapping
  const badgeColors = {
    "Best Seller": "bg-[#2F5D50] text-white",
    "Top Rated": "bg-[#D4A64A] text-[#1F2937]",
    "Popular": "bg-blue-100 text-blue-700",
    "New Launch": "bg-violet-100 text-violet-700",
    "New Arrival": "bg-violet-100 text-violet-700",
    "Premium": "bg-[#1F2937] text-white",
    "Premium Plus": "bg-[#1F2937] text-white",
    "Hot": "bg-rose-500 text-white",
    "Reliable": "bg-slate-100 text-slate-700",
    "Top Choice": "bg-[#2F5D50] text-white",
    "Smart Tech": "bg-cyan-100 text-cyan-700",
  };
  const badgeClass = badgeColors[product.badge] || "bg-[#8FAE9D]/20 text-[#2F5D50]";

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2F5D50] shadow-sm hover:shadow-lg flex flex-col h-full w-full font-sans"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm ${badgeClass}`}>
          {product.badge}
        </span>
      )}

      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-[#D4A64A] text-[#1F2937] text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm">
          -{product.discount}%
        </span>
      )}

      {/* Product Image */}
      <div className="bg-[#FAFAF8] dark:bg-gray-700/50 p-4 flex items-center justify-center border-b border-[#E5E7EB] dark:border-gray-700 h-48 relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="max-w-full h-36 object-contain transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
          />
        </Link>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-[#2F5D50]/10 dark:bg-[#2F5D50]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 text-[#2F5D50] flex items-center justify-center shadow-md hover:bg-[#2F5D50] hover:text-white transition duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md transition duration-200 cursor-pointer ${
              isWishlisted
                ? "text-rose-500 hover:bg-rose-50"
                : "text-[#4B5563] hover:text-rose-500 hover:bg-rose-50"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-4 h-4 transition-all ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand + Stock */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase tracking-widest text-[#8FAE9D] font-extrabold stats-font">
            {product.brand}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white line-clamp-2 leading-tight min-h-[38px] font-heading hover:text-[#2F5D50] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(product.rating)
                  ? "fill-[#D4A64A] text-[#D4A64A]"
                  : "text-[#E5E7EB]"
              }`}
            />
          ))}
          <span className="text-xs font-bold text-[#1F2937] dark:text-white ml-0.5">{product.rating}</span>
          <span className="text-[10px] text-[#4B5563]/60 dark:text-gray-400">({product.reviews})</span>
        </div>

        {/* Key Spec */}
        <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-gray-700 space-y-1">
          {product.capacity && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#4B5563]/70 dark:text-gray-400 font-medium">Capacity</span>
              <span className="text-[#1F2937] dark:text-white font-semibold">{product.capacity}</span>
            </div>
          )}
          {product.warranty && product.warranty !== "No Warranty" && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#4B5563]/70 dark:text-gray-400 font-medium">Warranty</span>
              <span className="text-[#2F5D50] font-bold">{product.warranty}</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-[#1F2937] dark:text-white stats-font">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#4B5563]/50 dark:text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] ${
              addedFlash
                ? "bg-emerald-500 text-white"
                : product.stock === 0
                ? "bg-[#F2F4F3] text-[#4B5563]/50 cursor-not-allowed"
                : "bg-[#2F5D50] hover:bg-[#244A40] text-white shadow-sm hover:shadow-md"
            }`}
          >
            {addedFlash ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Added!
              </>
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;