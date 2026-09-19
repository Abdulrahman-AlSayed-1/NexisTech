import { ShieldCheck, Lock, Truck, Star } from 'lucide-react'
import Logo from '@/components/common/Logo'

/**
 * AuthCard Component
 * Horizontal 2-column card layout for customer authentication.
 * Left Column: Atmospheric brand showcase with warranty highlights and trust metrics.
 * Right Column: Interactive authentication form surface with light/dark theme parity.
 *
 * @param {Object} props
 * @param {string} props.title - Form header title
 * @param {string} [props.subtitle] - Form explanatory subtitle
 * @param {string} [props.badgeText='Nexis Tech Portal'] - Form header badge
 * @param {string} [props.showcaseBadge='Official Storefront'] - Showcase panel badge
 * @param {string} [props.showcaseTitle] - Showcase headline
 * @param {string} [props.showcaseSubtitle] - Showcase description
 * @param {React.ReactNode} props.children - Form body content
 * @param {React.ReactNode} [props.footer] - Footer navigation link
 */
export default function AuthCard({
  title,
  subtitle,
  badgeText = 'Nexis Tech Portal',
  showcaseTitle = 'Engineered for True Performance.',
  showcaseSubtitle = 'Discover authentic flagship hardware, verified components, and pro gaming gear with official warranty.',
  children,
  footer,
}) {
  return (
    <div className="w-full rounded-3xl border border-border-light/90 dark:border-primary-medium/40 bg-bg-card dark:bg-dark-bg-card shadow-2xl shadow-primary-dark/5 dark:shadow-black/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300">
      {/* ── Left Column: Brand Showcase Panel (Desktop) ── */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary-dark via-primary-medium to-dark-bg-main text-white p-8 xl:p-10 flex-col justify-between relative overflow-hidden border-r border-white/10">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-medium/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <Logo variant="light" size="md" />
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="text-2xl xl:text-3xl font-heading font-extrabold leading-snug tracking-tight text-white">
              {showcaseTitle}
            </h2>
            <p className="text-xs xl:text-sm text-emerald-100/80 leading-relaxed font-body">
              {showcaseSubtitle}
            </p>
          </div>
        </div>

        {/* Middle: Key Differentiator Bullets */}
        <div className="relative z-10 space-y-4 my-8">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-accent-gold text-primary-dark shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold font-heading text-white">
                Official 2-Year Warranty
              </p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                Authorized distributor warranty on genuine flagship hardware.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold font-heading text-white">
                Fast Doorstep Delivery
              </p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                Rapid express shipping across all Egyptian governorates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="p-2 rounded-xl bg-sky-400 text-primary-dark shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold font-heading text-white">
                Buyer Protection & Inspection
              </p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                Inspect your items upon arrival. Pay safely on delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Customer Trust Pill */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/70">
          <div className="flex items-center gap-1 text-accent-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-accent-gold" />
            ))}
          </div>
          <span className="font-medium text-white/90">
            Authorized Egyptian Flagship Retailer
          </span>
        </div>
      </div>

      {/* ── Right Column: Interactive Form Surface ── */}
      <div className="lg:col-span-7 p-5 sm:p-10 flex flex-col justify-between space-y-6">
        {/* Form Header */}
        <div className="space-y-2.5">
          {/* Mobile Top Row: Logo on Left, Badge on Right */}
          <div className="flex lg:hidden items-center justify-between gap-3 pb-1">
            <div className="shrink-0">
              <Logo variant="auto" size="sm" />
            </div>
            {badgeText && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 whitespace-nowrap shrink-0">
                {badgeText}
              </span>
            )}
          </div>

          {/* Title Row: On Desktop, Badge is Inline with Title */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-primary-dark dark:text-text-light tracking-tight">
              {title}
            </h1>
            {/* Desktop Badge: Inline with Title */}
            {badgeText && (
              <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 whitespace-nowrap shrink-0">
                {badgeText}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Body */}
        <div className="py-1">
          {children}
        </div>

        {/* Footer Link & Mobile Trust Badges */}
        <div className="space-y-4 pt-2 border-t border-border-light/80 dark:border-primary-medium/30">
          {/* Mobile Trust Strip (Shown only on small screens where left panel is hidden) */}
          <div className="lg:hidden grid grid-cols-3 gap-2 text-[10px] text-text-secondary dark:text-slate-400 text-center pb-2 border-b border-border-light/60 dark:border-primary-medium/20">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent-gold shrink-0" />
              <span>Genuine</span>
            </div>
            <div className="flex items-center justify-center gap-1 border-x border-border-light/60 dark:border-primary-medium/20 px-1">
              <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>SSL 256-Bit</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Truck className="w-3 h-3 text-accent-gold shrink-0" />
              <span>Fast Delivery</span>
            </div>
          </div>

          {footer && (
            <div className="text-center text-xs sm:text-sm text-text-secondary dark:text-slate-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
