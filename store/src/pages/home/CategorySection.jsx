import { Laptop, Smartphone, Headphones, Gamepad2, Watch, Tablet, Camera, Layers } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCategoryCounts } from '@/store/slices/productsSlice'

// Static category definitions — counts come from already-loaded Redux products state.
// CategorySection does NOT fetch; the page (or a parent) owns product loading.
const CATEGORIES = [
  { id: 'laptops',     name: 'Laptops & PCs',             icon: Laptop },
  { id: 'smartphones', name: 'Smartphones',               icon: Smartphone },
  { id: 'audio',       name: 'Audio & Headphones',        icon: Headphones },
  { id: 'gaming',      name: 'Gaming',                    icon: Gamepad2 },
  { id: 'wearables',   name: 'Smartwatches & Wearables',  icon: Watch },
  { id: 'tablets',     name: 'Tablets & iPads',           icon: Tablet },
  { id: 'cameras',     name: 'Cameras',                   icon: Camera },
  { id: 'accessories', name: 'Accessories',               icon: Layers },
]

export default function CategorySection() {
  const navigate = useNavigate()
  const categoryCounts = useSelector(selectCategoryCounts)

  return (
    <section id="catSection" className="w-full py-16 bg-bg-main/5 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary dark:text-text-light">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 max-w-md mx-auto font-body">
            Browse our official range of verified electronics and premium tech devices
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {CATEGORIES.map((item) => {
            const Icon = item.icon
            const count = categoryCounts?.[item.id] || 0
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/products?subcategory=${item.id}`)}
                className="group bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/10 p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-accent-gold dark:hover:border-accent-gold active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-main dark:bg-primary-medium/20 text-primary-dark dark:text-accent-gold flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:bg-bg-input/50 dark:group-hover:bg-primary-medium/30">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="mt-4 text-sm font-heading font-bold text-text-primary dark:text-text-light tracking-wide group-hover:text-accent-gold transition-colors">
                  {item.name}
                </h3>

                <p className="mt-1 text-[11px] font-body text-text-secondary dark:text-slate-400 font-medium">
                  {count} {count === 1 ? 'product' : 'products'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}