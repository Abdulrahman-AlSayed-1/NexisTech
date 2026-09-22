import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Rating from '@/components/common/Rating'

/**
 * ProductReviewModal Component
 * Accessible modal dialog for submitting customer ratings and reviews.
 */
export default function ProductReviewModal({
  isOpen,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Customer Review"
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading mb-2">
            Your Rating Score
          </label>
          <div className="flex items-center gap-3">
            <Rating
              value={rating}
              size="lg"
              onChange={(newRating) => setRating(newRating)}
            />
            <span className="text-xs font-bold text-accent-gold font-heading">
              {rating} out of 5 Stars
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="review-comment-input"
            className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading mb-2"
          >
            Your Feedback & Experience
          </label>
          <textarea
            id="review-comment-input"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with build quality, battery life, performance..."
            required
            className="w-full rounded-2xl bg-bg-main dark:bg-dark-bg-main border border-border-medium dark:border-primary-medium/30 p-3.5 text-xs text-text-primary dark:text-text-light placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-gold transition-colors"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border-light dark:border-primary-medium/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  )
}
