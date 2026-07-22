import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = (items) => {
    setWishlistItems(items);
    localStorage.setItem("wishlist", JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        text: `${product.name} is already in your wishlist.`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
        customClass: {
          popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
        }
      });
      return;
    }

    const updated = [...wishlistItems, product];
    saveToLocalStorage(updated);

    Swal.fire({
      icon: "success",
      title: "Added to Wishlist",
      text: `${product.name} has been added to your wishlist.`,
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#2F5D50",
      customClass: {
        popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
      }
    });
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    saveToLocalStorage(updated);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      Swal.fire({
        icon: "success",
        title: "Removed from Wishlist",
        text: `${product.name} has been removed.`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
        customClass: {
          popup: "rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] shadow-xl text-[#1F2937]"
        }
      });
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
