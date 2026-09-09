import React, { useState, useEffect } from 'react';
import { updateOrderStatus } from '../../Api/orders'; 

export default function EditOrder({ order, isOpen, onClose, onOrderUpdated }) {
  //لتخزين الfields الحتتعدل و حاله زر التعديل
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


useEffect(() => {
  if (order) {  //اذا تم الضغط على order معين 
     const currentStatus = order.status || 'Confirmed'; 
     const capitalizedStatus = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase();
     setStatus(capitalizedStatus); 
    setAdminNote(order.adminNote || ''); 
  }
}, [order]); // يتم التشغيل باستنادا على تغير orderال

  // دالة الحفظ وإرسال البيانات لل API
  const handleSaveChanges = async () => {
    if (!order?._id) return; 
    try {
      setIsSubmitting(true);
      await updateOrderStatus(order._id, { 
        status: status.toLowerCase(),
        adminNote : adminNote 
      });
      onOrderUpdated(); 
      onClose();
      alert("Updated successfully");
    } catch (error) { 
      console.error("Failed to update order status:", error);
      alert("Failed to update the order please try again");
    } finally { 
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/*(Sliding edit section) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] z-50 bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-main)] border-l border-[var(--color-border-light)] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* (Header) ثابت فيهو رقم الطلبيه و زر الاغلاق */}
        <div className="p-5 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">ORDER DETAIL</span>
            <h2 className="text-base font-mono font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">{order._id}</h2>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition cursor-pointer">
            <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/*  تفاصيل الطلبيه (Content) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] no-scrollbar">
          
          <div className="flex gap-2">
            <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full text-xs font-bold">• {order.status}</span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">{order.paymentStatus}</span>
            <span className="ml-auto text-xs text-[var(--color-text-secondary)] font-medium">{order.paymentMethod}</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">INFO</h3>
            <div className="border border-[var(--color-border-light)] rounded-xl divide-y divide-[var(--color-border-light)] bg-[var(--color-bg-main)]/10">
              <div className="flex justify-between p-3"><span className="text-[var(--color-text-secondary)]">Placed</span><span className="font-semibold">{order.createdAt || '___'}</span></div>
              <div className="flex justify-between p-3"><span className="text-[var(--color-text-secondary)]">Customer</span><span className="font-semibold">{order.shippingAddress.fullName || '___'}</span></div>
              <div className="flex justify-between p-3"><span className="text-[var(--color-text-secondary)]">Email</span><span className="font-semibold">{order.user?.email || '___'}</span></div>
              <div className="flex justify-between p-3"><span className="text-[var(--color-text-secondary)]">Ship to</span><span className="font-semibold">{order.shippingAddress.address || '___'}</span></div>
            </div>
          </div>

           {/* (ITEMS) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">ITEMS</h3>
            <div className="space-y-3">
             { order.items.length > 0 ? (
                order.items.map((item) => (
                  <div 
                    key={item.product} 
                    className="flex items-center gap-3 p-2 border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-main)]/10"
                  >
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-bg-input)] overflow-hidden shrink-0 border border-[var(--color-border-light)]">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--color-text-secondary)] bg-gray-200 dark:bg-gray-700">
                          No Image Found
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate text-xs text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                        {item.quantity || 1} - {(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} EGP
                      </p>
                    </div>

                    <span className="font-bold text-xs text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] shrink-0">
                      {((item.price || 0) * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })} EGP
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-text-secondary)] py-2 text-center">
                  No items found in this order.
                </p>
              )}
            </div>
          </div>
          {/* تفاصيل الفاتورة   */}
          <div className="space-y-2 border-t border-[var(--color-border-light)] pt-4">
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)]"><span>Subtotal</span><span className="font-semibold">{order.subtotal?.toLocaleString()} EGP</span></div>
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)]"><span>Shipping</span><span className="font-semibold">{order.shippingFee?.toLocaleString()} EGP</span></div>
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)]"><span>Tax (14%)</span><span className="font-semibold">{order.tax?.toLocaleString()} EGP</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-[var(--color-border-light)] pt-2 text-[var(--color-accent-gold-hover)]"><span>Total</span><span>{order.totalPrice?.toLocaleString()} EGP</span></div>
          </div>

          {/* (UPDATE STATUS) */}
          <div className="space-y-3 border-t border-[var(--color-border-light)] pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">UPDATE STATUS</h3>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[var(--color-text-secondary)]">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg-main)] border border-[var(--color-border-medium)] rounded-xl px-3 py-2.5 font-semibold text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)]"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[var(--color-text-secondary)]">Admin note (optional)</label>
              <textarea 
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Admin note (optional)..."
                rows="3"
                className="w-full text-xs bg-[var(--color-bg-main)] border border-[var(--color-border-medium)] rounded-xl px-3 py-2.5 text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] placeholder-[var(--color-text-secondary)]/40 resize-none"
              />
            </div>
          </div>

        </div>

        {/* زر حفظ التعديلات السفلي (Footer Button) */}
        <div className="p-4 border-t border-[var(--color-border-light)] bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-main)]">
          <button 
            onClick={handleSaveChanges}
            disabled={isSubmitting}
            className="w-full bg-[#111827] dark:bg-[var(--color-primary-dark)] text-white hover:bg-[var(--color-accent-gold-hover)] py-3 rounded-xl font-semibold text-xs tracking-wider transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
      </aside>
    </>
  );
}
