import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Store, Clock, MapPin, Search, Star, ShieldCheck, ArrowRight } from 'lucide-react';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // 'ALL' or 'OPEN'
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/stores');
      setStores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load stores', err);
      setStores([]);
      setError('Unable to load stores. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const storeList = Array.isArray(stores) ? stores : [];

  const filteredStores = storeList.filter((s) => {
    const matchesFilter = filter === 'OPEN' ? s.isOpen : true;
    const matchesSearch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Midnight <span className="text-gradient-purple">Stores & Hubs</span>
            </h1>
            <p className="text-muted small mb-0">
              Check real-time operating hours and order from kitchens and hubs open right now.
            </p>
          </div>

          {/* Search */}
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '360px', width: '100%' }}>
            <div className="input-group">
              <span className="input-group-text bg-night-card border-secondary text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control form-night border-start-0"
                placeholder="Search store name or locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4">
          <button
            onClick={() => setFilter('ALL')}
            className={`btn px-4 py-2 rounded-pill ${
              filter === 'ALL' ? 'btn-night-primary' : 'btn-night-secondary'
            }`}
          >
            All Stores ({stores.length})
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`btn px-4 py-2 rounded-pill ${
              filter === 'OPEN' ? 'btn-night-cyan' : 'btn-night-secondary'
            }`}
          >
            Open Now ({storeList.filter((s) => s.isOpen).length})
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading stores...</span>
            </div>
            <p className="text-muted mt-3 small">Checking midnight operational statuses...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light p-3 rounded-4 mb-4">
            {error}
          </div>
        )}

        {/* Stores Grid */}
        {!loading && !error && (
          <div className="row g-4">
            {filteredStores.length === 0 ? (
              <div className="col-12 text-center py-5 glass-card p-5">
                <Store size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Stores Found</h4>
                <p className="text-muted small">No partner stores match your current selection.</p>
              </div>
            ) : (
              filteredStores.map((store) => (
                <div key={store.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card glass-card h-100 border-0 overflow-hidden d-flex flex-column">
                    {/* Store Image */}
                    <div className="position-relative" style={{ height: '180px' }}>
                      <img
                        src={store.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'}
                        alt={store.name}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80';
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        {store.isOpen ? (
                          <span className="badge-open">OPEN NOW</span>
                        ) : (
                          <span className="badge-closed">CLOSED</span>
                        )}
                      </div>
                      <div
                        className="position-absolute bottom-0 start-0 m-3 px-2 py-1 rounded-pill small d-flex align-items-center gap-1"
                        style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
                      >
                        <Star size={13} className="text-warning fill-warning" />
                        <span className="text-white fw-bold">{store.rating || '4.8'}</span>
                      </div>
                    </div>

                    {/* Store Body */}
                    <div className="card-body p-4 d-flex flex-column">
                      <h4 className="card-title text-white fw-bold fs-5 mb-2">
                        {store.name}
                      </h4>
                      <p className="card-text text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.85rem' }}>
                        {store.description || 'Verified midnight partner kitchen and hub.'}
                      </p>

                      <div className="d-flex flex-column gap-2 py-2 border-top border-secondary border-opacity-25 small text-muted">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={15} className="text-cyan-primary flex-shrink-0" />
                          <span>Hours: <strong className="text-light">{store.operatingHoursDisplay || `${store.openingTime} - ${store.closingTime}`}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={15} className="text-purple-primary flex-shrink-0" />
                          <span className="text-truncate">{store.address}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-3">
                        <span className="small text-muted">
                          Fee: <strong className="text-white">₹{store.deliveryFee}</strong>
                        </span>

                        <Link
                          to={`/stores/${store.id}`}
                          className={`btn btn-sm d-flex align-items-center gap-1 px-3 ${
                            store.isOpen ? 'btn-night-primary' : 'btn-night-secondary'
                          }`}
                        >
                          View Menu <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;
