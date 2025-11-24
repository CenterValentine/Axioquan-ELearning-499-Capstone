
// File: /src/components/layout/footer.tsx
'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">AxioQuan</h3>
            <p className="text-sm opacity-80">Empower your learning journey with world-class courses.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/courses" className="hover:opacity-100 transition">Courses</Link></li>
              <li><Link href="/categories" className="hover:opacity-100 transition">Categories</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Certificates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">About</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Blog</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Careers</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#" className="hover:opacity-100 transition">Twitter</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">LinkedIn</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Facebook</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} AxioQuan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}