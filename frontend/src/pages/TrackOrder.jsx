import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Package, Clock, CheckCircle2, AlertTriangle, Truck,
  MapPin, Phone, RefreshCw, XCircle, ChevronLeft, Store
} from 'lucide-react';

const ORDER_STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received by system' },
  { key: 'ACCEPTED', label: 'Accepted', desc: 'Store accepted order' },
  { key: 'PREPARING', label: 'Preparing', desc: 'Packing essentials' },
  { key: 'READY_FOR_PICKUP', label: 'Ready', desc: 'Awaiting midnight rider' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider is on the way' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Safely arrived' }
];

const TrackOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.justPlaced ? 'Order placed successfully!' : null);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // Poll status every 15s
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load order', err);
      setError('Order details could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this midnight order?');
    if (!confirmCancel) return;

    try {
      setCancelling(true);
      const res = await api.post(`/api/orders/${id}/cancel`);
      setOrder(res.data);
      setSuccessMsg('Order cancelled successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to cancel order at this stage.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100">
        <div className="spinner-border text-primary mt-5" role="status"></div>
        <p className="text-muted mt-3 small">Tracking midnight dispatch...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="night-gradient-bg py-5 min-vh-100">
        <div className="container text-center py-5">
          <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '450px' }}>
            <AlertTriangle size={48} className="text-danger mb-3" />
            <h3 className="text-white fw-bold">Order Not Found</h3>
            <p className="text-muted">{error || 'Unable to locate this order number.'}</p>
            <Link to="/orders" className="btn btn-night-primary mt-3">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/orders" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-text-cyan">
            <ChevronLeft size={16} /> All Orders
          </Link>
          <button onClick={fetchOrder} className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1">
            <RefreshCw size={14} /> Refresh Status
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="alert alert-success bg-success bg-opacity-10 border-success text-light d-flex align-items-center justify-content-between p-3 rounded-4 mb-4">
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={20} className="text-success" />
              <span>{successMsg}</span>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setSuccessMsg(null)}></button>
          </div>
        )}

        {/* Order Header Card */}
        <div className="glass-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-purple-primary text-white">ORDER #{order.orderNumber}</span>
                <span className="small text-muted">
                  Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-white fw-bold fs-4 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {isCancelled
                  ? `Order ${order.status}`
                  : order.status === 'DELIVERED'
                  ? 'Delivered to your doorstep'
                  : 'On Its Way! Midnight Dispatch Active'}
              </h2>
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Store size={15} className="text-cyan-primary" />
                <span>Store: <strong className="text-white">{order.storeName}</strong></span>
              </div>
            </div>

            {/* Cancel Button if eligible */}
            {order.status === 'PLACED' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-outline-danger btn-sm px-3 py-2 d-flex align-items-center gap-1 rounded-3"
              >
                <XCircle size={16} />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Stepper Timeline (if not cancelled) */}
        {!isCancelled ? (
          <div className="glass-card p-4 p-md-5 mb-4">
            <div className="row g-3 position-relative">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="col-12 col-md-4 col-lg-2 text-center position-relative">
                    <div className="d-flex flex-column align-items-center">
                      {/* Step Circle */}
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                          isCurrent
                            ? 'bg-cyan-primary text-dark shadow-cyan'
                            : isPassed
                            ? 'bg-success text-white'
                            : 'bg-dark text-muted border border-secondary'
                        }`}
                        style={{
                          width: '42px',
                          height: '42px',
                          boxShadow: isCurrent ? '0 0 15px rgba(6, 182, 212, 0.6)' : 'none',
                          transition: 'all 0.3s'
                        }}
                      >
                        {isPassed && !isCurrent ? (
                          <CheckCircle2 size={20} />
                        ) : isCurrent ? (
                          <Truck size={20} />
                        ) : (
                          <span className="small fw-bold">{idx + 1}</span>
                        )}
                      </div>

                      <strong className={`small d-block mb-1 ${isCurrent ? 'text-cyan-primary fw-bold' : isPassed ? 'text-white' : 'text-muted'}`}>
                        {step.label}
                      </strong>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light p-4 rounded-4 mb-4 d-flex align-items-center gap-3">
            <XCircle size={32} className="text-danger flex-shrink-0" />
            <div>
              <h5 className="fw-bold mb-1">Order Status: {order.status}</h5>
              <p className="small text-muted mb-0">
                This order was terminated ({order.status.toLowerCase()}). No amount was charged or payment will not be collected.
              </p>
            </div>
          </div>
        )}

        {/* Order Details & Items Split */}
        <div className="row g-4">
          {/* Order Items */}
          <div className="col-12 col-lg-8">
            <div className="glass-card p-4">
              <h4 className="text-white fw-bold fs-5 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Ordered Essentials ({order.items?.length || 0})
              </h4>

              <div className="d-flex flex-column gap-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between p-3 rounded-3"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.productImage || item.productImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80'}
                        alt={item.productName}
                        className="rounded-3 object-fit-cover"
                        style={{ width: '56px', height: '56px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80';
                        }}
                      />
                      <div>
                        <h6 className="text-white fw-bold mb-1">{item.productName}</h6>
                        <span className="small text-muted">
                          Qty: <strong className="text-white">{item.quantity}</strong> × ₹{Number(item.price ?? item.unitPrice ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="fw-bold text-white">
                        ₹{Number(item.subtotal ?? item.totalPrice ?? (Number(item.price || 0) * item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery & Financial Summary */}
          <div className="col-12 col-lg-4">
            {/* Delivery Destination */}
            <div className="glass-card p-4 mb-4">
              <h5 className="text-white fw-bold fs-6 mb-3 d-flex align-items-center gap-2">
                <MapPin size={18} className="text-cyan-primary" /> Delivery Details
              </h5>
              <div className="small text-muted d-flex flex-column gap-2">
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>RECIPIENT</span>
                  <strong className="text-white">{order.recipientName}</strong>
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>PHONE</span>
                  <span className="text-white">{order.deliveryPhone}</span>
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>ADDRESS</span>
                  <span className="text-white">{order.deliveryAddress}</span>
                </div>
                {order.deliveryNotes && (
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>NOTE</span>
                    <span className="text-cyan-primary">{order.deliveryNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="glass-card p-4">
              <h5 className="text-white fw-bold fs-6 mb-3">Bill Details</h5>
              <div className="d-flex flex-column gap-2 small pb-3 border-bottom border-secondary border-opacity-25 text-muted">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivery Charge</span>
                  <span className="text-white">₹{Number(order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Payment Method</span>
                  <span className="text-cyan-primary fw-bold">{order.paymentMethod}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Payment Status</span>
                  <span className="badge bg-secondary bg-opacity-50">{order.paymentStatus}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3">
                <span className="text-white fw-bold">Total Bill</span>
                <span className="price-tag text-gradient-purple">₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
