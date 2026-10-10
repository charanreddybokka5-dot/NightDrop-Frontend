import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Moon, User, Store, Shield, LogOut, Package, MapPin } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isStoreOwner, isDeliveryPartner, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-night py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div className="d-flex align-items-center justify-content-center bg-gradient rounded-3 p-2"
               style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}>
            <Moon size={22} className="text-white" />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold fs-4 tracking-wide text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
              Night<span className="text-gradient-purple">Drop</span>
            </span>
            <span className="text-muted" style={{ fontSize: '0.65rem', marginTop: '-4px', letterSpacing: '1px' }}>
              MIDNIGHT EXPRESS
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link to="/" className="nav-link-night">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link-night">Browse Items</Link>
            </li>
            <li className="nav-item">
              <Link to="/stores" className="nav-link-night">Stores & Open Hours</Link>
            </li>
          </ul>

          {/* Right Action Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link to="/cart" className="btn btn-night-secondary position-relative d-flex align-items-center gap-2 px-3">
              <ShoppingBag size={18} className="text-cyan-primary" />
              <span className="d-none d-sm-inline">Cart</span>
              {itemCount > 0 && (
                <span className="cart-badge ms-1">{itemCount}</span>
              )}
            </Link>

            {/* Auth Area */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-night-secondary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                       style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', fontSize: '12px' }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-truncate" style={{ maxWidth: '120px' }}>{user?.fullName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end glass-card-static border-secondary mt-2 shadow-lg" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 border-bottom border-secondary mb-1">
                    <div className="fw-semibold text-white">{user?.fullName}</div>
                    <div className="small text-muted">{user?.email}</div>
                    <span className="badge bg-secondary mt-1">{user?.role}</span>
                  </li>

                  {/* Customer specific */}
                  <li>
                    <Link to="/orders" className="dropdown-item text-light d-flex align-items-center gap-2 py-2">
                      <Package size={16} /> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item text-light d-flex align-items-center gap-2 py-2">
                      <MapPin size={16} /> Profile & Addresses
                    </Link>
                  </li>

                  {/* Store Owner specific */}
                  {(isStoreOwner || isAdmin) && (
                    <>
                      <li><hr className="dropdown-divider border-secondary" /></li>
                      <li>
                        <Link to="/owner-dashboard" className="dropdown-item text-light d-flex align-items-center gap-2 py-2 text-warning">
                          <Store size={16} /> Store Dashboard
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Delivery Partner / Rider specific */}
                  {(isDeliveryPartner || isStoreOwner || isAdmin) && (
                    <li>
                      <Link to="/delivery-partner" className="dropdown-item text-light d-flex align-items-center gap-2 py-2 text-cyan-primary">
                        <Package size={16} /> Rider Dispatch Console
                      </Link>
                    </li>
                  )}

                  {/* Admin specific */}
                  {isAdmin && (
                    <li>
                      <Link to="/admin-dashboard" className="dropdown-item text-light d-flex align-items-center gap-2 py-2 text-info">
                        <Shield size={16} /> Admin Console
                      </Link>
                    </li>
                  )}

                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center gap-2 py-2">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-night-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-night-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
