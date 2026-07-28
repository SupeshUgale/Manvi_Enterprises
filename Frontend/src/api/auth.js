import api from './axios';

/**
 * Authentication API Service
 * Interacts with the backend authentication endpoints.
 */
export const authService = {
  /**
   * Login user
   * POST /auth/login
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register user
   * POST /auth/register
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Send OTP to email
   * POST /auth/send-otp
   */
  sendOtp: async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  verifyOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Get current authenticated user profile
   * GET /auth/me
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};