// ==========================================
// PRODUCT SERVICE - Product API calls
// ==========================================

import api from './api';

const productService = {
  // Get all products with optional filters
  async getAll(params = {}) {
    return api.get('/products', params);
  },

  // Get product by ID
  async getById(id) {
    return api.get(`/products/${id}`);
  },

  // Get product by SKU
  async getBySku(sku) {
    return api.get(`/products/sku/${sku}`);
  },

  // Create new product (Admin)
  async create(productData) {
    return api.post('/products', productData);
  },

  // Update product (Admin)
  async update(id, productData) {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product (Admin)
  async delete(id) {
    return api.delete(`/products/${id}`);
  },

  // Get categories from products
  getCategories(products) {
    const categories = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(categories)];
  },

  // Get brands from products
  getBrands(products) {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands);
  },
};

export default productService;












