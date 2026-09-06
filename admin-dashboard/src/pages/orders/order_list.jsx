import React, { useState } from 'react';

export default function OrderList() {
  // 1. Comprehensive Static Mock Data (25 items to test multi-page pagination)
  const [orders, setOrders] = useState([
    { _id: "#1A4982C1", customer: { name: "User One" }, totalPrice: 106.40, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-09-03" },
    { _id: "#7A5F8A73", customer: { name: "User Two" }, totalPrice: 15960000.00, currency: "EGP", status: "Returned", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-28" },
    { _id: "#3D381CA9", customer: { name: "User Three" }, totalPrice: 67.10, currency: "EGP", status: "Delivered", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-28" },
    { _id: "#8D8B973C", customer: { name: "User Four" }, totalPrice: 59.12, currency: "EGP", status: "Shipped", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-24" },
    { _id: "#DBDC6521", customer: { name: "User Five" }, totalPrice: 268.88, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-18" },
    { _id: "#E664DE1D", customer: { name: "User Six" }, totalPrice: 454.70, currency: "EGP", status: "Processing", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-15" },
    { _id: "#A9B8C7D6", customer: { name: "User Seven" }, totalPrice: 1250.00, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-14" },
    { _id: "#F4E3D2C1", customer: { name: "User Eight" }, totalPrice: 89.90, currency: "EGP", status: "Shipped", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-12" },
    { _id: "#B5C6D7E8", customer: { name: "User Nine" }, totalPrice: 310.45, currency: "EGP", status: "Delivered", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-10" },
    { _id: "#C1D2E3F4", customer: { name: "User Ten" }, totalPrice: 4120.00, currency: "EGP", status: "Processing", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-09" },
    // --- Page 2 Items Boundary ---
    { _id: "#D4E5F6A7", customer: { name: "User Eleven" }, totalPrice: 99.99, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-08" },
    { _id: "#E5F6A7B8", customer: { name: "User Twelve" }, totalPrice: 750.00, currency: "EGP", status: "Shipped", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-07" },
    { _id: "#F6A7B8C9", customer: { name: "User Thirteen" }, totalPrice: 18.50, currency: "EGP", status: "Cancelled", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-06" },
    { _id: "#A1B2C3D4", customer: { name: "User Fourteen" }, totalPrice: 640.00, currency: "EGP", status: "Delivered", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-05" },
    { _id: "#B2C3D4E5", customer: { name: "User Fifteen" }, totalPrice: 125.00, currency: "EGP", status: "Returned", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-04" },
    { _id: "#C3D4E5F6", customer: { name: "User Sixteen" }, totalPrice: 2200.00, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-04" },
    { _id: "#D4E5F6A1", customer: { name: "User Seventeen" }, totalPrice: 45.00, currency: "EGP", status: "Processing", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-03" },
    { _id: "#E5F6A1B2", customer: { name: "User Eighteen" }, totalPrice: 890.30, currency: "EGP", status: "Shipped", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-02" },
    { _id: "#F6A1B2C3", customer: { name: "User Nineteen" }, totalPrice: 135.00, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-08-01" },
    { _id: "#A2B3C4D5", customer: { name: "User Twenty" }, totalPrice: 54.20, currency: "EGP", status: "Delivered", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-31" },
    // --- Page 3 Items Boundary ---
    { _id: "#B3C4D5E6", customer: { name: "User Twenty-One" }, totalPrice: 315.00, currency: "EGP", status: "Confirmed", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-30" },
    { _id: "#C4D5E6F7", customer: { name: "User Twenty-Two" }, totalPrice: 940.00, currency: "EGP", status: "Shipped", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-28" },
    { _id: "#D5E6F7A8", customer: { name: "User Twenty-Three" }, totalPrice: 12.00, currency: "EGP", status: "Cancelled", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-25" },
    { _id: "#E6F7A8B9", customer: { name: "User Twenty-Four" }, totalPrice: 62.50, currency: "EGP", status: "Delivered", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-24" },
    { _id: "#F7A8B9C0", customer: { name: "User Twenty-Five" }, totalPrice: 180.00, currency: "EGP", status: "Processing", payment: "PENDING", gateway: "Cash", createdAt: "2026-07-22" }
  ]);

  // Search, Filters & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Sets pagination chunk bounds

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'processing': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'returned': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-[#585858] border-slate-200';
    }
  };

  // 1. Filtering Stage
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'all' || order.payment.toLowerCase() === paymentFilter.toLowerCase();
    const matchesMethod = methodFilter === 'all' || order.gateway.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
  });

  // 2. Pagination Calculations Stage
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Slices list down to display exactly 10 matching records corresponding to current active page viewport
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrdersSlice = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Safe reset helper if filters drastically shorten list items total bounds
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, methodFilter]);

  return (
    /* Centralized Layout Wrapper with Responsive Horizontal Space Padding */
    <div className="w-full min-h-screen bg-[#F6F6F6] text-[#262524] py-8 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 space-y-6">      
      {/* Top Titles */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#585858] block mb-1">
            Admin - Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#262524]">
            Orders
          </h1>
        </div>

        {/* Counter Card Display */}
        <div className="bg-white px-5 py-3 border border-slate-200 rounded-xl shadow-sm text-right flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[#262524]">{totalItems}</span>
          <span className="text-[11px] font-semibold text-[#585858]">total orders</span>
        </div>
      </div>

      {/* Toolbar Toolbar Filters Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search ID, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-3 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#262524] bg-white text-[#262524]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#585858] font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-[#262524]"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={paymentFilter} 
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#585858] font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-[#262524]"
          >
            <option value="all">All payments</option>
            <option value="pending">Pending</option>
          </select>

          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#585858] font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-[#262524]">
            <option value="all">All methods</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Customer</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Date</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Amount</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#585858]">Payment</th>
              </tr>
            </thead>
            <tbody>
              {currentOrdersSlice.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-sm text-[#585858]">
                    No orders found matching the filter selection.
                  </td>
                </tr>
              ) : (
                currentOrdersSlice.map((order) => (
                  <tr key={order._id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-[#262524]">{order._id}</td>
                    <td className="px-5 py-4 text-sm text-[#585858]">{order.customer?.name || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm text-[#585858]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-[#262524]">
                      {order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} {order.currency}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#585858]">{order.payment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10-Item Sliced Functional Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
        <span className="text-xs text-[#585858] font-medium">
          Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 border border-slate-200 rounded-lg text-[#585858] bg-white hover:bg-[#F6F6F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
          >
            {'<'}
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-7 h-7 text-xs font-bold rounded-lg text-center transition-all border hover:cursor-pointer ${
                currentPage === page
                  ? 'bg-[#262524] text-white border-[#262524] shadow-sm'
                  : 'text-[#585858] bg-white border-transparent hover:bg-[#F6F6F6]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 border border-slate-200 rounded-lg text-[#585858] bg-white hover:bg-[#F6F6F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}

