import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux'
import Button from '@/components/common/Button'
import CategorySection from '@/pages/home/CategorySection'
import FeaturedProductsSection from '@/pages/home/FeaturedProductsSection'
import OrderStepsSection from '@/pages/home/OrderStepsSection'
import SubscribeSection from '@/pages/home/SubscribeSection'
import { fetchStoreProducts } from '@/store/slices/productsSlice'

export default function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Load products so CategorySection can compute category counts
  useEffect(() => {
    dispatch(fetchStoreProducts())
  }, [dispatch])

  return (
   <div className="w-full">
      <section className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 -mt-6 sm:-mt-8 bg-[radial-gradient(circle_at_center,var(--color-primary-medium)_0%,var(--color-primary-dark)_100%)] dark:bg-[radial-gradient(circle_at_center,var(--color-primary-medium)/30_0%,var(--color-primary-dark)_100%)] text-text-light py-16 sm:py-24 px-4 sm:px-16 lg:px-32 overflow-hidden transition-colors duration-500 shadow-inner border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[45px_45px] mask-[radial-gradient(circle_at_center,black_40%,transparent_85%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_40%,transparent_85%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-gold)/5_0%,transparent_65%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col items-start text-left space-y-7 relative z-10">
          
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-accent-gold backdrop-blur-md shadow-2xs hover:border-white/20 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-accent-gold animate-spin [animation-duration:6s]" />
            <span>Premium Shopping Experience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] max-w-4xl">
            Upgrade your digital world, <br />
            <span className="text-accent-gold dark:text-text-gold drop-shadow-[0_2px_10px_rgba(221,161,54,0.12)]">engineered for performance</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 dark:text-slate-400 font-body max-w-2xl leading-relaxed">
            Discover next-gen smartphones, high-tier laptops, and premium digital devices. Power your daily workflow and entertainment with authentic gear tailored for tech enthusiasts and professionals.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              variant="gold"
              size="md"
              onClick={() => navigate('/products')}
            >
              Explore Devices
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const catSection = document.getElementById('catSection')
                if (catSection) catSection.scrollIntoView({ behavior: 'smooth' })
              }}
              className="border-white hover:bg-white/5 hover:border-white/50"
            >
              Browse Categories
            </Button>
          </div>
        </div>
      </section>

      <CategorySection />

      <FeaturedProductsSection />

      <OrderStepsSection />

      <SubscribeSection />

    </div>
  )
}