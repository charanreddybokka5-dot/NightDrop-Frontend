import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import DeliveryPartnerDashboard from './pages/DeliveryPartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-night-black text-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Store Owner Protected Routes */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER', 'ADMIN']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Delivery Partner Console (Riders / Store Staff / Admin) */}
          <Route
            path="/delivery-partner"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'STORE_OWNER', 'ADMIN', 'CUSTOMER']}>
                <DeliveryPartnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Administrator Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
