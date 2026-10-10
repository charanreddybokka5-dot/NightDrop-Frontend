import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Phone, User, CheckCircle2, ShieldCheck,
  CreditCard, Banknote, ArrowRight, AlertCircle, ArrowLeft, Plus
} from 'lucide-react';

const Checkout = () => {
  const { items, currentStore, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');

  // Address Form state
  const [formData, setFormData] = useState({
    recipientName: user?.fullName || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
    landmark: '',
    deliveryNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/api/addresses');
        setAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          setFormData((prev) => ({
            ...prev,
            recipientName: defaultAddr.recipientName || prev.recipientName,
            phone: defaultAddr.phone || prev.phone
          }));
        } else {
          setUseNewAddress(true);
        }
      } catch (err) {
        console.error('Failed to load saved addresses', err);
        setUseNewAddress(true);
      }
    };
    fetchAddresses();
  }, []);

  // Guard against empty cart
  if (items.length === 0) {
    return (
      <div className="night-gradient-bg py-5 text-center min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="glass-card p-5 max-w-lg mx-auto" style={{ maxWidth: '450px' }}>
            <AlertCircle size={48} className="text-warning mb-3" />
            <h3 className="text-white fw-bold">Cart is empty</h3>
            <p className="text-muted small">Please add items to your cart before proceeding to checkout.</p>
            <Link to="/products" className="btn btn-night-primary mt-2">
              Browse Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let finalRecipient = formData.recipientName;
      let finalPhone = formData.phone;
      let finalAddressText = '';

      if (!useNewAddress && selectedAddressId) {
        const addr = addresses.find((a) => a.id === selectedAddressId);
        if (addr) {
          finalRecipient = addr.recipientName;
          finalPhone = addr.phone;
          finalAddressText = `${addr.streetAddress}, ${addr.landmark ? addr.landmark + ', ' : ''}${addr.city}, ${addr.state} - ${addr.postalCode}`;
        }
      } else {
        if (!formData.streetAddress.trim()) {
          setError('Please provide a complete street delivery address.');
          setLoading(false);
          return;
        }
        finalAddressText = `${formData.streetAddress}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}, ${formData.state} - ${formData.postalCode}`;

        // Optionally save to addresses in background
        api.post('/api/addresses', {
          recipientName: formData.recipientName,
          phone: formData.phone,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          landmark: formData.landmark,
          isDefault: addresses.length === 0
        }).catch(() => {});
      }

      const payload = {
        storeId: currentStore?.id || items[0].product.storeId,
        recipientName: finalRecipient,
        deliveryPhone: finalPhone,
        deliveryAddress: finalAddressText,
        deliveryNotes: formData.deliveryNotes,
        paymentMethod: paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await api.post('/api/orders', payload);
      const createdOrder = res.data;

      // Clear the local cart
      clearCart();

      // Navigate to order details / tracking
      navigate(`/orders/${createdOrder.id}`, { state: { justPlaced: true } });
    } catch (err) {
      console.error('Order creation error', err);
      const msg = err.response?.data?.message || 'Failed to place midnight order. Please verify store availability and stock.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        <Link to="/cart" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 mb-3 hover-text-cyan">
          <ArrowLeft size={16} /> Back to Bag
        </Link>

        <h1 className="fw-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Midnight Express <span className="text-gradient-purple">Checkout</span>
        </h1>

        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light d-flex align-items-center gap-3 p-3 rounded-4 mb-4">
            <AlertCircle size={22} className="text-danger flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-4">
            {/* Left: Address & Payment */}
            <div className="col-12 col-lg-8">
              {/* Delivery Address Section */}
              <div className="glass-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-white fw-bold fs-5 mb-0 d-flex align-items-center gap-2">
                    <MapPin size={20} className="text-cyan-primary" /> Delivery Destination
                  </h4>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(!useNewAddress)}
                      className="btn btn-sm btn-night-secondary d-flex align-items-center gap-1"
                    >
                      {useNewAddress ? 'Use Saved Address' : '+ New Address'}
                    </button>
                  )}
                </div>

                {/* Saved addresses selector */}
                {!useNewAddress && addresses.length > 0 ? (
                  <div className="row g-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div key={addr.id} className="col-12 col-md-6">
                          <div
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-3 rounded-3 cursor-pointer h-100 transition ${
                              isSelected
                                ? 'border border-primary bg-primary bg-opacity-10'
                                : 'border border-secondary border-opacity-25 bg-night-card'
                            }`}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <strong className="text-white small">{addr.recipientName}</strong>
                              {isSelected && <CheckCircle2 size={18} className="text-primary" />}
                            </div>
                            <div className="small text-muted mb-1">{addr.phone}</div>
                            <div className="small text-light">
                              {addr.streetAddress}, {addr.city} - {addr.postalCode}
                            </div>
                            {addr.landmark && (
                              <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                Near: {addr.landmark}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* New address form */
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small">Recipient Full Name *</label>
                      <input
                        type="text"
                        name="recipientName"
                        className="form-control form-night"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted small">Phone Number for Delivery Rider *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control form-night"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-muted small">Street Address / Flat / Floor / Building *</label>
                      <input
                        type="text"
                        name="streetAddress"
                        className="form-control form-night"
                        placeholder="Flat 402, Moonlit Tower, Road No 10"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        required={useNewAddress}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted small">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control form-night"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted small">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control form-night"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted small">Postal Code / PIN *</label>
                      <input
                        type="text"
                        name="postalCode"
                        className="form-control form-night"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-muted small">Landmark (Optional)</label>
                      <input
                        type="text"
                        name="landmark"
                        className="form-control form-night"
                        placeholder="Opposite Metro Gate 2"
                        value={formData.landmark}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Delivery Notes */}
                <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <label className="form-label text-muted small">Rider Instructions (Night Gate Code / Bell Instructions)</label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    className="form-control form-night"
                    placeholder="e.g. Gate security buzzer #12, please do not ring door bell after 1 AM."
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="glass-card p-4">
                <h4 className="text-white fw-bold fs-5 mb-3 d-flex align-items-center gap-2">
                  <Banknote size={20} className="text-cyan-primary" /> Payment Method
                </h4>

                <div className="d-flex flex-column gap-3 mb-3">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`p-3 rounded-3 cursor-pointer d-flex align-items-center justify-content-between transition ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border border-primary bg-primary bg-opacity-10'
                        : 'border border-secondary border-opacity-25 bg-night-card'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-circle bg-primary bg-opacity-25 text-white">
                        <Banknote size={22} />
                      </div>
                      <div>
                        <strong className="text-white d-block">Cash on Delivery (COD)</strong>
                        <span className="small text-muted">Pay by Cash or UPI directly to the midnight delivery rider.</span>
                      </div>
                    </div>
                    {paymentMethod === 'CASH_ON_DELIVERY' && <CheckCircle2 size={22} className="text-primary" />}
                  </div>

                  {/* Option 2: Simulated Online Payment */}
                  <div
                    onClick={() => setPaymentMethod('SIMULATED_ONLINE')}
                    className={`p-3 rounded-3 cursor-pointer d-flex align-items-center justify-content-between transition ${
                      paymentMethod === 'SIMULATED_ONLINE'
                        ? 'border border-cyan-primary bg-cyan-primary bg-opacity-10'
                        : 'border border-secondary border-opacity-25 bg-night-card'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-circle bg-info bg-opacity-25 text-info">
                        <CreditCard size={22} />
                      </div>
                      <div>
                        <strong className="text-white d-block">Simulated Online Payment (UPI / Card)</strong>
                        <span className="small text-muted">Simulate instant prepaid transaction (demo payment gateway).</span>
                      </div>
                    </div>
                    {paymentMethod === 'SIMULATED_ONLINE' && <CheckCircle2 size={22} className="text-info" />}
                  </div>
                </div>

                <div className="small text-muted d-flex align-items-center gap-2 ps-1">
                  <ShieldCheck size={16} className="text-cyan-primary" />
                  <span>
                    {paymentMethod === 'SIMULATED_ONLINE'
                      ? 'Simulated online payment will mark this order as PAID instantly.'
                      : 'Payment will be collected by rider upon doorstep delivery.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="col-12 col-lg-4">
              <div className="glass-card p-4 position-sticky" style={{ top: '90px' }}>
                <h4 className="text-white fw-bold fs-5 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  Bag Review ({items.length} items)
                </h4>

                <div className="d-flex flex-column gap-2 mb-3 max-h-48 overflow-auto" style={{ maxHeight: '200px' }}>
                  {items.map((item) => (
                    <div key={item.product.id} className="d-flex justify-content-between small text-muted">
                      <span className="text-truncate me-2" style={{ maxWidth: '180px' }}>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-white fw-semibold">
                        ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-column gap-2 small py-3 border-top border-bottom border-secondary border-opacity-25">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Delivery Fee</span>
                    <span className="text-white">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Payment Mode</span>
                    <span className="text-cyan-primary fw-semibold">COD</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center py-3 mb-3">
                  <span className="text-white fw-bold fs-5">Amount Due</span>
                  <span className="price-tag text-gradient-purple">₹{totalAmount.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-night-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6 shadow-lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Dispatching Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Midnight Order</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
