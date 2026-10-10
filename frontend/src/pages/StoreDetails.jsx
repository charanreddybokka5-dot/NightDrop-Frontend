import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Clock, MapPin, Star, AlertTriangle, ShoppingBag, Check,
  Search, ArrowLeft, Store as StoreIcon, ShieldCheck
} from 'lucide-react';

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addedItemMap, setAddedItemMap] = useState({});

  const { addItem } = useCart();

  useEffect(() => {
    fetchStoreAndProducts();
  }, [id]);

  const fetchStoreAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [storeRes, productsRes] = await Promise.all([
        api.get(`/api/stores/${id}`),
        api.get(`/api/products/store/${id}`)
      ]);
      setStore(storeRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to load store details', err);
      setError('Could not find store details. It may be invalid or disabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const success = addItem(product, store);
    if (success) {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100">
        <div className="spinner-border text-primary mt-5" role="status"></div>
        <p className="text-muted mt-3 small">Loading store and midnight menu...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="night-gradient-bg py-5 min-vh-100">
        <div className="container text-center py-5">
          <div className="glass-card p-5 max-w-lg mx-auto">
            <AlertTriangle size={48} className="text-warning mb-3" />
            <h3 className="text-white fw-bold">Store Not Found</h3>
            <p className="text-muted">{error || 'Store does not exist or has been disabled.'}</p>
            <Link to="/stores" className="btn btn-night-primary mt-3">
              Browse Other Stores
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter categories present in this store
  const availableCategories = ['ALL', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Back Link */}
        <Link to="/stores" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 mb-3 hover-text-cyan">
          <ArrowLeft size={16} /> Back to all stores
        </Link>

        {/* Store Banner Card */}
        <div className="glass-card p-4 p-md-5 mb-5 border-0 overflow-hidden position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-4">
              <div className="rounded-4 overflow-hidden position-relative" style={{ height: '220px' }}>
                <img
                  src={store.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'}
                  alt={store.name}
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 end-0 m-3">
                  {store.isOpen ? (
                    <span className="badge-open">OPEN NOW</span>
                  ) : (
                    <span className="badge-closed">CLOSED</span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-purple-primary text-white px-2 py-1 small rounded-pill">
                  Verified Midnight Partner
                </span>
                <div className="d-inline-flex align-items-center gap-1 text-warning small">
                  <Star size={15} className="fill-warning" />
                  <strong className="text-white">{store.rating || '4.8'}</strong>
                </div>
              </div>

              <h1 className="text-white fw-extrabold display-6 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {store.name}
              </h1>

              <p className="text-muted mb-3" style={{ maxWidth: '650px' }}>
                {store.description || 'Specialized midnight preparation and delivery hub.'}
              </p>

              <div className="row g-3 pt-3 border-top border-secondary border-opacity-25 text-muted small">
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <Clock size={16} className="text-cyan-primary flex-shrink-0" />
                  <span>
                    Hours: <strong className="text-white">{store.operatingHoursDisplay || `${store.openingTime} - ${store.closingTime}`}</strong>
                  </span>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <MapPin size={16} className="text-purple-primary flex-shrink-0" />
                  <span className="text-truncate">{store.address}</span>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <ShoppingBag size={16} className="text-warning flex-shrink-0" />
                  <span>Delivery Fee: <strong className="text-white">₹{store.deliveryFee}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closed Warning Banner */}
        {!store.isOpen && (
          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-25 text-light d-flex align-items-center gap-3 p-4 rounded-4 mb-4">
            <AlertTriangle size={28} className="text-warning flex-shrink-0" />
            <div>
              <div className="fw-bold fs-6 text-warning">This store is currently CLOSED</div>
              <div className="small text-muted">
                Operating hours are {store.operatingHoursDisplay || `${store.openingTime} - ${store.closingTime}`}. Orders cannot be placed until the store re-opens.
              </div>
            </div>
          </div>
        )}

        {/* Menu Controls: Search & Category Filters */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h2 className="text-white fw-bold fs-4 mb-0" style={{ fontFamily: 'var(--font-display)' }}>
            Available <span className="text-gradient-purple">Products</span>
          </h2>

          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-night-card border-secondary text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control form-night border-start-0 py-1"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        {availableCategories.length > 2 && (
          <div className="d-flex gap-2 overflow-auto pb-3 mb-4 text-nowrap">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm px-3 py-1 rounded-pill ${
                  selectedCategory === cat ? 'btn-night-primary' : 'btn-night-secondary'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5 glass-card p-4">
            <StoreIcon size={40} className="text-muted mb-2 opacity-50" />
            <p className="text-muted mb-0">No items available in this category or search.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((p) => {
              const isAdded = addedItemMap[p.id];
              const isAvailable = (p.isAvailable !== false) && (p.stockQuantity === undefined || p.stockQuantity > 0);

              return (
                <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card glass-card h-100 border-0 overflow-hidden d-flex flex-column">
                    <div className="position-relative" style={{ height: '160px' }}>
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                        alt={p.name}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
                        }}
                      />
                      <span
                        className="badge position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill"
                        style={{
                          backgroundColor: 'rgba(7, 10, 19, 0.75)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '0.7rem'
                        }}
                      >
                        {p.category.replace(/_/g, ' ')}
                      </span>

                      {p.stockQuantity === 0 && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                      <h5 className="card-title text-white fw-bold fs-6 mb-1 text-truncate">
                        {p.name}
                      </h5>
                      <p className="card-text text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.82rem' }}>
                        {p.description || 'Prepared fresh for midnight dispatch.'}
                      </p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 mt-auto">
                        <span className="price-tag">₹{Number(p.price).toFixed(2)}</span>

                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={!isAvailable}
                          className={`btn btn-sm d-flex align-items-center gap-1 px-3 ${
                            isAdded ? 'btn-success' : 'btn-night-primary'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={16} /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={15} /> Add
                            </>
                          )}
                        </button>
                      </div>
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

export default StoreDetails;
