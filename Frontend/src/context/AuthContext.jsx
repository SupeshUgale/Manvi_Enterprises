import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/auth";
import SecureLoader from "../Components/SecureLoader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state by verifying token with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Verify session token against backend /auth/me
          const response = await authService.getCurrentUser();
          const userData = response.user || response;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        // Handle expired/stale tokens gracefully on session init
        console.warn("Session token expired or reset:", error.message || error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Standard Email & Password Login
   */
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || "Invalid login response from server");
  };

  /**
   * OTP Verification Login
   */
  const loginWithOtp = async (email, otp) => {
    const response = await authService.verifyOtp(email, otp);
    if (response && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || "Invalid OTP response from server");
  };

  /**
   * User Logout
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Backend logout notification warning:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  /**
   * Intercept unauthenticated user actions
   */
  const requireAuth = (callback, redirectCallback) => {
    if (user) {
      callback();
    } else {
      if (typeof redirectCallback === "function") {
        redirectCallback();
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithOtp,
    logout,
    requireAuth,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <SecureLoader message="Verifying Encrypted Session..." /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
