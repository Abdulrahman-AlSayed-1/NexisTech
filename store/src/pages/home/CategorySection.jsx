import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Laptop, Smartphone, Headphones, Gamepad2, Watch, Tablet, Camera, Layers } from 'lucide-react'
import { fetchStoreProducts, selectCategoryCounts } from '@/store/slices/productsSlice'

export default function CategorySection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categoryCounts = useSelector(selectCategoryCounts)

  useEffect(() => {
    dispatch(fetchStoreProducts())
  }, [dispatch])

 const categories = [
    {
      id: 'laptops',
      name: 'Laptops & PCs',
      subcat: 'laptops', 
      icon: Laptop,
      count: categoryCounts?.['laptops'] || 0
    },
    {
      id: 'smartphones',
      name: 'Smartphones',
      subcat: 'smartphones',
      icon: Smartphone,
      count: categoryCounts?.['smartphones'] || 0
    },
    {
      id: 'audio',
      name: 'Audio & Headphones',
      subcat: 'audio',
      icon: Headphones,
      count: categoryCounts?.['audio'] || 0
    },
    {
      id: 'gaming',
      name: 'Gaming',
      subcat: 'gaming',
      icon: Gamepad2,
      count: categoryCounts?.['gaming'] || 0
    },
    {
      id: 'wearables',
      name: 'Smartwatches & Wearables',
      subcat: 'wearables',
      icon: Watch, 
      count: categoryCounts?.['wearables'] || 0
    },
    {
      id: 'tablets',
      name: 'Tablets & iPads',
      subcat: 'tablets',
      icon: Tablet,
      count: categoryCounts?.['tablets'] || 0
    },
    {
      id: 'cameras',
      name: 'Cameras',
      subcat: 'cameras',
      icon: Camera,
      count: categoryCounts?.['cameras'] || 0
    },
    {
      id: 'accessories',
      name: 'Accessories',
      subcat: 'accessories',
      icon: Layers,
      count: categoryCounts?.['accessories'] || 0
    }
  ]

  const subCategoryAction = (subcategory) => {
    navigate(`/products?subcategory=${subcategory}`)
  }

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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {categories.map((item) => {
                    const IconComponent = item.icon
                    return (
                    <div
                        key={item.id}
                        onClick={() => subCategoryAction(item.subcat)}
                        className="group bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/10 p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-accent-gold dark:hover:border-accent-gold active:scale-98 transition-all duration-300 cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-xl bg-bg-main dark:bg-primary-medium/20 text-primary-dark dark:text-accent-gold flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:bg-[#c0cfc9]/50 dark:group-hover:bg-[#1a302b] dark:group-hover:text-accent-gold">
                        <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        <h3 className="mt-4 text-sm font-heading font-bold text-text-primary dark:text-text-light tracking-wide group-hover:text-accent-gold transition-colors">
                        {item.name}
                        </h3>

                        <p className="mt-1 text-[11px] font-body text-text-secondary dark:text-slate-400 font-medium">
                        {item.count} {item.count === 1 ? 'product' : 'products'}
                        </p>
                    </div>
                    )
                })}
                </div>
        </div>
     </section>
  )
}