import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load cart on mount from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('gadgethub_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gadgethub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id?.toString() === product.id?.toString());

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const currentQty = newItems[existingItemIndex].quantity;
        const newQty = currentQty + quantity;

        // Cap at available stock
        newItems[existingItemIndex].quantity = Math.min(newQty, product.stock);
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id?.toString() !== productId?.toString()));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id?.toString() === productId?.toString() ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = async (shippingDetails) => {
    if (cartItems.length === 0) return null;

    // 1. Fetch backend products to resolve mock integer IDs to real ObjectIds
    let backendProducts = [];
    try {
      const prodRes = await api.get('/products');
      backendProducts = prodRes.data || [];
    } catch (err) {
      console.warn('Could not load products for ID resolution, using current items:', err.message);
    }

    // 2. Map cartItems to products array format required by backend model
    const mappedProducts = cartItems.map((item) => {
      let matchedId = item._id || item.id;
      
      // If the ID is an integer mock ID (e.g. 1 to 16), map it to the corresponding backend product ObjectId
      const idNum = parseInt(matchedId);
      if (!isNaN(idNum) && idNum >= 1 && idNum <= 16) {
        const mobiles = backendProducts.filter(p => p.category === 'mobile');
        const laptops = backendProducts.filter(p => p.category === 'laptop');

        if (idNum >= 1 && idNum <= 8) {
          const idx = idNum - 1;
          if (mobiles[idx]) matchedId = mobiles[idx]._id;
        } else if (idNum >= 9 && idNum <= 16) {
          const idx = idNum - 9;
          if (laptops[idx]) matchedId = laptops[idx]._id;
        }
      }

      return {
        product: matchedId,
        quantity: item.quantity,
      };
    });

    // 3. POST /orders request
    try {
      const response = await api.post('/orders', {
        products: mappedProducts,
        totalAmount: cartTotal,
      });

      // 4. Clear the cart state and localStorage on success
      clearCart();
      return response.data;
    } catch (error) {
      console.error('Order creation failed:', error.message);
      throw error;
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    orders,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
