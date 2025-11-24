import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Sale', href: '/sale' },
      { name: 'Categories', href: '/categories' }
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Brand Logo */}
          <div>
            <Link href="/" className="block">
              <Image
                src="/assets/semilia-logo-bg.jpg"
                alt="SEMILIA"
                width={150}
                height={150}
                className="w-auto h-36 object-contain"
                unoptimized
              />
            </Link>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h4 className="font-semibold text-black mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-yellow transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="font-semibold text-black mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-yellow transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="font-semibold text-black mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-yellow transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 SEMILIA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

