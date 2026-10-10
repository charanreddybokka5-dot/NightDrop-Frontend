import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nightdrop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentStore, setCurrentStore] = useState(() => {
    try {
      const savedStore = localStorage.getItem('nightdrop_cart_store');
      return savedStore ? JSON.parse(savedStore) : null;
    } catch {
      return null;
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem('nightdrop_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
    if (items.length === 0) {
      setCurrentStore(null);
      localStorage.removeItem('nightdrop_cart_store');
    }
  }, [items]);

  useEffect(() => {
    if (currentStore) {
      try {
        localStorage.setItem('nightdrop_cart_store', JSON.stringify(currentStore));
      } catch (e) {
        console.error('Failed to save store to localStorage', e);
      }
    }
  }, [currentStore]);

  const addItem = (product, storeInfo, quantity = 1) => {
    if (!product) return false;

    const targetStoreId = storeInfo ? storeInfo.id : product.storeId;
    const targetStoreName = storeInfo ? storeInfo.name : (product.storeName || 'Midnight Store');
    const targetDeliveryFee = storeInfo?.deliveryFee !== undefined 
      ? Number(storeInfo.deliveryFee) 
      : (product.deliveryFee !== undefined ? Number(product.deliveryFee) : 39);

    // Check if adding from a different store
    if (currentStore && targetStoreId && String(currentStore.id) !== String(targetStoreId)) {
      const confirmSwitch = window.confirm(
        `Your cart already has items from "${currentStore.name}". Clear your cart and start an order from "${targetStoreName}"?`
      );
      if (!confirmSwitch) {
        return false;
      }
      setItems([{ product, quantity }]);
      setCurrentStore({
        id: targetStoreId,
        name: targetStoreName,
        deliveryFee: targetDeliveryFee
      });
      showToast(`Started new cart with ${product.name}!`);
      return true;
    }

    if (!currentStore && targetStoreId) {
      setCurrentStore({
        id: targetStoreId,
        name: targetStoreName,
        deliveryFee: targetDeliveryFee
      });
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => String(item.product.id) === String(product.id));
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prevItems, { product, quantity }];
    });

    showToast(`Added ${product.name} to midnight bag!`);
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        String(item.product.id) === String(productId) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => String(item.product.id) !== String(productId)));
  };

  const clearCart = () => {
    setItems([]);
    setCurrentStore(null);
    localStorage.removeItem('nightdrop_cart');
    localStorage.removeItem('nightdrop_cart_store');
  };

  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * (Number(item.quantity) || 1),
    0
  );

  const deliveryFee = currentStore && currentStore.deliveryFee !== undefined
    ? Number(currentStore.deliveryFee)
    : (items.length > 0 ? 39 : 0);

  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        currentStore,
        itemCount,
        subtotal,
        deliveryFee,
        totalAmount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        toastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-4 shadow-lg text-white d-flex align-items-center gap-3 animate-fade-in"
          style={{
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            border: '1px solid #7c3aed',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
            maxWidth: '380px'
          }}
        >
          <div className="bg-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
            ✓
          </div>
          <div className="fw-semibold small">{toastMessage}</div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
