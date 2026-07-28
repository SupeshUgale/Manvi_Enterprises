import api from './axios';

/**
 * Order API Service
 * Interacts with backend order endpoints.
 */
export const ordersService = {
  /**
   * Get orders for currently logged in user
   * GET /orders/my-orders
   */
  getUserOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  /**
   * Get single order by ID
   * GET /orders/:id
   */
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Create new order
   * POST /orders
   */
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  /**
   * Admin: Get all orders across platform
   * GET /orders
   */
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  /**
   * Admin: Update order status
   * PUT /orders/:id/status
   */
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
