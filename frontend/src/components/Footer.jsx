import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, ShieldCheck, Clock, Zap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-top border-secondary border-opacity-25 mt-5 pt-5 pb-4 bg-night-black">
      <div className="container">
        {/* Value Highlights */}
        <div className="row g-4 pb-5 mb-4 border-bottom border-secondary border-opacity-25 text-center text-md-start">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-purple-dark bg-opacity-25 text-purple-primary border border-primary border-opacity-25">
                <Clock size={24} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">Midnight Availability</h6>
                <p className="text-muted small mb-0">Live status checks ensure you only order from open late-night hubs.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-cyan-dark bg-opacity-25 text-cyan-primary border border-info border-opacity-25">
                <Zap size={24} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">Rapid 30-Min Delivery</h6>
                <p className="text-muted small mb-0">Hot food, pharmacy kits, and everyday essentials at lightning speed.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-success bg-opacity-25 text-success border border-success border-opacity-25">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-white">Cash on Delivery</h6>
                <p className="text-muted small mb-0">Zero pre-payment hassle. Inspect your order and pay at your doorstep.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-gradient" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Moon size={18} className="text-white" />
              </div>
              <span className="fw-bold fs-5 text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Night<span className="text-gradient-purple">Drop</span>
              </span>
            </div>
            <p className="text-muted small mb-3">
              NightDrop is India’s premier dedicated midnight food and essential supplies delivery platform.
              Operating round-the-clock and across midnight hours to deliver midnight cravings and emergency necessities right to your door.
            </p>
            <div className="text-muted small">
              <span className="text-success fw-semibold">● Platform Live</span> • Server Timezone: IST (UTC+05:30)
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3">Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><Link to="/products?category=FOOD_AND_SNACKS" className="text-muted text-decoration-none hover-white">Food & Snacks</Link></li>
              <li><Link to="/products?category=GROCERIES" className="text-muted text-decoration-none hover-white">Groceries & Milk</Link></li>
              <li><Link to="/products?category=PERSONAL_CARE" className="text-muted text-decoration-none hover-white">Personal Care</Link></li>
              <li><Link to="/products?category=ELECTRONICS_AND_ACCESSORIES" className="text-muted text-decoration-none hover-white">Electronics</Link></li>
              <li><Link to="/products?category=PET_ESSENTIALS" className="text-muted text-decoration-none hover-white">Pet Care</Link></li>
              <li><Link to="/products?category=BABY_ESSENTIALS" className="text-muted text-decoration-none hover-white">Baby Care</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3">Platform Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><Link to="/stores" className="text-muted text-decoration-none hover-white">All Stores & Timings</Link></li>
              <li><Link to="/products" className="text-muted text-decoration-none hover-white">Product Catalog</Link></li>
              <li><Link to="/orders" className="text-muted text-decoration-none hover-white">Track Your Order</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none hover-white">Store Owner Login</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none hover-white">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">College Project Demo</h6>
            <div className="p-3 rounded-3 glass-card small text-muted">
              <div className="fw-semibold text-white mb-1">Full-Stack Project Capstone</div>
              <div>Built with Java 21, Spring Boot 3.x, MySQL, React 18, Vite & Bootstrap 5.</div>
              <div className="mt-2 text-info small">Real-time Night Availability Engine active.</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-top border-secondary border-opacity-25 text-muted small">
          © {new Date().getFullYear()} NightDrop Platform. All rights reserved. Built with <Heart size={14} className="text-danger mx-1 inline" /> for midnight owls.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
