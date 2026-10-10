import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Store, Package, ShoppingBag, Clock, Plus, Edit2, Trash2,
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Power, ArrowRight,
  Truck, Check, Utensils
} from 'lucide-react';

const CATEGORIES = [
  'FOOD_AND_SNACKS',
  'GROCERIES',
  'PERSONAL_CARE',
  'ELECTRONICS_AND_ACCESSORIES',
  'PET_ESSENTIALS',
  'BABY_ESSENTIALS'
];

const StoreOwnerDashboard = () => {
  const { user } = useAuth();

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products' or 'settings'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'FOOD_AND_SNACKS',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    isAvailable: true
  });

  // Hours Modal State
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [hoursForm, setHoursForm] = useState({
    openingTime: '19:00',
    closingTime: '05:00',
    deliveryFee: 39,
    description: ''
  });

  useEffect(() => {
    fetchOwnerStores();
  }, []);

  const fetchOwnerStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/stores/owner/my');
      setStores(res.data);
      if (res.data.length > 0) {
        const store = res.data[0];
        setSelectedStore(store);
        fetchStoreData(store.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load owner stores', err);
      setError('Failed to load store profile.');
      setLoading(false);
    }
  };

  const fetchStoreData = async (storeId) => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get(`/api/products/store/${storeId}`),
        api.get(`/api/orders/store/${storeId}`)
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error('Failed to load store products/orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStoreStatus = async () => {
    if (!selectedStore) return;
    try {
      const res = await api.patch(`/api/stores/${selectedStore.id}/toggle`);
      setSelectedStore(res.data);
      setStores((prev) => prev.map((s) => (s.id === res.data.id ? res.data : s)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle store status.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // Product CRUD
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl || '',
        isAvailable: product.available !== undefined ? product.available : true
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        category: 'FOOD_AND_SNACKS',
        price: '',
        stockQuantity: '20',
        imageUrl: '',
        isAvailable: true
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    try {
      const payload = {
        storeId: selectedStore.id,
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: Number(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity, 10),
        imageUrl: productForm.imageUrl,
        isAvailable: productForm.isAvailable
      };

      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct.id}`, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.data : p)));
      } else {
        const res = await api.post('/api/products', payload);
        setProducts((prev) => [...prev, res.data]);
      }
      setShowProductModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  // Operating Hours Edit
  const handleOpenHoursModal = () => {
    if (!selectedStore) return;
    setHoursForm({
      openingTime: selectedStore.openingTime || '19:00',
      closingTime: selectedStore.closingTime || '05:00',
      deliveryFee: selectedStore.deliveryFee || 39,
      description: selectedStore.description || ''
    });
    setShowHoursModal(true);
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;
    try {
      const payload = {
        name: selectedStore.name,
        description: hoursForm.description,
        address: selectedStore.address,
        phone: selectedStore.phone,
        openingTime: hoursForm.openingTime,
        closingTime: hoursForm.closingTime,
        deliveryFee: Number(hoursForm.deliveryFee),
        imageUrl: selectedStore.imageUrl
      };
      const res = await api.put(`/api/stores/${selectedStore.id}`, payload);
      setSelectedStore(res.data);
      setStores((prev) => prev.map((s) => (s.id === res.data.id ? res.data : s)));
      setShowHoursModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update store operating hours.');
    }
  };

  if (loading) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100">
        <div className="spinner-border text-primary mt-5" role="status"></div>
        <p className="text-muted mt-3 small">Loading Store Management Hub...</p>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="night-gradient-bg py-5 min-vh-100">
        <div className="container text-center py-5">
          <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '500px' }}>
            <Store size={48} className="text-warning mb-3" />
            <h3 className="text-white fw-bold">No Store Assigned</h3>
            <p className="text-muted small">
              You are signed in as a Store Owner, but no store is linked to your account yet. Please contact the platform administrator to assign your store.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeOrdersCount = orders.filter((o) => !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.status)).length;

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Store Header Banner */}
        <div className="glass-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-purple-primary text-white">STORE OWNER CONSOLE</span>
                {selectedStore.isOpen ? (
                  <span className="badge-open">LIVE: ACCEPTING ORDERS</span>
                ) : (
                  <span className="badge-closed">OFFLINE / CLOSED</span>
                )}
              </div>
              <h1 className="fw-bold text-white fs-3 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {selectedStore.name}
              </h1>
              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                <span className="d-flex align-items-center gap-1">
                  <Clock size={15} className="text-cyan-primary" /> Hours: <strong className="text-white">{selectedStore.operatingHoursDisplay || `${selectedStore.openingTime} - ${selectedStore.closingTime}`}</strong>
                </span>
                <span>Delivery Fee: <strong className="text-white">₹{selectedStore.deliveryFee}</strong></span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handleToggleStoreStatus}
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
                  selectedStore.isOpen ? 'btn-danger' : 'btn-success'
                }`}
              >
                <Power size={16} />
                <span>{selectedStore.isOpen ? 'Close Store Now' : 'Open Store Now'}</span>
              </button>
              <button onClick={handleOpenHoursModal} className="btn btn-sm btn-night-secondary py-2 px-3 rounded-3">
                <Clock size={16} className="me-1" /> Edit Hours
              </button>
              <button onClick={() => fetchStoreData(selectedStore.id)} className="btn btn-sm btn-night-secondary p-2 rounded-3">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="d-flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn px-4 py-2 rounded-pill position-relative ${
              activeTab === 'orders' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            <span>Incoming Orders</span>
            {activeOrdersCount > 0 && (
              <span className="badge bg-cyan-primary text-dark ms-2 rounded-pill">
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`btn px-4 py-2 rounded-pill ${
              activeTab === 'products' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            Products & Inventory ({products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Orders Received Yet</h4>
                <p className="text-muted small">New customer orders will appear here in real time.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => {
                  return (
                    <div key={order.id} className="glass-card p-4">
                      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                        {/* Order Info */}
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge bg-secondary">#{order.orderNumber}</span>
                            <span className="badge bg-purple-primary">{order.status.replace(/_/g, ' ')}</span>
                            <span className="text-muted small">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h5 className="text-white fw-bold mb-1">
                            {order.recipientName} ({order.deliveryPhone})
                          </h5>
                          <p className="text-muted small mb-2">{order.deliveryAddress}</p>

                          {order.deliveryNotes && (
                            <div className="small text-cyan-primary mb-2">
                              Note: {order.deliveryNotes}
                            </div>
                          )}

                          {/* Items pills */}
                          <div className="d-flex flex-wrap gap-2">
                            {order.items?.map((item) => (
                              <span
                                key={item.id}
                                className="badge bg-night-card border border-secondary border-opacity-50 text-light py-1 px-2"
                              >
                                {item.quantity}x {item.productName} (₹{Number(item.totalPrice).toFixed(0)})
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Order Total & Transition Actions */}
                        <div className="d-flex flex-column align-items-lg-end gap-2 pt-3 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                          <div className="text-lg-end">
                            <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>TOTAL (COD)</span>
                            <span className="price-tag text-gradient-purple">₹{Number(order.totalAmount).toFixed(2)}</span>
                          </div>

                          {/* Action Buttons depending on status */}
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {order.status === 'PLACED' && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
                                  className="btn btn-sm btn-success d-flex align-items-center gap-1 px-3"
                                >
                                  <Check size={15} /> Accept Order
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'REJECTED')}
                                  className="btn btn-sm btn-danger d-flex align-items-center gap-1 px-3"
                                >
                                  <XCircle size={15} /> Reject
                                </button>
                              </>
                            )}

                            {order.status === 'ACCEPTED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                                className="btn btn-sm btn-warning text-dark d-flex align-items-center gap-1 px-3 fw-bold"
                              >
                                <Utensils size={15} /> Start Preparing
                              </button>
                            )}

                            {order.status === 'PREPARING' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                                className="btn btn-sm btn-info text-dark d-flex align-items-center gap-1 px-3 fw-bold"
                              >
                                <Package size={15} /> Mark Ready for Pickup
                              </button>
                            )}

                            {order.status === 'READY_FOR_PICKUP' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                                className="btn btn-sm btn-night-cyan d-flex align-items-center gap-1 px-3"
                              >
                                <Truck size={15} /> Handover to Rider (Out for Delivery)
                              </button>
                            )}

                            {order.status === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                className="btn btn-sm btn-success d-flex align-items-center gap-1 px-3"
                              >
                                <CheckCircle2 size={15} /> Mark Delivered
                              </button>
                            )}

                            {(order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'REJECTED') && (
                              <span className="badge bg-secondary p-2">Completed: {order.status}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white fw-bold fs-5 mb-0">Store Products & Midnight Inventory</h4>
              <button
                onClick={() => handleOpenProductModal()}
                className="btn btn-night-primary btn-sm d-flex align-items-center gap-1"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="glass-card p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr className="border-secondary border-opacity-25 small text-muted">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">Price</th>
                      <th className="py-3">Stock</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-secondary border-opacity-25 align-middle">
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'}
                              alt={p.name}
                              className="rounded-3 object-fit-cover"
                              style={{ width: '48px', height: '48px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                              }}
                            />
                            <div>
                              <strong className="text-white d-block">{p.name}</strong>
                              <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '220px' }}>
                                {p.description || 'No description'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="small text-muted">{p.category.replace(/_/g, ' ')}</td>
                        <td>
                          <span className="fw-bold text-white">₹{Number(p.price).toFixed(2)}</span>
                        </td>
                        <td>
                          <span className={`badge ${p.stockQuantity > 5 ? 'bg-secondary' : 'bg-danger'}`}>
                            {p.stockQuantity} in stock
                          </span>
                        </td>
                        <td>
                          {p.available ? (
                            <span className="badge bg-success bg-opacity-25 text-success">Active</span>
                          ) : (
                            <span className="badge bg-danger bg-opacity-25 text-danger">Disabled</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="btn btn-sm btn-night-secondary p-1"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="btn btn-sm text-danger hover-bg-danger-subtle p-1 border-0"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-secondary text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Midnight Item'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small">Item Name *</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Description</label>
                      <textarea
                        className="form-control form-night"
                        rows="2"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Category *</label>
                      <select
                        className="form-select form-night"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        required
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        className="form-control form-night"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control form-night"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center pt-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isAvailableSwitch"
                          checked={productForm.isAvailable}
                          onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                        />
                        <label className="form-check-label text-light small" htmlFor="isAvailableSwitch">
                          Available for Order
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Image URL</label>
                      <input
                        type="url"
                        className="form-control form-night"
                        placeholder="https://images.unsplash.com/..."
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-night-secondary"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-night-primary">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Operating Hours Modal */}
      {showHoursModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-secondary text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-white">Configure Operating Hours</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowHoursModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveHours}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-muted small">Opening Time (24hr)</label>
                      <input
                        type="time"
                        className="form-control form-night"
                        value={hoursForm.openingTime}
                        onChange={(e) => setHoursForm({ ...hoursForm, openingTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Closing Time (24hr)</label>
                      <input
                        type="time"
                        className="form-control form-night"
                        value={hoursForm.closingTime}
                        onChange={(e) => setHoursForm({ ...hoursForm, closingTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Delivery Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control form-night"
                        value={hoursForm.deliveryFee}
                        onChange={(e) => setHoursForm({ ...hoursForm, deliveryFee: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Store Headline / Description</label>
                      <textarea
                        className="form-control form-night"
                        rows="2"
                        value={hoursForm.description}
                        onChange={(e) => setHoursForm({ ...hoursForm, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-night-secondary"
                    onClick={() => setShowHoursModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-night-primary">
                    Update Hours
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
