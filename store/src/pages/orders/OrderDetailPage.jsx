import { useParams } from 'react-router-dom'

/**
 * Order Detail Page Placeholder
 * Route: /profile/orders/:id (User)
 * To be implemented by feature team.
 */
export default function OrderDetailPage() {
  const { id } = useParams()

  return (
    <div className="py-16 text-center text-text-secondary dark:text-slate-400">
      <h1 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light mb-2">
        Order Detail Page
      </h1>
      <p className="text-xs">Route: /profile/orders/{id} — To be implemented by team</p>
    </div>
  )
}
