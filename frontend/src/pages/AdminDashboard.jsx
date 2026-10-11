import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Shield, Users, Store, ShoppingBag, DollarSign,
  TrendingUp, RefreshCw, Power, CheckCircle2, XCircle,
  Truck, ArrowRight, Clock, Star, AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'stores', 'users', 'orders'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, storesRes, usersRes, ordersRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/stores'),
        api.get('/api/admin/users'),
        api.get('/api/admin/orders')
      ]);
      setAnalytics(dashRes.data || null);
      setStores(Array.isArray(storesRes.data) ? storesRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      console.error('Failed to load admin console data', err);
      setStores([]);
      setUsers([]);
      setOrders([]);
      setError('Unable to load platform administration analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStore = async (storeId) => {
    try {
      const res = await api.patch(`/api/admin/stores/${storeId}/toggle`);
      setStores((prev) => prev.map((s) => (s.id === storeId ? res.data : s)));
      // Refresh dashboard analytics
      const dashRes = await api.get('/api/admin/dashboard');
      setAnalytics(dashRes.data);
    } catch (err) {
      alert('Failed to toggle store status.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      const dashRes = await api.get('/api/admin/dashboard');
      setAnalytics(dashRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100">
        <div className="spinner-border text-primary mt-5" role="status"></div>
        <p className="text-muted mt-3 small">Loading NightDrop Platform Admin Console...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="night-gradient-bg py-5 min-vh-100">
        <div className="container text-center py-5">
          <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '450px' }}>
            <AlertCircle size={48} className="text-danger mb-3" />
            <h3 className="text-white fw-bold">Admin Console Error</h3>
            <p className="text-muted">{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-night-primary mt-3">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chart 1: Doughnut (Order Status Distribution)
  const statusLabels = Object.keys(analytics.ordersByStatus || {});
  const statusCounts = Object.values(analytics.ordersByStatus || {});
  const statusData = {
    labels: statusLabels.map((s) => s.replace(/_/g, ' ')),
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          '#3b82f6', // PLACED
          '#06b6d4', // ACCEPTED
          '#f59e0b', // PREPARING
          '#8b5cf6', // READY_FOR_PICKUP
          '#ec4899', // OUT_FOR_DELIVERY
          '#10b981', // DELIVERED
          '#ef4444'  // CANCELLED
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart 2: Category Breakdown Bar Chart
  const categoryLabels = Object.keys(analytics.categoryCounts || {});
  const categoryCounts = Object.values(analytics.categoryCounts || {});
  const categoryData = {
    labels: categoryLabels.map((c) => c.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Products',
        data: categoryCounts,
        backgroundColor: '#8b5cf6',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger text-white d-flex align-items-center gap-1">
                <Shield size={12} /> ROOT ADMIN CONSOLE
              </span>
              <span className="text-muted small">Live Platform Master Controls</span>
            </div>
            <h1 className="fw-bold text-white mb-0" style={{ fontFamily: 'var(--font-display)' }}>
              NightDrop <span className="text-gradient-purple">Operations Hub</span>
            </h1>
          </div>

          <button onClick={fetchDashboardData} className="btn btn-sm btn-night-secondary d-flex align-items-center gap-2">
            <RefreshCw size={15} /> Refresh Analytics
          </button>
        </div>

        {/* KPI Metrics Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-3">
              <span className="small text-muted d-block mb-1">DELIVERED REVENUE</span>
              <h3 className="fw-bold text-white mb-0 text-gradient-purple">
                ₹{Number(analytics.totalDeliveredRevenue || 0).toFixed(2)}
              </h3>
              <span className="small text-success mt-1 d-block">From completed midnight orders</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-3">
              <span className="small text-muted d-block mb-1">TOTAL ORDERS</span>
              <h3 className="fw-bold text-white mb-0">{analytics.totalOrders}</h3>
              <span className="small text-cyan-primary mt-1 d-block">
                {analytics.activeOrders} active right now
              </span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-3">
              <span className="small text-muted d-block mb-1">STORES LIVE / TOTAL</span>
              <h3 className="fw-bold text-white mb-0">
                {analytics.openStoresNow} / {analytics.totalStores}
              </h3>
              <span className="small text-muted mt-1 d-block">
                {analytics.activeStores} enabled partners
              </span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="glass-card p-3">
              <span className="small text-muted d-block mb-1">REGISTERED USERS</span>
              <h3 className="fw-bold text-white mb-0">{analytics.totalCustomers}</h3>
              <span className="small text-muted mt-1 d-block">{analytics.totalProducts} catalog products</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2 text-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn px-4 py-2 rounded-pill ${
              activeTab === 'overview' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`btn px-4 py-2 rounded-pill ${
              activeTab === 'stores' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            Manage Stores ({stores.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn px-4 py-2 rounded-pill ${
              activeTab === 'orders' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            All Platform Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn px-4 py-2 rounded-pill ${
              activeTab === 'users' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            Platform Users ({users.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Charts Row */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-lg-5">
                <div className="glass-card p-4 h-100">
                  <h5 className="text-white fw-bold mb-3">Order Status Distribution</h5>
                  <div style={{ height: '240px' }} className="d-flex align-items-center justify-content-center">
                    {statusCounts.length > 0 ? (
                      <Doughnut
                        data={statusData}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { color: '#94a3b8', font: { size: 11 } }
                            }
                          }
                        }}
                      />
                    ) : (
                      <span className="text-muted small">No order data yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-7">
                <div className="glass-card p-4 h-100">
                  <h5 className="text-white fw-bold mb-3">Midnight Category Catalog Inventory</h5>
                  <div style={{ height: '240px' }}>
                    {categoryCounts.length > 0 ? (
                      <Bar
                        data={categoryData}
                        options={{
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
                            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                          }
                        }}
                      />
                    ) : (
                      <span className="text-muted small">No category data available.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-card p-4">
              <h5 className="text-white fw-bold mb-3">Recent Midnight Orders</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr className="border-secondary border-opacity-25 small text-muted">
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Store</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Placed Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.recentOrders || []).map((o) => (
                      <tr key={o.id} className="border-secondary border-opacity-25 small align-middle">
                        <td>
                          <span className="badge bg-secondary">#{o.orderNumber}</span>
                        </td>
                        <td className="text-white">{o.customerName}</td>
                        <td className="text-light">{o.storeName}</td>
                        <td className="fw-bold text-white">₹{Number(o.totalAmount).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${o.status === 'DELIVERED' ? 'bg-success' : 'bg-purple-primary'}`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="text-muted">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORES */}
        {activeTab === 'stores' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="border-secondary border-opacity-25 small text-muted">
                    <th className="py-3 px-4">Store</th>
                    <th className="py-3">Owner</th>
                    <th className="py-3">Operating Hours</th>
                    <th className="py-3">Fee</th>
                    <th className="py-3">Live Status</th>
                    <th className="py-3 px-4 text-end">Active Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.id} className="border-secondary border-opacity-25 align-middle">
                      <td className="py-3 px-4">
                        <strong className="text-white d-block">{s.name}</strong>
                        <span className="small text-muted">{s.address}</span>
                      </td>
                      <td className="small text-light">{s.ownerName || 'Partner'}</td>
                      <td className="small text-muted">{s.operatingHoursDisplay || `${s.openingTime} - ${s.closingTime}`}</td>
                      <td className="small text-white">₹{s.deliveryFee}</td>
                      <td>
                        {s.isOpen ? (
                          <span className="badge-open">OPEN</span>
                        ) : (
                          <span className="badge-closed">CLOSED</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button
                          onClick={() => handleToggleStore(s.id)}
                          className={`btn btn-sm ${s.active ? 'btn-danger' : 'btn-success'} py-1 px-3 rounded-pill`}
                        >
                          {s.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="border-secondary border-opacity-25 small text-muted">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Store</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-secondary border-opacity-25 align-middle small">
                      <td className="py-3 px-4">
                        <span className="badge bg-secondary">#{o.orderNumber}</span>
                      </td>
                      <td>
                        <strong className="text-white d-block">{o.recipientName}</strong>
                        <span className="text-muted">{o.deliveryPhone}</span>
                      </td>
                      <td className="text-light">{o.storeName}</td>
                      <td className="text-muted">{o.items?.length} items</td>
                      <td className="fw-bold text-white">₹{Number(o.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${o.status === 'DELIVERED' ? 'bg-success' : 'bg-primary'}`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.status !== 'REJECTED' && (
                          <div className="dropdown d-inline-block">
                            <button
                              className="btn btn-sm btn-night-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Transition
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end glass-card-static border-secondary">
                              {o.status === 'PLACED' && (
                                <>
                                  <li>
                                    <button onClick={() => handleUpdateOrderStatus(o.id, 'ACCEPTED')} className="dropdown-item text-light">
                                      Accept
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handleUpdateOrderStatus(o.id, 'REJECTED')} className="dropdown-item text-danger">
                                      Reject
                                    </button>
                                  </li>
                                </>
                              )}
                              {o.status === 'ACCEPTED' && (
                                <li>
                                  <button onClick={() => handleUpdateOrderStatus(o.id, 'PREPARING')} className="dropdown-item text-light">
                                    Preparing
                                  </button>
                                </li>
                              )}
                              {o.status === 'PREPARING' && (
                                <li>
                                  <button onClick={() => handleUpdateOrderStatus(o.id, 'READY_FOR_PICKUP')} className="dropdown-item text-light">
                                    Ready for Pickup
                                  </button>
                                </li>
                              )}
                              {o.status === 'READY_FOR_PICKUP' && (
                                <li>
                                  <button onClick={() => handleUpdateOrderStatus(o.id, 'OUT_FOR_DELIVERY')} className="dropdown-item text-light">
                                    Dispatch Rider
                                  </button>
                                </li>
                              )}
                              {o.status === 'OUT_FOR_DELIVERY' && (
                                <li>
                                  <button onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')} className="dropdown-item text-success">
                                    Mark Delivered
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <div className="glass-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr className="border-secondary border-opacity-25 small text-muted">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-secondary border-opacity-25 align-middle small">
                      <td className="py-3 px-4">
                        <strong className="text-white">{u.fullName}</strong>
                      </td>
                      <td className="text-light">{u.email}</td>
                      <td className="text-muted">{u.phone || 'N/A'}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'ADMIN'
                              ? 'bg-danger'
                              : u.role === 'STORE_OWNER'
                              ? 'bg-warning text-dark'
                              : u.role === 'DELIVERY_PARTNER'
                              ? 'bg-success text-white'
                              : 'bg-secondary'
                          }`}
                        >
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
