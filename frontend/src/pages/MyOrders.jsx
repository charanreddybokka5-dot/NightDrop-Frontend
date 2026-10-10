import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Clock, ArrowRight, AlertCircle, ShoppingBag, Store } from 'lucide-react';

const STATUS_BADGE_CLASS = {
  PLACED: 'bg-primary',
  ACCEPTED: 'bg-info text-dark',
  PREPARING: 'bg-warning text-dark',
  READY_FOR_PICKUP: 'bg-info text-dark',
  OUT_FOR_DELIVERY: 'bg-primary',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
  REJECTED: 'bg-danger'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
      setError('Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100">
        <div className="spinner-border text-primary mt-5" role="status"></div>
        <p className="text-muted mt-3 small">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              My Midnight <span className="text-gradient-purple">Orders</span>
            </h1>
            <p className="text-muted small mb-0">Track and review your past and active midnight orders.</p>
          </div>
          <Link to="/products" className="btn btn-night-secondary btn-sm">
            Order Again
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light p-3 rounded-4 mb-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="glass-card p-5 text-center my-4 max-w-lg mx-auto" style={{ maxWidth: '450px' }}>
            <Package size={48} className="text-muted mb-3 opacity-50" />
            <h4 className="text-white fw-bold mb-2">No Orders Yet</h4>
            <p className="text-muted small mb-4">
              You haven't placed any midnight orders yet. Hungry or need late-night essentials?
            </p>
            <Link to="/products" className="btn btn-night-primary">
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const badgeClass = STATUS_BADGE_CLASS[order.status] || 'bg-secondary';
              return (
                <div key={order.id} className="glass-card p-4 transition">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    {/* Left: Store & Items */}
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-secondary bg-opacity-50 text-white small">
                          #{order.orderNumber}
                        </span>
                        <span className={`badge ${badgeClass} small`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-muted small">
                          {new Date(order.createdAt).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>

                      <h5 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                        <Store size={18} className="text-cyan-primary" /> {order.storeName}
                      </h5>

                      <p className="text-muted small mb-0">
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}:{' '}
                        {order.items?.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    {/* Right: Total & Action */}
                    <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-4 pt-3 pt-md-0 border-top border-secondary border-opacity-25 border-md-0">
                      <div className="text-md-end">
                        <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>TOTAL AMOUNT</span>
                        <span className="price-tag text-gradient-purple">₹{Number(order.totalAmount).toFixed(2)}</span>
                      </div>

                      <Link
                        to={`/orders/${order.id}`}
                        className="btn btn-night-primary btn-sm d-flex align-items-center gap-1 px-3 py-2"
                      >
                        <span>Track Order</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
