'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext({
  cart: { items: [], totalPrice: 0 },
  cartCount: 0,
  loading: false,
  loadingItems: {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  syncCart: () => {},
});

const GUEST_CART_KEY = 'semilia_guest_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState({}); // per-item loading

  // Calculate cart count
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  // Get guest cart from localStorage
  const getGuestCart = () => {
    if (typeof window === 'undefined') return { items: [], totalPrice: 0 };

    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : { items: [], totalPrice: 0 };
    } catch {
      return { items: [], totalPrice: 0 };
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Fetch cart from backend (only for authenticated users)
  const fetchCart = async () => {
    if (!user) {
      // For guests, load from localStorage
      const guestCart = getGuestCart();
      setCart(guestCart);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/cart');

      const fetchedCart = {
        items: response.data.data.items || [],
        totalPrice: response.data.data.totalPrice || 0,
      };

      setCart(fetchedCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Sync guest cart with user cart when user logs in
  const syncCart = async () => {
    if (!user) return;

    const guestCart = getGuestCart();
    if (guestCart.items.length === 0) return;

    setLoading(true);
    try {
      for (const item of guestCart.items) {
        await axios.post('/cart', {
          productId: item.product._id || item.product,
          quantity: item.quantity,
        });
      }

      localStorage.removeItem(GUEST_CART_KEY);

      await fetchCart();

      toast.success('Cart synced successfully!');
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to sync cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      if (user) {
        await axios.post('/cart', {
          productId: product._id,
          quantity,
        });

        await fetchCart();
      } else {
        const guestCart = getGuestCart();
        const existingItemIndex = guestCart.items.findIndex(
          (item) => (item.product._id || item.product) === product._id
        );

        if (existingItemIndex > -1) {
          guestCart.items[existingItemIndex].quantity += quantity;
        } else {
          guestCart.items.push({ product, quantity });
        }

        guestCart.totalPrice = calculateTotal(guestCart.items);
        saveGuestCart(guestCart);
        setCart(guestCart);
      }

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      if (user) {
        await axios.delete(`/cart/${productId}`);

        await fetchCart();
      } else {
        const guestCart = getGuestCart();
        guestCart.items = guestCart.items.filter(
          (item) => (item.product._id || item.product) !== productId
        );
        guestCart.totalPrice = calculateTotal(guestCart.items);
        saveGuestCart(guestCart);
        setCart(guestCart);
      }

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity with per-item loading
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (!user) {
      // Guest cart update localStorage directly
      const guestCart = getGuestCart();
      const itemIndex = guestCart.items.findIndex(
        (item) => (item.product._id || item.product) === productId
      );

      if (itemIndex > -1) {
        guestCart.items[itemIndex].quantity = newQuantity;
        guestCart.totalPrice = calculateTotal(guestCart.items);
        saveGuestCart(guestCart);
        setCart(guestCart);
      }
      return;
    }

    // For logged in user — Optimistic UI update with per-item loading:
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));

    const updatedCart = { ...cart };
    const itemIndex = updatedCart.items.findIndex(
      (item) => (item.product._id || item.product) === productId
    );
    if (itemIndex > -1) {
      updatedCart.items[itemIndex].quantity = newQuantity;
      updatedCart.totalPrice = calculateTotal(updatedCart.items);
      setCart(updatedCart);
    }

    try {
      await axios.patch(`/cart/${productId}`, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      await fetchCart(); // revert on fail
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      if (user) {
        await axios.delete('/cart/clear');
        setCart({ items: [], totalPrice: 0 });
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
        setCart({ items: [], totalPrice: 0 });
      }

      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCart({ items: [], totalPrice: 0 });
      if (!user) {
        localStorage.removeItem(GUEST_CART_KEY);
      }
      toast.error('Failed to clear cart completely');
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount and when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchCart();
    }
  }, [user]);

  // Sync guest cart when user logs in
  useEffect(() => {
    if (user) {
      const guestCart = getGuestCart();
      if (guestCart.items.length > 0) {
        syncCart();
      }
    }
  }, [user]);

  const value = {
    cart,
    cartCount,
    loading,
    loadingItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
