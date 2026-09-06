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