import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import DevLocalStorageCleanup from '@/components/DevLocalStorageCleanup';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Semilia - Fashion Ecommerce Store',
  description: 'Your favorite fashion destination',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden max-w-full`}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <DevLocalStorageCleanup />
              <div className="min-h-screen overflow-x-hidden">
                {children}
              </div>
            </CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
