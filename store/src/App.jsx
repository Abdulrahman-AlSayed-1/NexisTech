import { Routes, Route } from 'react-router-dom'
import MyOrders from './pages/orders/MyOrders'
import OrderDetails from './pages/orders/OrderDetails'



export default function App() {
  return (
    <Routes>
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path='/my-orders/:orderId' element={<OrderDetails/>} />
    </Routes>
  )
}
