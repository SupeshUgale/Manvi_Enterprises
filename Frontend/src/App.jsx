import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./pages/Home";
import About from "./pages/about";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import UserDashboard from "./pages/UserDashboard";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import VerifyOTP from "./pages/VerifyOTP";

// Import your Admin Dashboard component
import AdminDashboard from "./pages/AdminDashboard";

import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, setUser } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar user={user} setUser={setUser} cartCount={cartCount} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Routes — redirect logged-in users away based on role */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin/dashboard" : "/"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/verify-otp"
          element={user ? <Navigate to="/" replace /> : <VerifyOTP />}
        />

        {/* User Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            user ? <UserDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;