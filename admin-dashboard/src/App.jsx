import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Logo from '@/components/common/Logo'
import OrderList from './pages/orders/order_list'

// Temporary mock login page component for development preview testing
function MockLogin() {
  return <div className="p-8 text-center font-bold">Admin Login Screen Placeholder</div>
}

export default function App() {
  return (
    // We removed <BrowserRouter> from here because it's already running in main.jsx
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<MockLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Typing /orders will load your order list component */}
        <Route path="/orders" element={<OrderList />} />
        
        {/* Redirect the base path straight to /orders for easy access */}
        <Route path="/" element={<Navigate to="/orders" replace />} />
      </Route>
    </Routes>
  )
}

// export default function App() {
//   return (
//     <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-6 text-center">
//       <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
//         <Logo variant="dark" size="lg" className="justify-center" />
//         <p className="text-xs text-[#585858] font-roboto">
//           Admin Dashboard configured &amp; ready for feature implementation.
//         </p>
//       </div>
//     </div>
//   )
// }
