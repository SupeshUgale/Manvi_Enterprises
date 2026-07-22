import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          // If we had a real backend, we might verify the token here via authService.getCurrentUser(token)
          // For now, we trust the local storage if both exist
          setUser(JSON.parse(savedUser));
        } else {
          // Clean up if partial data exists
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, otp) => {
    const response = await authService.verifyOtp(email, otp);
    if (response.success && response.token && response.user) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      return response.user;
    }
    throw new Error("Invalid response from server");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Intercepting unauthenticated actions
  const requireAuth = (callback, redirectCallback) => {
    if (user) {
      callback();
    } else {
      if (typeof redirectCallback === 'function') {
        redirectCallback();
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    requireAuth,
    setUser // Exposing setUser for legacy compatibility temporarily if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
