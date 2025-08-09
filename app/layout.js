// app/layout.js - Updated with CartProvider
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export const metadata = {
  title: "Semilia – By Tailor Girl Fashion",
  description: "Shop your ready to wear",
  keywords: [
    "Semilia",
    "Semilia by TGF",
  ],
  metadataBase: new URL("https://semilia-by-tgf.vercel.app/"),
  openGraph: {
    title: "Semilia – Powered by TGF",
    description: "Discover, shop, and share your favorite links and products with Semilia. Your digital storefront by TGF.",
    url: "https://semilia-by-tgf.vercel.app/",
    type: "website",
    siteName: "Semilia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Semilia – Powered by TGF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Semilia – Powered by TGF",
    description: "Discover & Shop On Semilia",
    site: "@tgfplatform",
    creator: "@tgfplatform",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



