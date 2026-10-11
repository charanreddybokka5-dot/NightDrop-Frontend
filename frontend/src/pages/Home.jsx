import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Moon, Search, Clock, ShieldCheck, ShoppingBag, ArrowRight,
  Utensils, Apple, HeartPulse, Cpu, PawPrint, Baby, Star, MapPin, Check
} from 'lucide-react';

const CATEGORIES = [
  { id: 'FOOD_AND_SNACKS', label: 'Food & Snacks', icon: Utensils, color: '#f59e0b' },
  { id: 'GROCERIES', label: 'Groceries', icon: Apple, color: '#10b981' },
  { id: 'PERSONAL_CARE', label: 'Personal Care', icon: HeartPulse, color: '#ec4899' },
  { id: 'ELECTRONICS_AND_ACCESSORIES', label: 'Tech & Cables', icon: Cpu, color: '#06b6d4' },
  { id: 'PET_ESSENTIALS', label: 'Pet Care', icon: PawPrint, color: '#8b5cf6' },
  { id: 'BABY_ESSENTIALS', label: 'Baby Care', icon: Baby, color: '#3b82f6' }
];

const Home = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [serverTime, setServerTime] = useState('');
  const { addItem } = useCart();
  const [addedItemMap, setAddedItemMap] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          api.get('/api/stores').catch((err) => {
            console.warn('Stores fetch notice:', err?.message);
            return { data: [] };
          }),
          api.get('/api/products').catch((err) => {
            console.warn('Products fetch notice:', err?.message);
            return { data: [] };
          })
        ]);
        const validStores = Array.isArray(storesRes.data) ? storesRes.data : [];
        const validProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
        setStores(validStores);
        if (validStores.length > 0 && validStores[0]?.currentServerTime) {
          setServerTime(validStores[0].currentServerTime);
        }
        setProducts(validProducts.slice(0, 8)); // Top 8 items
      } catch (err) {
        console.error('Failed to load landing page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const openStores = Array.isArray(stores) ? stores.filter((s) => s.isOpen) : [];

  return (
    <div className="night-gradient-bg pb-5">
      {/* Hero Section */}
      <section className="position-relative py-5 overflow-hidden">
        <div className="hero-glow"></div>
        <div className="container position-relative pt-4 pb-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              {/* Server Clock & Availability Pill */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill glass-card mb-4 border-primary border-opacity-25">
                <Moon size={16} className="text-cyan-primary" />
                <span className="small text-white fw-semibold">
                  Midnight Hub Active: <span className="text-cyan-primary">{serverTime || 'IST Real-Time Clock'}</span>
                </span>
                <span className="badge bg-success rounded-pill px-2 py-1 ms-1" style={{ fontSize: '10px' }}>LIVE</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
                Midnight Cravings & Emergencies <br />
                <span className="text-gradient-purple">Delivered In 30 Mins.</span>
              </h1>

              <p className="lead text-muted mb-4" style={{ maxWidth: '580px' }}>
                Hot food, emergency medicines, charging cables, late-night groceries and pet food delivered to your doorstep all night long.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="d-flex p-2 rounded-4 glass-card border-secondary mb-4 shadow" style={{ maxWidth: '560px' }}>
                <div className="d-flex align-items-center ps-3 text-muted">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 text-white shadow-none ps-3"
                  placeholder="Search rolls, charger, milk, balm, diapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-night-primary px-4">
                  Find Now
                </button>
              </form>

              {/* Stats badges */}
              <div className="d-flex flex-wrap gap-4 pt-2 justify-content-center justify-content-lg-start">
                <div className="d-flex align-items-center gap-2">
                  <div className="text-cyan-primary fw-bold fs-4">{openStores.length}</div>
                  <div className="small text-muted text-start" style={{ lineHeight: 1.2 }}>Stores<br />Open Now</div>
                </div>
                <div className="vr bg-secondary opacity-25"></div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-purple-primary fw-bold fs-4">20+</div>
                  <div className="small text-muted text-start" style={{ lineHeight: 1.2 }}>Midnight<br />Essentials</div>
                </div>
                <div className="vr bg-secondary opacity-25"></div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-success fw-bold fs-4">₹0</div>
                  <div className="small text-muted text-start" style={{ lineHeight: 1.2 }}>Advance Fee<br />COD Only</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-lg-5">
              <div className="glass-card p-4 rounded-4 position-relative overflow-hidden border-primary border-opacity-25 shadow-lg">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-purple-dark text-purple-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill">
                    ✨ Featured Hub
                  </span>
                  <span className="badge-open">Live Now</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Midnight Diner"
                  className="img-fluid rounded-3 mb-3 w-100 object-fit-cover shadow"
                  style={{ height: '220px' }}
                />
                <h4 className="fw-bold text-white mb-1">Midnight Cravings Diner</h4>
                <p className="text-muted small mb-3">Loaded Kathi Rolls, smash burgers & sizzling brownies hot off the grill.</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <span className="text-muted small">Hours: 07:00 PM - 05:00 AM IST</span>
                  <Link to="/stores/1" className="btn btn-sm btn-night-cyan">
                    View Menu <ArrowRight size={14} className="ms-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Chips Section */}
      <section className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Explore by Category
            </h3>
            <p className="text-muted small mb-0">Browse everyday necessities and late-night sustenance</p>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-6 g-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div className="col" key={cat.id}>
                <Link
                  to={`/products?category=${cat.id}`}
                  className="text-decoration-none"
                >
                  <div className="glass-card p-3 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                    <div
                      className="p-3 rounded-circle mb-2 d-flex align-items-center justify-content-center"
                      style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}35` }}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="small fw-semibold text-light">{cat.label}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Stores Section */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge-open">Live Availability</span>
            </div>
            <h3 className="fw-bold text-white mb-0" style={{ fontFamily: 'var(--font-display)' }}>
              Stores Operating Right Now
            </h3>
          </div>
          <Link to="/stores" className="text-cyan-primary text-decoration-none small fw-semibold">
            See All Stores <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : openStores.length === 0 ? (
          <div className="glass-card p-5 text-center my-3">
            <Clock size={40} className="text-warning mb-3" />
            <h5 className="text-white">All stores are currently closed for the hour</h5>
            <p className="text-muted small mb-3">Our stores operate primarily during midnight hours. Check back during late-night schedules or view store hours.</p>
            <Link to="/stores" className="btn btn-night-secondary">
              View All Store Operating Windows
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {openStores.map((store) => (
              <div className="col" key={store.id}>
                <div className="glass-card h-100 p-3 d-flex flex-column">
                  <div className="position-relative mb-3">
                    <img
                      src={store.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                      alt={store.name}
                      className="w-100 rounded-3 object-fit-cover shadow"
                      style={{ height: '180px' }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge-open shadow-sm">OPEN</span>
                    </div>
                  </div>

                  <h5 className="fw-bold text-white mb-1">{store.name}</h5>
                  <p className="text-muted small text-truncate mb-2">{store.description}</p>

                  <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                    <MapPin size={14} className="text-cyan-primary" />
                    <span className="text-truncate">{store.address}</span>
                  </div>

                  <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-success small fw-semibold">{store.operatingStatusMessage}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>Delivery Fee: ₹{store.deliveryFee}</div>
                    </div>
                    <Link to={`/stores/${store.id}`} className="btn btn-sm btn-night-primary">
                      Visit Store
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Grid */}
      <section className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h3 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Midnight Essentials & Fast Bites
            </h3>
            <p className="text-muted small mb-0">High-demand products delivered rapidly tonight</p>
          </div>
          <Link to="/products" className="text-cyan-primary text-decoration-none small fw-semibold">
            View Full Catalog <ArrowRight size={14} />
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {(Array.isArray(products) ? products : []).map((p) => (
            <div className="col" key={p.id}>
              <div className="glass-card h-100 p-3 d-flex flex-column">
                <div className="position-relative mb-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-100 rounded-3 object-fit-cover shadow"
                    style={{ height: '170px' }}
                  />
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-dark bg-opacity-75 text-light border border-secondary border-opacity-50" style={{ fontSize: '11px' }}>
                      {p.categoryDisplayName}
                    </span>
                  </div>
                  {p.isStoreOpen ? (
                    <div className="position-absolute bottom-0 end-0 m-2">
                      <span className="badge bg-success bg-opacity-75 px-2 py-1" style={{ fontSize: '10px' }}>Hub Open</span>
                    </div>
                  ) : (
                    <div className="position-absolute bottom-0 end-0 m-2">
                      <span className="badge bg-danger bg-opacity-75 px-2 py-1" style={{ fontSize: '10px' }}>Hub Closed</span>
                    </div>
                  )}
                </div>

                <div className="text-muted small mb-1">{p.storeName}</div>
                <h6 className="fw-bold text-white mb-1 text-truncate" title={p.name}>{p.name}</h6>
                <p className="text-muted small text-truncate-2 mb-3" style={{ fontSize: '12px', minHeight: '36px' }}>
                  {p.description}
                </p>

                <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                  <div className="price-tag text-white">₹{p.price}</div>
                  <button
                    disabled={p.stockQuantity <= 0 || p.isAvailable === false}
                    onClick={() => handleAddToCart(p)}
                    className={`btn btn-sm d-flex align-items-center gap-1 ${
                      addedItemMap[p.id] ? 'btn-success' : 'btn-night-cyan'
                    }`}
                    title={p.stockQuantity <= 0 ? "Out of stock" : "Add to cart"}
                  >
                    {addedItemMap[p.id] ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container py-5 my-3">
        <div className="glass-card p-4 p-md-5 rounded-4 border-primary border-opacity-25">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              How NightDrop Works
            </h3>
            <p className="text-muted small">Seamless 3-step order and delivery designed for the midnight hours</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3 mb-3 d-inline-flex rounded-circle bg-purple-dark bg-opacity-25 text-purple-primary border border-primary border-opacity-25">
                <Clock size={32} />
              </div>
              <h5 className="fw-bold text-white mb-2">1. Find Open Hubs</h5>
              <p className="text-muted small">
                Our night availability engine calculates active operating hours so you only browse stores and products ready right now.
              </p>
            </div>

            <div className="col-md-4">
              <div className="p-3 mb-3 d-inline-flex rounded-circle bg-cyan-dark bg-opacity-25 text-cyan-primary border border-info border-opacity-25">
                <ShoppingBag size={32} />
              </div>
              <h5 className="fw-bold text-white mb-2">2. Assemble Your Order</h5>
              <p className="text-muted small">
                Add food, snacks, medicine, chargers or infant supplies to your bag with live inventory validation.
              </p>
            </div>

            <div className="col-md-4">
              <div className="p-3 mb-3 d-inline-flex rounded-circle bg-success bg-opacity-25 text-success border border-success border-opacity-25">
                <ShieldCheck size={32} />
              </div>
              <h5 className="fw-bold text-white mb-2">3. Cash on Delivery</h5>
              <p className="text-muted small">
                Place your order with zero payment gateway friction. Track live status until the delivery arrives at your door.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
