import { useParams } from 'react-router-dom'

/**
 * Product Detail Page Placeholder
 * Route: /products/:id
 * To be implemented by feature team.
 */
export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div className="py-16 text-center text-text-secondary dark:text-slate-400">
      <h1 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light mb-2">
        Product Detail Page
      </h1>
      <p className="text-xs">Route: /products/{id} — To be implemented by team</p>
    </div>
  )
}
