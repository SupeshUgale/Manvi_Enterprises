import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../Components/ProductCard";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold font-heading text-[#1F2937]">My Wishlist</h1>
          <p className="text-sm text-[#4B5563] mt-1 font-sans">
            Keep track of your favorite products.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center shadow-xs"
          >
            <Heart className="w-16 h-16 mx-auto text-[#8FAE9D] mb-4 stroke-1 animate-pulse" />
            <h3 className="text-xl font-bold text-[#1F2937] font-heading">Your wishlist is empty</h3>
            <p className="text-sm text-[#4B5563] max-w-sm mx-auto mt-2 mb-6 font-sans">
              Browse our comprehensive catalog of batteries, inverters, solar panels, and engine oils to add items here.
            </p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 bg-[#2F5D50] hover:bg-[#244A40] text-white font-semibold py-2.5 px-6 rounded-xl transition duration-300 text-sm font-sans cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" /> Shop Catalog
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-12 z-20 w-8 h-8 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 shadow-xs cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
