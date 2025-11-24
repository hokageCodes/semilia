'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useLocalStorage, useIsClient } from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isClient = useIsClient();
  const router = useRouter();

  // Use safe localStorage hooks
  // Token is stored as a plain string, not JSON
  const [storedToken, setStoredToken] = useLocalStorage('token', '');
  const [storedUser, setStoredUser] = useLocalStorage('user', null);

  // Load user from localStorage on mount - only run once
  useEffect(() => {
    if (!isClient) {
      setLoading(false);
      return;
    }

    // Read directly from localStorage to get the actual values
    const readFromStorage = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        const userData = userStr ? JSON.parse(userStr) : null;
        
        console.log('🔍 Loading user from localStorage:', { 
          hasToken: !!token, 
          hasSavedUser: !!userData,
          savedUser: userData
        });

        if (token && token.trim() && userData) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ User loaded successfully:', userData);
        } else {
          console.log('❌ No user found in localStorage');
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    readFromStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]); // Only depend on isClient

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user, token, requiresVerification } = response.data;
        
        // Save to localStorage using safe hooks
        setStoredToken(token);
        setStoredUser(user);
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        // If email verification is required, redirect to verify page
        if (requiresVerification) {
          toast.success('Account created! Please verify your email.');
          router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
        } else {
          toast.success('Account created successfully!');
          // Redirect based on role
          if (user.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login function
  const login = async (credentials, rememberMe = false) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        console.log('🔐 Login successful:', { user, hasToken: !!token });
        
        // Save to localStorage using safe hooks
        setStoredToken(token);
        setStoredUser(user);
        
        console.log('💾 Saved to localStorage using safe hooks');
        
        if (rememberMe && isClient) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Update state
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('✅ Auth state updated:', { user, isAuthenticated: true });
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Force a small delay before redirect to ensure state updates
        setTimeout(() => {
          // Redirect based on role
          if (user.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }, 100);
        
        return { success: true };
      }
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.message || 'Login failed';
      
      // If email verification is required, redirect to verification page
      if (errorData?.requiresVerification) {
        toast.error('Please verify your email first');
        router.push(`/verify-email?email=${encodeURIComponent(errorData.email)}`);
        return { success: false, requiresVerification: true };
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage using safe hooks
    setStoredToken('');
    setStoredUser(null);
    
    // Clear other localStorage items if on client
    if (isClient) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('cart'); // Clear cart on logout
    }
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Update user data
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    setStoredUser(updatedUser);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

