import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import Button from '@/components/common/Button'

/**
 * CartEmptyState Component
 * Displays an engaging empty state with an immediate call to action to browse the store catalog.
 */
export default function CartEmptyState() {
  return (
    <div className="text-center py-16 px-4 max-w-lg mx-auto">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-accent-gold/10 dark:bg-accent-gold/20 flex items-center justify-center mb-6 ring-8 ring-accent-gold/5 dark:ring-accent-gold/10">
        <ShoppingBag className="w-10 h-10 text-accent-gold" />
      </div>

      <h2 className="text-2xl font-heading font-extrabold text-primary-dark dark:text-text-light mb-2 tracking-tight">
        Your Cart is Empty
      </h2>

      <p className="text-sm text-text-secondary dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
        Looks like you haven't added any tech products to your cart yet. Explore our curated catalog of smartphones, laptops, and accessories.
      </p>

      <Link to="/products" className="inline-block">
        <Button variant="gold" size="lg" className="shadow-md font-bold px-8 cursor-pointer">
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}
