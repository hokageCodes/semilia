// app/(public)/layout.js
'use client';

import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <ToastContainer position="bottom-right" autoClose={3000} />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
