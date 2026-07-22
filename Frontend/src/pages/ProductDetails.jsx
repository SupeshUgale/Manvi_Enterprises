import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";
import {
  ArrowLeft,
  Star,
  Check,
  Shield,
  Heart,
  ShoppingCart,
  Zap,
  BatteryCharging,
  Droplet,
  MessageSquare,
  Bookmark,
  Share2,
  Edit3,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, requireAuth } = useAuth();
  const { products } = useProduct();

  const product = products.find((p) => p.id === Number(id));


  // State management
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("specifications");
  const [newReview, setNewReview] = useState({ name: "", rating: "5", comment: "" });
  const [reviewsList, setReviewsList] = useState([
    { name: "Amit Sharma", rating: 5, comment: "Excellent backup time. Highly recommended for heavy load.", date: "July 12, 2026" },
    { name: "Rahul Verma", rating: 4, comment: "Working as expected. Very fast charging capability.", date: "July 14, 2026" },
  ]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="bg-[#FAFAF8] min-h-[70vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold font-heading text-[#1F2937]">Product Not Found</h2>
        <Link to="/product" className="mt-4 text-[#2F5D50] hover:underline font-semibold flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      Swal.fire("Error", "Please fill in all review fields", "error");
      return;
    }
    const createdReview = {
      name: newReview.name,
      rating: Number(newReview.rating),
      comment: newReview.comment,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    setReviewsList([createdReview, ...reviewsList]);
    setNewReview({ name: "", rating: "5", comment: "" });
    Swal.fire({
      icon: "success",
      title: "Review Submitted",
      text: "Thank you for your feedback!",
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#2F5D50",
      customClass: {
        popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
      }
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      icon: "success",
      title: "Link Copied",
      text: "Product URL copied to clipboard.",
      timer: 1200,
      showConfirmButton: false,
      confirmButtonColor: "#2F5D50",
      customClass: {
        popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
      }
    });
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Link & Admin Action */}
        <div className="flex items-center justify-between">
          <Link
            to="/product"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F5D50] hover:text-[#244A40] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
          </Link>
          {user?.role === "admin" && (
            <Link
              to={`/dashboard?tab=products&edit=${product.id}`}
              className="inline-flex items-center gap-1.5 bg-[#D4A64A] text-[#1F2937] hover:bg-[#b88e39] font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Product Info (Admin)
            </Link>
          )}
        </div>

        {/* Product Brief Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-6 h-[400px] flex items-center justify-center relative overflow-hidden group">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={activeImage}
                alt={product.name}
                className="max-h-[350px] object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 bg-white border border-[#E5E7EB] rounded-full text-[#4B5563] hover:text-[#2F5D50] transition shadow-xs cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white transition-all flex items-center justify-center cursor-pointer ${
                      activeImage === img ? "border-[#2F5D50] shadow-xs" : "border-[#E5E7EB] hover:border-[#8FAE9D]"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8FAE9D] font-extrabold stats-font">
                {product.brand}
              </span>
              <h1 className="text-3xl font-bold text-[#1F2937] font-heading leading-tight mt-1">
                {product.name}
              </h1>
              <p className="text-xs font-semibold text-[#8FAE9D] mt-1 font-mono uppercase tracking-wider">
                SKU: {product.sku}
              </p>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#D4A64A] text-[#D4A64A]" />
                <span className="text-sm font-bold text-[#1F2937]">{product.rating}</span>
              </div>
              <span className="text-xs text-[#4B5563]/70">|</span>
              <span className="text-xs font-semibold text-[#2F5D50] hover:underline cursor-pointer flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> {reviewsList.length} Customer Reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {product.description}
            </p>

            {/* Pricing */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB] p-5 flex items-baseline justify-between">
              <div>
                <p className="text-xs text-[#4B5563] font-semibold uppercase tracking-wider mb-1">Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#1F2937]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#4B5563]/50 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {product.discount && (
                <span className="bg-[#D4A64A] text-[#1F2937] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Stock Badge & Warranty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2F5D50]/10 flex items-center justify-center text-[#2F5D50]">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#4B5563] font-semibold uppercase">Status</p>
                  <p className="text-xs font-bold text-[#2F5D50]">
                    {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                  </p>
                </div>
              </div>

              <div className="border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4A64A]/10 flex items-center justify-center text-[#D4A64A]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#4B5563] font-semibold uppercase">Warranty</p>
                  <p className="text-xs font-bold text-[#1F2937]">{product.warranty || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => requireAuth(() => addToCart(product), () => navigate("/login", { state: { from: location } }))}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-3 rounded-xl transition duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => requireAuth(() => toggleWishlist(product), () => navigate("/login", { state: { from: location } }))}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-500"
                    : "bg-white border-[#E5E7EB] text-[#4B5563] hover:text-[#2F5D50] hover:border-[#2F5D50]"
                }`}
                title="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Specs, Features, Reviews */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-xs">
          <div className="flex border-b border-[#E5E7EB] gap-6 mb-6 overflow-x-auto no-scrollbar">
            {["specifications", "features", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold capitalize tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-[#2F5D50] text-[#2F5D50]"
                    : "text-[#4B5563]/60 hover:text-[#1F2937]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Specifications Panel */}
          {activeTab === "specifications" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E5E7EB]">
                      <span className="text-xs capitalize font-semibold text-[#4B5563]">{key}</span>
                      <span className="text-xs font-bold text-[#1F2937]">{val}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Features Panel */}
          {activeTab === "features" && (
            <div className="space-y-3">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAFAF8] rounded-xl p-3 border border-[#E5E7EB]">
                    <div className="w-5 h-5 rounded-full bg-[#2F5D50]/15 flex items-center justify-center text-[#2F5D50]">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-[#4B5563] font-medium">{feat}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#4B5563]/50">No special features listed for this product.</p>
              )}
            </div>
          )}

          {/* Reviews Panel */}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-[#1F2937] font-heading">Reviews ({reviewsList.length})</h3>
                <div className="space-y-4 divide-y divide-[#E5E7EB]">
                  {reviewsList.map((rev, idx) => (
                    <div key={idx} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-[#1F2937] text-sm">{rev.name}</p>
                        <p className="text-[10px] text-[#4B5563]/60">{rev.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D4A64A] text-[#D4A64A]" />
                        ))}
                      </div>
                      <p className="text-xs text-[#4B5563] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write Review Form */}
              <div className="bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB] p-6 space-y-4 h-fit">
                <h3 className="text-base font-bold text-[#1F2937] font-heading">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl px-3 py-2 text-[#1F2937] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                      className="w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl px-3 py-2 text-[#1F2937] focus:outline-none transition"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1F2937] uppercase tracking-wider mb-2">Comment</label>
                    <textarea
                      required
                      rows="3"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Write your review here..."
                      className="w-full bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl px-3 py-2 text-[#1F2937] focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2 rounded-xl transition duration-300 cursor-pointer shadow-xs"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
