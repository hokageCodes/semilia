'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useIsClient } from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const isClient = useIsClient();
  const isInitialized = useRef(false);
  
  // Track if we've loaded the cart initially
  const hasLoadedRef = useRef(false);
  const prevAuthRef = useRef(null);
  const isSavingRef = useRef(false);
  const authStateRef = useRef(isAuthenticated);
  const userRef = useRef(user);

  // Update refs whenever they change
  useEffect(() => {
    authStateRef.current = isAuthenticated;
    userRef.current = user;
  }, [isAuthenticated, user]);

  // Load cart from localStorage ONCE on mount (after auth loads)
  useEffect(() => {
    if (!isClient || hasLoadedRef.current) {
      if (!authLoading && !hasLoadedRef.current) {
        setLoading(false);
      }
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Load cart once - prevent saving during this operation
    isSavingRef.current = true;
    try {
      // Use refs to get current auth state and user (avoids dependency issues)
      const currentAuthState = authStateRef.current;
      const currentUser = userRef.current;
      
      // Determine cart key based on auth state
      const cartKey = currentAuthState && currentUser?._id 
        ? `cart_${currentUser._id}` 
        : 'cart';
      
      // Load cart from localStorage
      const cartData = localStorage.getItem(cartKey);
      if (cartData) {
        try {
          const savedCart = JSON.parse(cartData);
          console.log(`🛒 Loading cart from localStorage (${cartKey}):`, savedCart);
          if (Array.isArray(savedCart) && savedCart.length > 0) {
            setCart(savedCart);
          } else {
            setCart([]);
          }
        } catch (parseError) {
          console.error('❌ Error parsing cart data:', parseError);
          setCart([]);
        }
      } else {
        setCart([]);
      }
      
      prevAuthRef.current = currentAuthState;
      hasLoadedRef.current = true;
      isInitialized.current = true;
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
      // Allow saving after load completes
      setTimeout(() => {
        isSavingRef.current = false;
      }, 200);
    }
  }, [isClient, authLoading]); // Only depend on authLoading

  // Save cart to localStorage whenever it changes (for both guests and authenticated users)
  useEffect(() => {
    // Don't save if:
    // - Not loaded yet
    // - Not on client
    // - Still loading
    // - Currently saving/loading
    if (!hasLoadedRef.current || !isClient || loading || isSavingRef.current) {
      return;
    }

    // Determine cart key based on auth state
    const cartKey = isAuthenticated && user?._id 
      ? `cart_${user._id}` 
      : 'cart';

    // Save cart to localStorage
    try {
      console.log(`💾 Saving cart to localStorage (${cartKey}):`, cart);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error('❌ Error saving cart:', error);
    }
  }, [cart, isClient, isAuthenticated, user, loading]);

  // Handle auth state changes (login/logout) - switch cart based on auth state
  useEffect(() => {
    // Skip if not loaded or still loading auth
    if (!hasLoadedRef.current || authLoading) {
      return;
    }

    // Only handle if auth state actually changed (not initial load)
    if (prevAuthRef.current !== null && prevAuthRef.current !== isAuthenticated) {
      console.log('🔄 Auth state changed:', { from: prevAuthRef.current, to: isAuthenticated });
      isSavingRef.current = true;
      
      // Load cart from the new auth state's localStorage key
      try {
        const cartKey = isAuthenticated && user?._id 
          ? `cart_${user._id}` 
          : 'cart';
        
        const cartData = localStorage.getItem(cartKey);
        if (cartData) {
          try {
            const savedCart = JSON.parse(cartData);
            console.log(`🛒 Loading cart for new auth state (${cartKey}):`, savedCart);
            if (Array.isArray(savedCart) && savedCart.length > 0) {
              setCart(savedCart);
            } else {
              setCart([]);
            }
          } catch (parseError) {
            console.error('❌ Error parsing cart data:', parseError);
            setCart([]);
          }
        } else {
          // No cart found for new auth state, start empty
          setCart([]);
        }
      } catch (error) {
        console.error('❌ Error loading cart for new auth state:', error);
        setCart([]);
      }
      
      setTimeout(() => {
        isSavingRef.current = false;
      }, 200);
    }

    // Update previous auth state
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, authLoading, user]);

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    try {
      const existingItemIndex = cart.findIndex(
        item =>
          item.product._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
        toast.success('Cart updated!');
      } else {
        // New item, add to cart
        const newItem = {
          product,
          quantity,
          selectedSize,
          selectedColor,
        };
        setCart([...cart, newItem]);
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    try {
      const updatedCart = cart.filter(
        item =>
          !(
            item.product._id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      );
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  // Update item quantity
  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId, selectedSize, selectedColor);
        return;
      }

      const updatedCart = cart.map(item =>
        item.product._id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.product === 'object' ? (item.product.price || 0) : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get item count for a specific product
  const getItemQuantity = (productId, selectedSize = null, selectedColor = null) => {
    const item = cart.find(
      item =>
        item.product._id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

