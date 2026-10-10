import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Mail, Lock, ArrowRight, AlertCircle, Shield, Store, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner-dashboard');
      } else if (user.role === 'DELIVERY_PARTNER') {
        navigate('/delivery-partner');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
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
                  Welcome <span className="text-gradient-purple">Back</span>
                </h2>
                <p className="text-muted small">Sign in to your NightDrop midnight account</p>
              </div>

              {error && (
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light d-flex align-items-center gap-2 p-3 rounded-3 small mb-4">
                  <AlertCircle size={18} className="text-danger flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                  <label className="form-label text-muted small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      className="form-control form-night border-start-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-night-card border-secondary text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control form-night border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Demo Credentials */}
              <div className="pt-3 border-top border-secondary border-opacity-25 mb-4">
                <span className="d-block text-center text-muted small mb-2 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  COLLEGE DEMO 1-CLICK FILL
                </span>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    type="button"
                    onClick={() => fillDemo('customer@nightdrop.com', 'Customer@123')}
                    className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <User size={13} className="text-cyan-primary" /> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('rider@nightdrop.com', 'Rider@123')}
                    className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <User size={13} className="text-success" /> Delivery Rider
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('diner@nightdrop.com', 'Owner@123')}
                    className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Store size={13} className="text-warning" /> Store Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('admin@nightdrop.com', 'Admin@123')}
                    className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Shield size={13} className="text-danger" /> Admin
                  </button>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center text-muted small">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-cyan-primary text-decoration-none fw-semibold">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
