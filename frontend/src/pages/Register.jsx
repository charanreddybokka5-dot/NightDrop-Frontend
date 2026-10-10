import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Store } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'STORE_OWNER') {
        navigate('/owner-dashboard');
      } else if (user.role === 'DELIVERY_PARTNER') {
        navigate('/delivery-partner');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error', err);
      const msg = err.response?.data?.message || 'Registration failed. Email might already be taken.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="night-gradient-bg min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="glass-card p-4 p-md-5">
              {/* Brand Header */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center p-3 rounded-4 mb-3"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' }}
                >
                  <Moon size={32} className="text-white" />
                </div>
                <h2 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Create <span className="text-gradient-purple">Account</span>
                </h2>
                <p className="text-muted small">Join NightDrop for midnight express delivery</p>
              </div>

              {error && (
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light d-flex align-items-center gap-2 p-3 rounded-3 small mb-4">
                  <AlertCircle size={18} className="text-danger flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="mb-4">
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label text-muted small">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control form-night border-start-0"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label text-muted small">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-night border-start-0"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label text-muted small">Phone Number *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-night border-start-0"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label text-muted small">Password (Min 6 chars) *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-night border-start-0"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="mb-4">
                  <label className="form-label text-muted small">Account Type</label>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'CUSTOMER' }))}
                      className={`btn flex-fill py-2 text-start px-3 rounded-3 small ${
                        formData.role === 'CUSTOMER' ? 'btn-night-primary' : 'btn-night-secondary'
                      }`}
                    >
                      <User size={15} className="me-1" /> Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'DELIVERY_PARTNER' }))}
                      className={`btn flex-fill py-2 text-start px-3 rounded-3 small ${
                        formData.role === 'DELIVERY_PARTNER' ? 'btn-night-primary' : 'btn-night-secondary'
                      }`}
                    >
                      <User size={15} className="me-1" /> Delivery Partner
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'STORE_OWNER' }))}
                      className={`btn flex-fill py-2 text-start px-3 rounded-3 small ${
                        formData.role === 'STORE_OWNER' ? 'btn-night-primary' : 'btn-night-secondary'
                      }`}
                    >
                      <Store size={15} className="me-1" /> Store Owner
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-night-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6 shadow"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <span>Create NightDrop Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center text-muted small">
                Already registered?{' '}
                <Link to="/login" className="text-cyan-primary text-decoration-none fw-semibold">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
