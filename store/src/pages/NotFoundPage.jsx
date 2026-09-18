import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

/**
 * 404 Not Found Page
 */
export default function NotFoundPage() {
  return (
    <div className="py-20 text-center space-y-4">
      <h1 className="text-4xl font-extrabold font-heading text-primary-dark dark:text-accent-gold">
        404
      </h1>
      <h2 className="text-lg font-bold font-heading text-text-primary dark:text-text-light">
        Page Not Found
      </h2>
      <p className="text-xs text-text-secondary dark:text-slate-400 max-w-sm mx-auto">
        The requested URL does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="sm">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
