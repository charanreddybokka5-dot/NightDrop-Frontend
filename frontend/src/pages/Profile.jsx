import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Phone, Lock, MapPin, Trash2, Edit2,
  CheckCircle2, Plus, ShieldCheck, AlertCircle, Save
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    streetAddress: '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
    landmark: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const res = await api.get('/api/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/api/user/profile', profileForm);
      updateUser(res.data);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.post('/api/user/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressForm({
        recipientName: addr.recipientName || '',
        phone: addr.phone || '',
        streetAddress: addr.streetAddress || '',
        city: addr.city || '',
        state: addr.state || '',
        postalCode: addr.postalCode || '',
        landmark: addr.landmark || '',
        isDefault: addr.isDefault || false
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        recipientName: user?.fullName || '',
        phone: user?.phone || '',
        streetAddress: '',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        landmark: '',
        isDefault: addresses.length === 0
      });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await api.put(`/api/addresses/${editingAddressId}`, addressForm);
      } else {
        await api.post('/api/addresses', addressForm);
      }
      setShowAddressModal(false);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this delivery address?')) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await api.patch(`/api/addresses/${id}/default`);
      fetchAddresses();
    } catch (err) {
      alert('Failed to set default address.');
    }
  };

  return (
    <div className="night-gradient-bg py-4 min-vh-100">
      <div className="container">
        <h1 className="fw-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Account <span className="text-gradient-purple">Settings & Addresses</span>
        </h1>

        <div className="row g-4">
          {/* Profile & Security Left Column */}
          <div className="col-12 col-lg-5">
            {/* Profile Info */}
            <div className="glass-card p-4 mb-4">
              <h4 className="text-white fw-bold fs-5 mb-3 d-flex align-items-center gap-2">
                <User size={18} className="text-cyan-primary" /> Profile Info
              </h4>

              {profileSuccess && (
                <div className="alert alert-success bg-success bg-opacity-10 border-success text-light p-2 small mb-3">
                  {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light p-2 small mb-3">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-night"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Email Address (Registered)</label>
                  <input
                    type="email"
                    className="form-control form-night opacity-75"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control form-night"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Account Role</label>
                  <span className="badge bg-secondary d-block py-2 text-start px-3">
                    {user?.role}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn btn-night-primary btn-sm px-4 py-2 d-flex align-items-center gap-1"
                >
                  <Save size={15} /> Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="glass-card p-4">
              <h4 className="text-white fw-bold fs-5 mb-3 d-flex align-items-center gap-2">
                <Lock size={18} className="text-purple-primary" /> Security
              </h4>

              {passwordSuccess && (
                <div className="alert alert-success bg-success bg-opacity-10 border-success text-light p-2 small mb-3">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-light p-2 small mb-3">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Current Password</label>
                  <input
                    type="password"
                    className="form-control form-night"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">New Password</label>
                  <input
                    type="password"
                    className="form-control form-night"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control form-night"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="btn btn-night-secondary btn-sm px-4 py-2"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Saved Addresses Right Column */}
          <div className="col-12 col-lg-7">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white fw-bold fs-5 mb-0 d-flex align-items-center gap-2">
                  <MapPin size={20} className="text-cyan-primary" /> Saved Delivery Addresses
                </h4>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="btn btn-night-primary btn-sm d-flex align-items-center gap-1"
                >
                  <Plus size={16} /> Add Address
                </button>
              </div>

              {addressesLoading ? (
                <div className="text-center py-4 text-muted small">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-5 border border-dashed border-secondary rounded-3 p-4">
                  <MapPin size={36} className="text-muted mb-2 opacity-50" />
                  <p className="text-muted small mb-3">No saved addresses found. Add one for quick midnight checkout!</p>
                  <button onClick={() => handleOpenAddressModal()} className="btn btn-sm btn-night-secondary">
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3 rounded-3 border border-secondary border-opacity-25 bg-night-card d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong className="text-white">{addr.recipientName}</strong>
                          {addr.isDefault && (
                            <span className="badge bg-success bg-opacity-25 text-success small">Default</span>
                          )}
                        </div>
                        <div className="small text-muted mb-1">{addr.phone}</div>
                        <div className="small text-light">
                          {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                        </div>
                        {addr.landmark && (
                          <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                            Landmark: {addr.landmark}
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="btn btn-sm btn-night-secondary py-1 px-2 small"
                            title="Set as Default"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenAddressModal(addr)}
                          className="btn btn-sm text-muted p-1 hover-text-white border-0"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="btn btn-sm text-danger p-1 hover-bg-danger-subtle border-0"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-secondary text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-white">
                  {editingAddressId ? 'Edit Address' : 'Add New Midnight Address'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddressModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveAddress}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small">Recipient Full Name</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.recipientName}
                        onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Contact Phone Number</label>
                      <input
                        type="tel"
                        className="form-control form-night"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Street Address / Flat / Building</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.streetAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">City</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">State</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Postal Code / PIN</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">Landmark</label>
                      <input
                        type="text"
                        className="form-control form-night"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-night-secondary"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-night-primary">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
