import api from './axios';

/**
 * Product and Category API Service
 * Interacts with backend product and category endpoints.
 */
export const productsService = {
  /**
   * Get all products
   * GET /products
   */
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Get single product by ID
   * GET /products/:id
   */
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Add new product
   * POST /products
   */
  addProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update existing product
   * PUT /products/:id
   */
  updateProduct: async (id, updatedData) => {
    const response = await api.put(`/products/${id}`, updatedData);
    return response.data;
  },

  /**
   * Delete product
   * DELETE /products/:id
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Get all categories
   * GET /categories
   */
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Add new category
   * POST /categories
   */
  addCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  /**
   * Update category
   * PUT /categories/:slug
   */
  updateCategory: async (slug, updatedData) => {
    const response = await api.put(`/categories/${slug}`, updatedData);
    return response.data;
  },

  /**
   * Delete category
   * DELETE /categories/:slug
   */
  deleteCategory: async (slug) => {
    const response = await api.delete(`/categories/${slug}`);
    return response.data;
  },
};
