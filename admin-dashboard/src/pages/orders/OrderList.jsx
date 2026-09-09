import React, { useState, useEffect } from 'react';
import { getAdminOrders } from '../../Api/orders';
import EditOrder from './EditOrder';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [textboxFilter, settextboxFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // page transfer and counting states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // edit order page states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [EditOrderOpen, setEditOrderOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminOrders({
        limit: 1000
      });

      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      setError("Failed to fetch orders. Please try again later.....");
    } finally {
      setLoading(false);
    }
  };

  // تحميل الطلبات عند فتح الصفحه اول مره
  useEffect(() => {
    fetchOrders();
  }, []);

  // فتح الصفحه من الاول عند تغير الفلاتر
  useEffect(() => {
    setCurrentPage(1);
  }, [textboxFilter, statusFilter, paymentFilter, methodFilter]);

  // داله لتحديد لون الحاله حسب حالة الطلب
  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)]';
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'processing': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'shipped': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'returned': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      default: return 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)]';
    }
  };

  // داله لتصفية الطلبات حسب الفلاتر
  const filteredOrders = orders.filter(order => {
    if (!order) return false;

    const searchVal = textboxFilter.trim().toLowerCase();
    const orderId = order._id ? order._id.toLowerCase() : '';
    const customerName = order.shippingAddress?.fullName ? order.shippingAddress.fullName.toLowerCase() : '';

    let username = '';
    if (order.user) {
      if (typeof order.user === 'object' && order.user.username) {
        username = order.user.username.toLowerCase();
      } else if (typeof order.user === 'string') {
        username = order.user.toLowerCase();
      }
    }

    const matchesSearch = searchVal === '' ||
      orderId.includes(searchVal) ||
      customerName.includes(searchVal) ||
      username.includes(searchVal);

    const matchesStatus = statusFilter === 'all' || (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || (order.paymentStatus && order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase());
    const matchesMethod = methodFilter === 'all' || (order.paymentMethod && order.paymentMethod.toLowerCase() === methodFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
  });

  // حساب عدد الطلبات بعد الفلتره وحساب عدد الصفحات
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // الحساب رقم اول و اخر طلب في الصفحه الحاليه
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // عرض الطلبات في الصفحه الحاليه بعد الفلتره
  const currentOrdersSlice = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // داله انميشن لتغيير الصفحه عند الضغط على الارقام الصفحات
  const handlePageChange = (pageNumber) => {
    if (pageNumber === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsTransitioning(false);
    }, 180);
  };

  // داله لعرض المحتوى في الجدول حسب الشروط 
  const renderListContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="px-5 py-12 text-center text-sm text-[var(--color-text-secondary)]">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent-gold-hover)] border-t-transparent" />
              <span>Loading orders.....</span>
            </div>
          </td>
        </tr>
      );
    } else if (error) {
      return (
        <tr>
          <td colSpan="6" className="px-5 py-10 text-center text-sm text-[var(--color-text-gold)]">
            <div>
              <span>{error}</span>
              <button onClick={fetchOrders} className="mt-2 text-xs text-[var(--color-text-gold)] underline cursor-pointer">
                🔄 Try Again
              </button>
            </div>
          </td>
        </tr>
      );
    } else if (currentOrdersSlice.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            No orders found......
          </td>
        </tr>
      );
    } else {
      return currentOrdersSlice.map((order) => (
        <tr key={order._id}
          onClick={() => {
            setSelectedOrder(order);
            setEditOrderOpen(true);
          }}
          className="hover:bg-[var(--color-bg-main)]/30 transition-colors cursor-pointer"
        >
          <td className="px-5 py-4 text-sm font-mono font-bold text-[var(--color-accent-gold-hover)]">{'#' + order._id.substring(0, 8).toUpperCase() || '___'}</td>
          <td className="px-5 py-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                {order.user?.username ? order.user.username[0] : (order.shippingAddress?.fullName ? order.shippingAddress.fullName[0] : 'U')}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  {order.user?.username || order.shippingAddress?.fullName || 'Unknown Customer'}
                </span>
                <span className="text-xs text-slate-400">
                  {order.user?.email || 'No email provided'}
                </span>
              </div>
            </div>
          </td>

          <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }) : '___'}
          </td>

          <td className="px-5 py-4">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusBadgeClass(order.status)}`}>
              {order.status}
            </span>
          </td>

          <td className="px-5 py-4">
            <div className="flex flex-col items-start gap-1">
              <span className="inline-block bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {order.paymentStatus}
              </span>
              <span className="text-[11px] text-slate-400 font-medium capitalize pl-0.5">
                {order.paymentMethod}
              </span>
            </div>
          </td>

          <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]">
            {order.totalPrice ? order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            <span className="text-xs text-[var(--color-text-secondary)]"> EGP</span>
          </td>

        </tr>
      ))
    }
  };
  return (
    <>
      <div className="w-full space-y-6 text-[var(--color-text-primary)] transition-colors duration-200">
        {/* Top Titles */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-secondary)] block mb-1">
              Admin - Management
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
              Orders
            </h1>
          </div>

          {/* Counter Card Display */}
          <div className="bg-[var(--color-bg-card)] px-5 py-3 border border-[var(--color-border-light)] rounded-xl shadow-sm text-right flex items-baseline gap-1.5 transition-colors duration-200">
            <span className="text-2xl font-black text-[var(--color-text-primary)] dark:text-[var(--color-text-gold)]">{totalItems}</span>
            <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">total orders</span>
          </div>
        </div>

        {/* Toolbar Filters Container */}
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200 dark:bg-[var(--color-dark-bg-main)]">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search ID, customer name..."
              value={textboxFilter}
              onChange={(e) => settextboxFilter(e.target.value)}
              className="w-full text-xs px-4 py-2 border border-[var(--color-border-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] bg-[var(--color-bg-main)] text-[var(--color-text-primary)] transition-colors placeholder-[var(--color-text-secondary)]/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[var(--color-bg-main)] border border-[var(--border-medium)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] transition-colors"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs bg-[var(--color-bg-main)] border border-[var(--color-border-medium)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] transition-colors"
            >
              <option value="all">All payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs bg-[var(--color-bg-main)] border border-[var(--color-border-medium)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] transition-colors"
            >
              <option value="all">All methods</option>
              <option value="cash">Cash</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="paymob">PayMob</option>
            </select>
          </div>
        </div>

        {/* Main Data Table Container */}
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[var(--color-bg-main)]/50 border-b border-[var(--color-border-light)]">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Order ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Customer</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Date</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Payment</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Total</th>
                </tr>
              </thead>
              {/* هنا يتم عرض العناصر في الصفحه الحاليه */}
              <tbody className={`divide-y divide-[var(--color-border-light)] transition-all duration-300 ease-out dark:bg-[var(--color-dark-bg-main)] ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {renderListContent()}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-[var(--color-border-light)] bg-[var(--color-bg-main)]/20 dark:bg-[var(--color-dark-bg-main)] transition-colors duration-200">
            <div className="text-xs font-medium text-slate-400">
              Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 text-xs font-medium border rounded-lg disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed dark:text-[var(--color-text-light)]"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  disabled={loading}
                  onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 text-xs font-bold rounded-lg border cursor-pointer ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-slate-700'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 text-xs font-medium border rounded-lg disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed dark:text-[var(--color-text-light)]"
              >
                Next
              </button>
            </div>
          </div>        </div>
      </div>

      {selectedOrder && (
        <EditOrder
          order={selectedOrder}
          isOpen={EditOrderOpen}
          onClose={() => {
            setEditOrderOpen(false);
            setSelectedOrder(null); // Clean up state when closing
          }}
          onOrderUpdated={() => {
            fetchOrders();
          }}
        />
      )}
    </>
  );
}