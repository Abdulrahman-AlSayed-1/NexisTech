import { ShoppingBag, CreditCard, Truck } from 'lucide-react'

export default function OrderStepsSection() {
  const steps = [
    {
      id: 1,
      title: 'Browse Electronics',
      description: 'Explore our wide range of premium smartphones, laptops, and alot different of devices.',
      icon: ShoppingBag,
    },
    {
      id: 2,
      title: 'Secure Checkout',
      description: 'Select your favorite digital devices, add them to your cart, and pay safely.',
      icon: CreditCard,
    },
    {
      id: 3,
      title: 'Fast Delivery',
      description: 'Place your order and get it delivered directly to your doorstep anywhere.',
      icon: Truck,
    },
  ]

  return (
    <section className="w-full py-16 bg-bg-main/5 dark:bg-transparent transition-colors duration-500 border-t border-border-light/40 dark:border-primary-medium/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary dark:text-text-light tracking-tight">
            How It Works
          </h2>
          <div className="w-12 h-0.5 bg-accent-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div 
                key={step.id} 
                className="group flex flex-col items-center justify-center text-center space-y-4 relative"
              >
                <div className="w-14 h-12 rounded-xl bg-bg-card dark:bg-dark-bg-card text-primary-dark dark:text-accent-gold flex items-center justify-center transition-all duration-300 shadow-2xs border-2 border-border-light/60 dark:border-primary-medium/20 group-hover:bg-bg-input/20 group-hover:border-accent-gold/80 dark:group-hover:bg-primary-medium/20 dark:group-hover:text-accent-gold relative z-10">
                  <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-sm font-heading font-bold text-text-primary dark:text-text-light tracking-wide group-hover:text-accent-gold transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-slate-400 font-body max-w-xs mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < 2 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] mx-4 bg-border-light/40 dark:bg-primary-medium/20 pointer-events-none z-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}