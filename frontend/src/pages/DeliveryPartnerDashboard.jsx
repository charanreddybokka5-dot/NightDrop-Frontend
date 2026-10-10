import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Truck, Package, MapPin, Phone, CheckCircle2,
  Clock, RefreshCw, AlertTriangle, ShieldCheck, Banknote, Power, Check
} from 'lucide-react';

const DeliveryPartnerDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [deliveringId, setDeliveringId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'my-active', 'history'

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [availRes, myRes] = await Promise.all([
        api.get('/api/orders/available-deliveries').catch(() => ({ data: [] })),
        api.get('/api/orders/my-deliveries').catch(() => ({ data: [] }))
      ]);
      setAvailableOrders(availRes.data);
      setMyDeliveries(myRes.data);
    } catch (err) {
      console.error('Failed to load rider delivery queues', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrder = async (orderId) => {
    try {
      setClaimingId(orderId);
      setError(null);
      setSuccessMsg(null);
      const res = await api.post(`/api/orders/${orderId}/claim-delivery`);
      setSuccessMsg(`Successfully claimed order #${res.data.orderNumber}! It is now in your active runs.`);
      setActiveTab('my-active');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim delivery job. It may have already been claimed by another rider.');
    } finally {
      setClaimingId(null);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    const confirmDone = window.confirm('Confirm that this order was safely handed over to the customer and payment collected?');
    if (!confirmDone) return;

    try {
      setDeliveringId(orderId);
      setError(null);
      setSuccessMsg(null);
      await api.post(`/api/orders/${orderId}/deliver`);
      setSuccessMsg('Delivery marked as completed! Earnings added to your account.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete delivery.');
    } finally {
      setDeliveringId(null);
    }
  };

  // Filter deliveries
  const activeRuns = myDeliveries.filter((o) => o.status === 'OUT_FOR_DELIVERY');
  const completedRuns = myDeliveries.filter((o) => o.status === 'DELIVERED');

  // Real earnings calculated from actual orders
  const totalEarnings = completedRuns.reduce(
    (sum, o) => sum + (Number(o.deliveryFee) || 39),
    0
  );

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-cyan-primary text-dark fw-bold">NIGHT EXPRESS DISPATCH</span>
              <span className={`badge ${isOnline ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                {isOnline ? '● Online & Accepting Jobs' : '○ Offline'}
              </span>
            </div>
            <h1 className="fw-bold text-white mb-0" style={{ fontFamily: 'var(--font-display)' }}>
              Midnight Delivery <span className="text-gradient-purple">Partner Hub</span>
            </h1>
            <p className="text-muted small mb-0">
              Welcome back, <strong className="text-white">{user?.fullName || 'Rider'}</strong>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`btn btn-sm d-flex align-items-center gap-1 ${
                isOnline ? 'btn-outline-danger' : 'btn-success'
              }`}
            >
              <Power size={14} />
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
            <button onClick={fetchData} className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light d-flex align-items-center gap-2 p-3 rounded-4 mb-4">
            <AlertTriangle size={20} className="text-danger flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success bg-success bg-opacity-10 border-success text-light d-flex align-items-center justify-content-between p-3 rounded-4 mb-4">
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={20} className="text-success flex-shrink-0" />
              <div>{successMsg}</div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setSuccessMsg(null)}></button>
          </div>
        )}

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="glass-card p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">ACTIVE RUNS IN PROGRESS</span>
                <h3 className="fw-bold text-white mb-0">{activeRuns.length}</h3>
              </div>
              <div className="p-3 rounded-circle bg-cyan-primary bg-opacity-25 text-cyan-primary">
                <Truck size={24} />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="glass-card p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">COMPLETED TONIGHT</span>
                <h3 className="fw-bold text-white mb-0">{completedRuns.length}</h3>
              </div>
              <div className="p-3 rounded-circle bg-success bg-opacity-25 text-success">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="glass-card p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">TOTAL EARNINGS TONIGHT</span>
                <h3 className="fw-bold text-white mb-0 text-gradient-purple">₹{totalEarnings.toFixed(2)}</h3>
              </div>
              <div className="p-3 rounded-circle bg-warning bg-opacity-25 text-warning">
                <Banknote size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('available')}
            className={`btn px-4 py-2 rounded-pill small position-relative ${
              activeTab === 'available' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            <span>Available Pickup Jobs</span>
            {availableOrders.length > 0 && (
              <span className="badge bg-warning text-dark ms-2 rounded-pill">
                {availableOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-active')}
            className={`btn px-4 py-2 rounded-pill small position-relative ${
              activeTab === 'my-active' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            <span>My Active Runs</span>
            {activeRuns.length > 0 && (
              <span className="badge bg-cyan-primary text-dark ms-2 rounded-pill">
                {activeRuns.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn px-4 py-2 rounded-pill small ${
              activeTab === 'history' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            Delivered History ({completedRuns.length})
          </button>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-light p-3 rounded-4 mb-4 d-flex align-items-center gap-2">
            <AlertTriangle size={18} className="text-warning flex-shrink-0" />
            <span>You are currently OFFLINE. Toggle status to Online to accept new midnight deliveries.</span>
          </div>
        )}

        {/* TAB 1: AVAILABLE JOBS */}
        {activeTab === 'available' && (
          <div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Scanning kitchen pickup zones...</p>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <Package size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Deliveries Awaiting Pickup Right Now</h4>
                <p className="text-muted small">
                  Kitchens are currently preparing items. When an order is marked <strong>Ready for Pickup</strong>, it will immediately appear here.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {availableOrders.map((order) => (
                  <div key={order.id} className="glass-card p-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="badge bg-warning text-dark fw-bold">READY FOR PICKUP</span>
                          <span className="badge bg-secondary">#{order.orderNumber}</span>
                          <span className="text-muted small">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h5 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                          <MapPin size={16} className="text-purple-primary" /> Pickup: {order.storeName}
                        </h5>
                        <p className="text-muted small mb-2">{order.storeAddress}</p>

                        <div className="d-flex align-items-start gap-2 text-light small mb-2">
                          <MapPin size={16} className="text-cyan-primary mt-1 flex-shrink-0" />
                          <span>Drop: <strong>{order.recipientName}</strong> — {order.deliveryAddress}</span>
                        </div>

                        <div className="small text-muted">
                          Items: {order.items?.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                      </div>

                      <div className="d-flex flex-column align-items-lg-end gap-2 pt-3 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                        <div className="text-lg-end">
                          <span className="small text-muted d-block">RIDER PAYOUT</span>
                          <span className="price-tag text-gradient-purple">₹{Number(order.deliveryFee || 39).toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => handleClaimOrder(order.id)}
                          disabled={!isOnline || claimingId === order.id}
                          className="btn btn-night-cyan btn-sm px-4 py-2 d-flex align-items-center gap-2 shadow"
                        >
                          <Truck size={16} />
                          <span>{claimingId === order.id ? 'Claiming Job...' : 'Accept & Claim Delivery'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVE RUNS */}
        {activeTab === 'my-active' && (
          <div>
            {activeRuns.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <Truck size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Active Runs Right Now</h4>
                <p className="text-muted small">You don't have any in-progress runs. Accept an available delivery from the Pickup Jobs tab.</p>
                <button onClick={() => setActiveTab('available')} className="btn btn-night-primary btn-sm mt-2">
                  Browse Available Deliveries
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activeRuns.map((order) => (
                  <div key={order.id} className="glass-card p-4 border border-cyan-primary border-opacity-50">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="badge bg-cyan-primary text-dark fw-bold">OUT FOR DELIVERY</span>
                          <span className="badge bg-secondary">#{order.orderNumber}</span>
                        </div>

                        <h5 className="text-white fw-bold mb-1">
                          Deliver to: {order.recipientName}
                        </h5>

                        <div className="d-flex align-items-center gap-2 text-cyan-primary small mb-1">
                          <Phone size={14} />
                          <a href={`tel:${order.deliveryPhone}`} className="text-cyan-primary text-decoration-none fw-semibold">
                            {order.deliveryPhone}
                          </a>
                        </div>

                        <div className="d-flex align-items-start gap-2 text-muted small mb-2">
                          <MapPin size={14} className="mt-1 flex-shrink-0 text-cyan-primary" />
                          <span>{order.deliveryAddress}</span>
                        </div>

                        {order.deliveryNotes && (
                          <div className="small text-warning bg-warning bg-opacity-10 p-2 rounded-2 mb-2">
                            Customer Instructions: {order.deliveryNotes}
                          </div>
                        )}

                        <div className="small text-muted">
                          Items: {order.items?.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                      </div>

                      <div className="d-flex flex-column align-items-lg-end gap-2 pt-3 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                        <div className="text-lg-end">
                          <span className="small text-muted d-block">COLLECT FROM CUSTOMER</span>
                          <span className="price-tag text-gradient-purple">
                            {order.paymentMethod === 'SIMULATED_ONLINE'
                              ? '₹0 (PAID ONLINE)'
                              : `₹${Number(order.totalAmount).toFixed(2)} COD`}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCompleteDelivery(order.id)}
                          disabled={deliveringId === order.id}
                          className="btn btn-success btn-sm px-4 py-2 d-flex align-items-center gap-2 shadow"
                        >
                          <CheckCircle2 size={16} />
                          <span>{deliveringId === order.id ? 'Marking Delivered...' : 'Complete Delivery & Payment'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div>
            {completedRuns.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <CheckCircle2 size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Completed Deliveries Yet</h4>
                <p className="text-muted small">Deliveries you complete tonight will appear here with calculated payouts.</p>
              </div>
            ) : (
              <div className="glass-card p-0 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                      <tr className="border-secondary border-opacity-25 small text-muted">
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3">Store</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Payment</th>
                        <th className="py-3">Rider Earning</th>
                        <th className="py-3 px-4 text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedRuns.map((o) => (
                        <tr key={o.id} className="border-secondary border-opacity-25 small align-middle">
                          <td className="py-3 px-4">
                            <span className="badge bg-secondary">#{o.orderNumber}</span>
                          </td>
                          <td className="text-light">{o.storeName}</td>
                          <td className="text-white">{o.recipientName}</td>
                          <td>
                            <span className="badge bg-secondary bg-opacity-50">
                              {o.paymentMethod === 'SIMULATED_ONLINE' ? 'Online Paid' : 'COD Collected'}
                            </span>
                          </td>
                          <td className="fw-bold text-success">
                            +₹{Number(o.deliveryFee || 39).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-end">
                            <span className="badge bg-success bg-opacity-25 text-success py-1 px-2">
                              Delivered
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;
