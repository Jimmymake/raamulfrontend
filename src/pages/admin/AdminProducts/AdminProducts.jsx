// ==========================================
// ADMIN PRODUCTS - Product Management
// ==========================================

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout/AdminLayout';
import { LoadingSpinner, ProductImage, getProductImageUrl } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import productService from '../../../services/productService';
import uploadService from '../../../services/uploadService';
import './AdminProducts.scss';

const AdminProducts = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: '',
    unit: 'tonne',
    stock: '',
    purity: '',
    status: 'active',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (searchQuery) params.search = searchQuery;
      
      const data = await productService.getAll(params);
      setProducts(data.products || []);
      if (data.pagination) {
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || 'tonne',
        stock: product.stock || '',
        purity: product.purity || '',
        status: product.status || 'active',
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        price: '',
        unit: 'tonne',
        stock: '',
        purity: '',
        status: 'active',
        images: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files first
    const validation = uploadService.validateFiles(files);
    if (!validation.valid) {
      showError(`Invalid files: ${validation.errors.map(err => err.file).join(', ')}`);
      return;
    }

    setUploadingImages(true);
    
    try {
      const result = await uploadService.uploadMultiple(files);
      
      if (result.uploaded.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.urls]
        }));
        showSuccess(`${result.uploaded.length} image(s) uploaded successfully`);
      }
      
      if (result.errors.length > 0) {
        showError(`Failed to upload: ${result.errors.map(err => err.file).join(', ')}`);
      }
    } catch (error) {
      showError('Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
        showSuccess('Product updated successfully');
      } else {
        await productService.create(productData);
        showSuccess('Product created successfully');
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      showError(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await productService.delete(product.id);
      showSuccess('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      showError(error.message || 'Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="admin-products__header">
          <div>
            <h1>Products</h1>
            <p>Manage your product catalog</p>
          </div>
          <button className="admin-products__add-btn" onClick={() => handleOpenModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="admin-products__search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="admin-products__loading">
            <LoadingSpinner size="large" text="Loading products..." />
          </div>
        ) : products.length === 0 ? (
          <div className="admin-products__empty">
            <p>No products found</p>
            <button onClick={() => handleOpenModal()}>Add Your First Product</button>
          </div>
        ) : (
          <>
            <div className="admin-products__table">
              <div className="admin-products__table-header">
                <span>Product</span>
                <span>SKU</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {products.map((product) => (
                <div key={product.id} className="admin-products__table-row">
                  <div className="admin-products__product-info">
                    <ProductImage 
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      size="small"
                      className="admin-products__product-thumb"
                    />
                    <div>
                      <span className="admin-products__product-name">{product.name}</span>
                      <span className="admin-products__product-category">{product.category}</span>
                    </div>
                  </div>
                  <span>{product.sku || 'N/A'}</span>
                  <span className="admin-products__price">
                    KES {Number(product.price).toLocaleString()}
                    <small>/{product.unit}</small>
                  </span>
                  <span className={`admin-products__stock ${product.stock <= 0 ? 'admin-products__stock--out' : ''}`}>
                    {product.stock || 0}
                  </span>
                  <span className={`admin-products__status admin-products__status--${product.status}`}>
                    {product.status}
                  </span>
                  <div className="admin-products__actions">
                    <button 
                      className="admin-products__action-btn admin-products__action-btn--edit"
                      onClick={() => handleOpenModal(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-products__action-btn admin-products__action-btn--delete"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="admin-products__pagination">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        {showModal && (
          <div className="admin-products__modal-overlay" onClick={handleCloseModal}>
            <div className="admin-products__modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-products__modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="admin-products__modal-close" onClick={handleCloseModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-products__form">
                <div className="admin-products__form-row">
                  <div className="admin-products__field">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-products__field">
                    <label>SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-products__form-row">
                  <div className="admin-products__field">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Gypsum">Gypsum</option>
                      <option value="Limestone">Limestone</option>
                      <option value="Iron">Iron</option>
                      <option value="Bauxite">Bauxite</option>
                    </select>
                  </div>
                  <div className="admin-products__field">
                    <label>Purity</label>
                    <input
                      type="text"
                      value={formData.purity}
                      onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                      placeholder="e.g., 89-93%"
                    />
                  </div>
                </div>

                <div className="admin-products__field">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="admin-products__form-row">
                  <div className="admin-products__field">
                    <label>Price (KES) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-products__field">
                    <label>Unit *</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="tonne">Per Tonne</option>
                      <option value="kg">Per Kg</option>
                      <option value="piece">Per Piece</option>
                      <option value="bag">Per Bag</option>
                    </select>
                  </div>
                </div>

                <div className="admin-products__form-row">
                  <div className="admin-products__field">
                    <label>Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-products__field">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="admin-products__field">
                  <label>Product Images</label>
                  <div className="admin-products__images">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="admin-products__image-item">
                        <ProductImage 
                          src={img}
                          alt={`Product image ${idx + 1}`}
                          size="small"
                          showShadow={false}
                        />
                        <button type="button" onClick={() => handleRemoveImage(idx)}>×</button>
                      </div>
                    ))}
                    <label className={`admin-products__image-upload ${uploadingImages ? 'admin-products__image-upload--loading' : ''}`}>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,.png,.jpg,.jpeg,.gif,.webp" 
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <span className="admin-products__upload-spinner">⏳</span>
                      ) : (
                        <span>+ Add</span>
                      )}
                    </label>
                  </div>
                  <small className="admin-products__upload-hint">
                    Supports JPEG, PNG (recommended for product bags), GIF, WebP. Max 10MB per image.
                  </small>
                </div>

                <div className="admin-products__form-actions">
                  <button type="button" onClick={handleCloseModal} className="admin-products__btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="admin-products__btn-submit" disabled={submitting || uploadingImages}>
                    {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
