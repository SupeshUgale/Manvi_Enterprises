/**
 * Mock Authentication API Service
 * Replaces direct backend calls with simulated network latency and mock responses.
 * When the real backend is ready, replace these mock functions with real fetch/axios calls.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export const authService = {
  // POST /api/auth/register
  register: async (data) => {
    await delay(1000);
    console.log("Mock Register Payload:", data);
    
    // Simulate successful registration and OTP dispatch
    return {
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: data.email
    };
  },

  // POST /api/auth/send-otp
  sendOtp: async (email) => {
    await delay(1000);
    console.log("Mock Send OTP to:", email);
    
    // Simulate sending OTP
    return {
      success: true,
      message: "OTP sent successfully to your email."
    };
  },

  // POST /api/auth/verify-otp
  verifyOtp: async (email, otp) => {
    await delay(1500);
    console.log("Mock Verify OTP:", { email, otp });

    // For mock purposes, any 6 digit OTP works except '000000'
    if (otp === "000000") {
      throw new Error("Invalid OTP");
    }

    // Determine role (mocking admin if email contains admin)
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";
    
    // Extract a name from email if it's a new login
    const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');

    return {
      success: true,
      token: MOCK_JWT,
      user: {
        id: Math.floor(Math.random() * 10000),
        name: name,
        email: email,
        role: role,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F5D50&color=fff`
      }
    };
  },

  // GET /api/auth/me
  getCurrentUser: async (token) => {
    await delay(500);
    
    if (!token || token !== MOCK_JWT) {
      throw new Error("Unauthorized");
    }

    // Mocking an existing session fetch
    return {
      success: true,
      user: {
        id: 1,
        name: "Mock User",
        email: "user@example.com",
        role: "user",
        image: "https://ui-avatars.com/api/?name=Mock+User&background=2F5D50&color=fff"
      }
    };
  },

  // POST /api/auth/logout
  logout: async () => {
    await delay(500);
    return { success: true };
  }
};
