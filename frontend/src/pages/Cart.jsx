import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight,
  ShieldCheck, AlertCircle, Store, ArrowLeft
} from 'lucide-react';

const Cart = () => {
  const {
    items,
    currentStore,
    subtotal,
    deliveryFee,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="night-gradient-bg py-5 min-vh-100 d-flex align-items-center">
        <div className="container text-center py-5">
          <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '480px' }}>
            <div
              className="d-inline-flex p-4 rounded-circle mb-3"
              style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
              <ShoppingBag size={48} className="text-purple-primary" />
            </div>
            <h2 className="text-white fw-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Your Midnight Cart is Empty
            </h2>
            <p className="text-muted small mb-4">
              Explore midnight food, tech accessories, medicine, and groceries available right now.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/products" className="btn btn-night-primary px-4 py-2">
                Browse Items
              </Link>
              <Link to="/stores" className="btn btn-night-secondary px-4 py-2">
                View Open Stores
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        {/* Navigation & Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Link to="/products" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 mb-2 hover-text-cyan">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="fw-bold text-white mb-0" style={{ fontFamily: 'var(--font-display)' }}>
              Review <span className="text-gradient-purple">Midnight Bag</span>
            </h1>
          </div>

          <button onClick={clearCart} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-3">
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Store Origin Notice */}
        {currentStore && (
          <div className="glass-card p-3 mb-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <Store size={20} className="text-cyan-primary flex-shrink-0" />
              <div>
                <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>ORDERING FROM</span>
                <strong className="text-white">{currentStore.name}</strong>
              </div>
            </div>
            <Link to={`/stores/${currentStore.id}`} className="btn btn-sm btn-night-secondary">
              View Store Menu
            </Link>
          </div>
        )}

        <div className="row g-4">
          {/* Items List */}
          <div className="col-12 col-lg-8">
            <div className="glass-card p-4">
              <div className="d-flex flex-column gap-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 rounded-3 gap-3"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    {/* Product Details */}
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'}
                        alt={item.product.name}
                        className="rounded-3 object-fit-cover"
                        style={{ width: '70px', height: '70px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80';
                        }}
                      />
                      <div>
                        <h6 className="text-white fw-bold mb-1">{item.product.name}</h6>
                        <span className="text-muted small d-block">
                          ₹{Number(item.product.price).toFixed(2)} each
                        </span>
                        <span className="badge bg-secondary bg-opacity-25 text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                          {item.product.category?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4">
                      {/* Quantity Selector */}
                      <div className="d-flex align-items-center border border-secondary rounded-pill px-2 py-1 bg-night-card">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="btn btn-sm text-muted p-1 hover-text-white border-0"
                          title="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white fw-bold px-3 small">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="btn btn-sm text-muted p-1 hover-text-white border-0"
                          disabled={item.quantity >= item.product.stockQuantity}
                          title="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-end" style={{ minWidth: '85px' }}>
                        <span className="fw-bold text-white fs-6">
                          ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="btn btn-sm text-danger p-2 hover-bg-danger-subtle rounded-3 border-0"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="glass-card p-4 position-sticky" style={{ top: '90px' }}>
              <h4 className="text-white fw-bold fs-5 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Order Summary
              </h4>

              <div className="d-flex flex-column gap-2 small pb-3 border-bottom border-secondary border-opacity-25">
                <div className="d-flex justify-content-between text-muted">
                  <span>Items Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Midnight Delivery Fee</span>
                  <span className="text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Night Express Surge</span>
                  <span className="text-success fw-bold">FREE (Demo)</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 mb-3">
                <span className="text-white fw-bold fs-5">Total Amount</span>
                <span className="price-tag text-gradient-purple">₹{totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="btn btn-night-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6 mb-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="d-flex align-items-center gap-2 justify-content-center text-muted small">
                <ShieldCheck size={16} className="text-cyan-primary" />
                <span>Cash on Delivery (COD) supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
