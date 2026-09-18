import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, ArrowRight } from 'lucide-react'
import Logo from '@/components/common/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-dark text-white pt-12 pb-8 border-t border-primary-medium/40 mt-auto">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-primary-medium/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-medium/40 text-accent-gold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-300 mt-0.5">On all hardware orders over 5,000 EGP</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-medium/40 text-accent-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">2-Year Official Warranty</h4>
              <p className="text-xs text-slate-300 mt-0.5">100% genuine guaranteed authentic hardware</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-medium/40 text-accent-gold shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">14-Day Easy Returns</h4>
              <p className="text-xs text-slate-300 mt-0.5">Hassle-free replacement or full refund</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-medium/40 text-accent-gold shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Dedicated Tech Support</h4>
              <p className="text-xs text-slate-300 mt-0.5">Expert hardware specialists available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Nexis Tech is the premier destination for computing enthusiasts, gamers, and professionals seeking premium laptops, workstations, peripherals, and high-performance hardware.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-accent-gold uppercase tracking-wider block mb-2">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-primary-medium/40 border border-primary-medium/30">
                  Stripe
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-primary-medium/40 border border-primary-medium/30">
                  Cash on Delivery
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-primary-medium/40 border border-primary-medium/30">
                  Credit Cards
                </span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-accent-gold mb-3">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-xs text-slate-300 font-body">
              <li>
                <Link to="/products?subcategory=laptops" className="hover:text-white transition-colors">
                  Laptops &amp; PCs
                </Link>
              </li>
              <li>
                <Link to="/products?subcategory=smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?subcategory=audio" className="hover:text-white transition-colors">
                  Audio &amp; Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?subcategory=gaming" className="hover:text-white transition-colors">
                  Gaming Rigs
                </Link>
              </li>
              <li>
                <Link to="/products?subcategory=accessories" className="hover:text-white transition-colors">
                  Keyboards &amp; Peripherals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-accent-gold mb-3">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-slate-300 font-body">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Account Details
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Warranty Registration</span>
              </li>
              <li>
                <span className="text-slate-400">Return Policy</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-accent-gold mb-3">
              Stay Updated
            </h5>
            <p className="text-xs text-slate-300 mb-3">
              Subscribe for exclusive early-bird tech deals, new GPU releases, and discount vouchers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-9 py-2 bg-primary-medium/40 border border-primary-medium/50 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent-gold"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 p-1 rounded-lg bg-accent-gold text-primary-dark hover:bg-accent-gold-hover transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                By subscribing, you agree to our Privacy Terms. No spam ever.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-primary-medium/20 text-center sm:flex sm:justify-between sm:text-left text-xs text-slate-400">
        <p>&copy; {currentYear} Nexis Tech. All rights reserved. Premium Electronics &amp; Hardware Store.</p>
        <p className="mt-2 sm:mt-0">Crafted with precision for high-performance computing.</p>
      </div>
    </footer>
  )
}
