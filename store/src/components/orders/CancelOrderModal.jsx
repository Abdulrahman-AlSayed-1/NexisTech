import React from 'react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { AlertCircle } from 'lucide-react'

/**
 * CancelOrderModal Component
 * Accessible dialog to confirm cancellation of an active order.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   isCancelling: boolean
 * }} props
 */
export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isCancelling) onClose()
      }}
      title="Cancel Order Confirmation"
      closeOnBackdrop={!isCancelling}
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isCancelling}
            onClick={onClose}
          >
            Keep Order
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={isCancelling}
            onClick={onConfirm}
          >
            Yes, Cancel Order
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary dark:text-text-light font-heading">
            Are you sure you want to cancel this order?
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            This action will stop the fulfillment process and mark the order as cancelled. This cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  )
}
