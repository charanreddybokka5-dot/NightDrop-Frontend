import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Search, Filter, ShoppingBag, Check, Moon, Store,
  Utensils, Apple, HeartPulse, Cpu, PawPrint, Baby, AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Essentials', icon: Filter },
  { id: 'FOOD_AND_SNACKS', label: 'Food & Snacks', icon: Utensils },
  { id: 'GROCERIES', label: 'Groceries', icon: Apple },
  { id: 'PERSONAL_CARE', label: 'Personal Care', icon: HeartPulse },
  { id: 'ELECTRONICS_AND_ACCESSORIES', label: 'Tech & Cables', icon: Cpu },
  { id: 'PET_ESSENTIALS', label: 'Pet Care', icon: PawPrint },
  { id: 'BABY_ESSENTIALS', label: 'Baby Care', icon: Baby }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedItemMap, setAddedItemMap] = useState({});

  // Filters
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');

  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = '/api/products';
      if (selectedCategory && selectedCategory !== 'ALL') {
        url = `/api/products/category/${selectedCategory}`;
      }
      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
      setError('Failed to fetch midnight products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (product) => {
    const success = addItem(product, {
      id: product.storeId,
      name: product.storeName,
      deliveryFee: 39
    });
    if (success) {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  // Filter and Sort in-memory
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default ordering
  });

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Midnight <span className="text-gradient-purple">Catalog</span>
            </h1>
            <p className="text-muted small mb-0">
              Browse food, groceries, emergency tech, and personal care available tonight.
            </p>
          </div>

          {/* Search Input */}
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: '380px', width: '100%' }}>
            <div className="input-group">
              <span className="input-group-text bg-night-card border-secondary text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control form-night border-start-0"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4 text-nowrap" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
                  isActive ? 'btn-night-primary shadow-sm' : 'btn-night-secondary'
                }`}
                style={{ fontSize: '0.9rem' }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls: Count & Sort */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small">
            Showing <strong className="text-white">{sortedProducts.length}</strong> items available
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small d-none d-sm-inline">Sort by:</span>
            <select
              className="form-select form-night py-1 px-3 small"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="text-muted mt-3 small">Checking midnight inventory...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light d-flex align-items-center gap-3 p-3 rounded-4 mb-4">
            <AlertCircle size={22} className="text-danger flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-5 glass-card p-5">
                <Moon size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-white fw-bold">No Products Found</h4>
                <p className="text-muted small mb-4">
                  We couldn't find items matching your search or selected category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="btn btn-night-secondary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {sortedProducts.map((p) => {
                  const isAdded = addedItemMap[p.id];
                  return (
                    <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <div className="card glass-card h-100 border-0 overflow-hidden d-flex flex-column">
                        {/* Image Banner */}
                        <div className="position-relative" style={{ height: '175px', overflow: 'hidden' }}>
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

                          {p.stockQuantity <= 5 && p.stockQuantity > 0 && (
                            <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2 rounded-pill">
                              Only {p.stockQuantity} left
                            </span>
                          )}
                          {p.stockQuantity === 0 && (
                            <span className="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Body */}
                        <div className="card-body p-3 d-flex flex-column">
                          {/* Store link */}
                          <Link
                            to={`/stores/${p.storeId}`}
                            className="text-decoration-none small text-muted d-flex align-items-center gap-1 mb-1 hover-text-cyan"
                          >
                            <Store size={13} className="text-purple-primary" />
                            <span className="text-truncate">{p.storeName}</span>
                          </Link>

                          <h5 className="card-title text-white fw-bold fs-6 mb-1 text-truncate">
                            {p.name}
                          </h5>

                          <p className="card-text text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                            {p.description || 'Quick midnight delivery essential.'}
                          </p>

                          {/* Footer */}
                          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 mt-auto">
                            <div>
                              <span className="price-tag">₹{Number(p.price).toFixed(2)}</span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(p)}
                              disabled={p.stockQuantity === 0 || p.isAvailable === false}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
