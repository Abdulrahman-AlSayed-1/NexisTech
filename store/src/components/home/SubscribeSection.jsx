import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { toast } from 'react-toastify'
 
export default function SubscribeSection() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim() !== '') {
      toast(() => (
      <div className="flex items-center justify-between w-full h-4 gap-3 font-heading">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs font-bold text-white tracking-wide shrink-0">Thank you for subscribing</span>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true, 
      closeButton: false,
      pauseOnHover: false,
      className: "!bg-dark-bg-card !min-h-0 !py-2 !px-4.5 !rounded-full !shadow-md !border !border-white/5 !w-fit !mx-auto",
    }
  );
      setEmail('') 
    }
  }

  return (
    <section className="w-full py-16 bg-bg-main/5 dark:bg-transparent transition-colors duration-500 border-t border-border-light/40 dark:border-primary-medium/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="group relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden bg-radial from-primary-medium to-primary-dark dark:from-dark-bg-card dark:to-dark-bg-main text-text-light border border-white/5 dark:border-primary-medium/20 shadow-md">   
          <div className="absolute inset-0 bg-radial from-accent-gold/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center space-y-6">
            
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold dark:group-hover:text-text-light shadow-2xs backdrop-blur-md">
              <Mail className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                Stay Updated
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 font-body max-w-md mx-auto leading-relaxed">
                Subscribe to our tech newsletter and get exclusive deals, live inventory drops, and next-gen device arrivals first.
              </p>
            </div>

            <form 
              onSubmit={handleSubscribe}
              className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3 pt-2"
            >
              <div className="relative w-full group">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white/5 border border-bg-input/50 dark:border-bg-input/30 rounded-xl text-xs font-body text-white placeholder-bg-input/60 outline-none backdrop-blur-xs transition-all duration-300 focus:border-accent-gold/50 focus:bg-bg-input/10"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-gold transition-colors" />
              </div>

              <button
                type="submit"
                className="w-full h-12 sm:w-auto px-7 py-4 bg-accent-gold hover:bg-accent-gold-hover border border-accent-gold text-primary-dark hover:text-text-light text-xs font-heading font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg active:scale-97 transition-all duration-300 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}