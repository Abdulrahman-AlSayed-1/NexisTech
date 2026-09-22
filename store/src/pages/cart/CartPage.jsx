/**
 * Cart Page Placeholder
 * Route: /cart
 * To be implemented by feature team.
 */
// export default function CartPage() {
//   return (
//     <div className="py-16 text-center text-text-secondary dark:text-slate-400">
//       <h1 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light mb-2">
//         Cart Page
//       </h1>
//       <p className="text-xs">Route: /cart — To be implemented by team</p>
//     </div>
//   )
// }
///////////////////////////////////////////////////////////////////////
// import pro4 from "../../assets/images/pro1.jpg";
// import pro2 from "../../assets/images/pro2.jpg"
// import pro3 from "../../assets/images/pro3.jpg"
// import pro5 from "../../assets/images/pro5.jpg"
// import pro6 from "../../assets/images/pro6.jpg"

// const cartItems = [
//   {
//     id: 4,
//     name: 'pc is fast 49" Odyssey OLED G9 Gaming Monitor',
//     price: 10399.99,
//     quantity: 144,
//     image: pro4
//   },
//   {
//     id: 2,
//     name: "Canon EOS R6 Mark II Mirrorless Camera",
//     price: 2299,
//     quantity: 122,
//     image: pro2,
//   },
//   {
//     id: 3,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 184.99,
//     quantity: 50,
//     image: pro3,
//   },
//   {
//     id: 5,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 11184.99,
//     quantity: 155,
//     image: pro5,
//   },
//   {
//     id: 6,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 1184.99,
//     quantity: 30,
//     image: pro6,
//   },
// ];

// function CartItem({ item }) {
//   return (
//     <div className="flex gap-4 border-b border-border-light p-5 last:border-b-0 dark:border-primary-medium">

//       {/* Image */}
//       <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-bg-main">
//         <img
//           src={item.image}
//           alt={item.name}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       {/* Info */}
//       <div className="min-w-0 flex-1">
//         <h2 className="font-heading text-sm font-bold text-primary-dark dark:text-text-light">
//           {item.name}
//         </h2>

//         <p className="mt-2 font-semibold text-accent-gold">
//           EGP {item.price.toLocaleString()}
//         </p>

//         {/* Quantity */}
//         <div className="mt-4 flex items-center gap-3">
//           <button
//             type="button"
//             className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
//           >
//             −
//           </button>

//           <span className="w-5 text-center text-sm text-primary-dark dark:text-text-light">
//             {item.quantity}
//           </span>

//           <button
//             type="button"
//             className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
//           >
//             +
//           </button>
//         </div>
//       </div>

//       {/* Price / Delete */}
//       <div className="flex flex-col items-end justify-between">
//         <span className="whitespace-nowrap font-semibold text-primary-dark dark:text-text-light">
//           EGP {(item.price * item.quantity).toLocaleString()}
//         </span>

//         <button
//           type="button"
//           className="text-sm text-text-secondary hover:text-red-500"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// function OrderSummary({ subtotal }) {
//   const shipping = 0;
//   const tax = subtotal * 0.14;
//   const total = subtotal + shipping + tax;

//   return (
//     <div className="rounded-xl border border-border-light bg-bg-card p-6 dark:border-primary-medium dark:bg-dark-bg-card">

//       <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark dark:text-text-light">
//         Order Summary
//       </h2>

//       <div className="space-y-4">

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Subtotal
//           </span>

//           <span className="font-medium text-primary-dark dark:text-text-light">
//             EGP {subtotal.toLocaleString()}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Shipping
//           </span>

//           <span className="font-medium text-primary-medium">
//             Free
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Tax (14%)
//           </span>

//           <span className="font-medium text-primary-dark dark:text-text-light">
//             EGP {tax.toLocaleString()}
//           </span>
//         </div>

//       </div>

//       <div className="my-6 border-t border-border-light dark:border-primary-medium" />

//       <div className="flex items-center justify-between">
//         <span className="font-heading font-bold text-primary-dark dark:text-text-light">
//           Total
//         </span>

//         <span className="text-xl font-bold text-accent-gold">
//           EGP {total.toLocaleString()}
//         </span>
//       </div>

//       <button
//         type="button"
//         className="mt-6 w-full rounded-lg bg-primary-dark px-4 py-3 font-semibold text-text-light transition hover:bg-primary-medium"
//       >
//         Proceed to Checkout
//       </button>

//     </div>
//   );
// }

// function CouponBox() {
//   return (
//     <div className="mt-6 rounded-xl border border-border-light bg-bg-card p-5 dark:border-primary-medium dark:bg-dark-bg-card">

//       <h2 className="mb-4 font-heading font-bold text-primary-dark dark:text-text-light">
//         Coupon Code
//       </h2>

//       <div className="flex gap-3">

//         <input
//           type="text"
//           placeholder="Enter coupon code"
//           className="min-w-0 flex-1 rounded-lg border border-border-medium bg-bg-input px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-text-secondary focus:border-accent-gold dark:bg-dark-bg-main dark:text-text-light"
//         />

//         <button
//           type="button"
//           className="rounded-lg bg-accent-gold px-6 py-3 font-semibold text-primary-dark transition hover:bg-accent-gold-hover"
//         >
//           Apply
//         </button>

//       </div>
//     </div>
//   );
// }

// export default function CartPage() {
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <main className="min-h-screen bg-bg-main py-10 dark:bg-dark-bg-main">

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="font-heading text-3xl font-bold text-primary-dark dark:text-text-light">
//             Shopping Cart
//           </h1>

//           <p className="mt-2 text-text-secondary">
//             Review your items before checkout.
//           </p>
//         </div>

//         {/* Content */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

//           {/* Left */}
//           <div className="lg:col-span-2">

//             <div className="overflow-hidden rounded-xl border border-border-light bg-bg-card dark:border-primary-medium dark:bg-dark-bg-card">

//               {cartItems.map((item) => (
//                 <CartItem
//                   key={item.id}
//                   item={item}
//                 />
//               ))}

//             </div>

//             <CouponBox />

//             <button
//               type="button"
//               className="mt-5 text-sm font-medium text-primary-medium hover:text-primary-dark"
//             >
//               ← Continue Shopping
//             </button>

//           </div>

//           {/* Right */}
//           <div>
//             <OrderSummary subtotal={subtotal} />
//           </div>

//         </div>
//       </div>

//     </main>
//   );
// }

////////////////////////////////////////////////////////////////



// import pro4 from "../../assets/images/pro1.jpg";
// import pro2 from "../../assets/images/pro2.jpg";
// import pro3 from "../../assets/images/pro3.jpg";
// import pro5 from "../../assets/images/pro5.jpg";
// import pro6 from "../../assets/images/pro6.jpg";

// const initialCartItems = [
//   {
//     id: 4,
//     name: 'pc is fast 49" Odyssey OLED G9 Gaming Monitor',
//     price: 10399.99,
//     quantity: 144,
//     image: pro4,
//   },
//   {
//     id: 2,
//     name: "Canon EOS R6 Mark II Mirrorless Camera",
//     price: 2299,
//     quantity: 122,
//     image: pro2,
//   },
//   {
//     id: 3,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 184.99,
//     quantity: 50,
//     image: pro3,
//   },
//   {
//     id: 5,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 11184.99,
//     quantity: 155,
//     image: pro5,
//   },
//   {
//     id: 6,
//     name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
//     price: 1184.99,
//     quantity: 30,
//     image: pro6,
//   },
// ];

// function CartItem({ item, onIncrease, onDecrease, onDelete }) {
//   return (
//     <div className="flex gap-4 border-b border-border-light p-5 last:border-b-0 dark:border-primary-medium">
      
//       {/* Image */}
//       <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-bg-main">
//         <img
//           src={item.image}
//           alt={item.name}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       {/* Info */}
//       <div className="min-w-0 flex-1">
//         <h2 className="font-heading text-sm font-bold text-primary-dark dark:text-text-light">
//           {item.name}
//         </h2>

//         <p className="mt-2 font-semibold text-accent-gold">
//           EGP {item.price.toLocaleString()}
//         </p>

//         {/* Quantity */}
//         <div className="mt-4 flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => onDecrease(item.id)}
//             className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
//           >
//             −
//           </button>

//           <span className="w-5 text-center text-sm text-primary-dark dark:text-text-light">
//             {item.quantity}
//           </span>

//           <button
//             type="button"
//             onClick={() => onIncrease(item.id)}
//             className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
//           >
//             +
//           </button>
//         </div>
//       </div>

//       {/* Price / Delete */}
//       <div className="flex flex-col items-end justify-between">
//         <span className="whitespace-nowrap font-semibold text-primary-dark dark:text-text-light">
//           EGP {(item.price * item.quantity).toLocaleString()}
//         </span>

//         <button
//           type="button"
//           onClick={() => onDelete(item.id)}
//           className="text-sm text-text-secondary hover:text-red-500"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// function OrderSummary({ subtotal, onCheckout }) {
//   const shipping = 0;
//   const tax = subtotal * 0.14;
//   const total = subtotal + shipping + tax;

//   return (
//     <div className="rounded-xl border border-border-light bg-bg-card p-6 dark:border-primary-medium dark:bg-dark-bg-card">
      
//       <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark dark:text-text-light">
//         Order Summary
//       </h2>

//       <div className="space-y-4">

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Subtotal
//           </span>

//           <span className="font-medium text-primary-dark dark:text-text-light">
//             EGP {subtotal.toLocaleString()}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Shipping
//           </span>

//           <span className="font-medium text-primary-medium">
//             Free
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-text-secondary">
//             Tax (14%)
//           </span>

//           <span className="font-medium text-primary-dark dark:text-text-light">
//             EGP {tax.toLocaleString()}
//           </span>
//         </div>

//       </div>

//       <div className="my-6 border-t border-border-light dark:border-primary-medium" />

//       <div className="flex items-center justify-between">
//         <span className="font-heading font-bold text-primary-dark dark:text-text-light">
//           Total
//         </span>

//         <span className="text-xl font-bold text-accent-gold">
//           EGP {total.toLocaleString()}
//         </span>
//       </div>

//       <button
//         type="button"
//         onClick={onCheckout}
//         className="mt-6 w-full rounded-lg bg-primary-dark px-4 py-3 font-semibold text-text-light transition hover:bg-primary-medium"
//       >
//         Proceed to Checkout
//       </button>

//     </div>
//   );
// }

// function CouponBox() {
//   const [coupon, setCoupon] = useState("");

//   const handleApply = () => {
//     if (!coupon.trim()) {
//       alert("Please enter coupon code");
//       return;
//     }

//     alert(`Coupon "${coupon}" applied`);
//     setCoupon("");
//   };

//   return (
//     <div className="mt-6 rounded-xl border border-border-light bg-bg-card p-5 dark:border-primary-medium dark:bg-dark-bg-card">

//       <h2 className="mb-4 font-heading font-bold text-primary-dark dark:text-text-light">
//         Coupon Code
//       </h2>

//       <div className="flex gap-3">

//         <input
//           type="text"
//           value={coupon}
//           onChange={(e) => setCoupon(e.target.value)}
//           placeholder="Enter coupon code"
//           className="min-w-0 flex-1 rounded-lg border border-border-medium bg-bg-input px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-text-secondary focus:border-accent-gold dark:bg-dark-bg-main dark:text-text-light"
//         />

//         <button
//           type="button"
//           onClick={handleApply}
//           className="rounded-lg bg-accent-gold px-6 py-3 font-semibold text-primary-dark transition hover:bg-accent-gold-hover"
//         >
//           Apply
//         </button>

//       </div>
//     </div>
//   );
// }

// export default function CartPage() {
//   const [cartItems, setCartItems] = useState(initialCartItems);

//   const handleIncrease = (id) => {
//     setCartItems((items) =>
//       items.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//           : item
//       )
//     );
//   };

//   const handleDecrease = (id) => {
//     setCartItems((items) =>
//       items.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: Math.max(item.quantity - 1, 1),
//             }
//           : item
//       )
//     );
//   };

//   const handleDelete = (id) => {
//     setCartItems((items) =>
//       items.filter((item) => item.id !== id)
//     );
//   };

//   const handleCheckout = () => {
//     window.location.href = "/checkout";
//   };

//   const handleContinueShopping = () => {
//     window.location.href = "/products";
//   };

//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <main className="min-h-screen bg-bg-main py-10 dark:bg-dark-bg-main">

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="font-heading text-3xl font-bold text-primary-dark dark:text-text-light">
//             Shopping Cart
//           </h1>

//           <p className="mt-2 text-text-secondary">
//             Review your items before checkout.
//           </p>
//         </div>

//         {/* Content */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

//           {/* Left */}
//           <div className="lg:col-span-2">

//             <div className="overflow-hidden rounded-xl border border-border-light bg-bg-card dark:border-primary-medium dark:bg-dark-bg-card">

//               {cartItems.map((item) => (
//                 <CartItem
//                   key={item.id}
//                   item={item}
//                   onIncrease={handleIncrease}
//                   onDecrease={handleDecrease}
//                   onDelete={handleDelete}
//                 />
//               ))}

//             </div>

//             <CouponBox />

//             <button
//               type="button"
//               onClick={handleContinueShopping}
//               className="mt-5 text-sm font-medium text-primary-medium hover:text-primary-dark"
//             >
//               ← Continue Shopping
//             </button>

//           </div>

//           {/* Right */}
//           <div>
//             <OrderSummary
//               subtotal={subtotal}
//               onCheckout={handleCheckout}
//             />
//           </div>

//         </div>
//       </div>

//     </main>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////////////


import { useState } from "react";

import pro4 from "../../assets/images/pro1.jpg";
import pro2 from "../../assets/images/pro2.jpg";
import pro3 from "../../assets/images/pro3.jpg";
import pro5 from "../../assets/images/pro5.jpg";
import pro6 from "../../assets/images/pro6.jpg";

const initialCartItems = [
  {
    id: 4,
    name: 'pc is fast 49" Odyssey OLED G9 Gaming Monitor',
    price: 10399.99,
    quantity: 144,
    image: pro4,
  },
  {
    id: 2,
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    price: 2299,
    quantity: 122,
    image: pro2,
  },
  {
    id: 3,
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    price: 184.99,
    quantity: 50,
    image: pro3,
  },
  {
    id: 5,
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    price: 11184.99,
    quantity: 155,
    image: pro5,
  },
  {
    id: 6,
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    price: 1184.99,
    quantity: 30,
    image: pro6,
  },
];

function CartItem({ item, onIncrease, onDecrease, onDelete }) {
  return (
    <div className="flex gap-4 border-b border-border-light p-5 last:border-b-0 dark:border-primary-medium">
      
      {/* Image */}
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-bg-main">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h2 className="font-heading text-sm font-bold text-primary-dark dark:text-text-light">
          {item.name}
        </h2>

        <p className="mt-2 font-semibold text-accent-gold">
          EGP {item.price.toLocaleString()}
        </p>

        {/* Quantity */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
          >
            −
          </button>

          <span className="w-5 text-center text-sm text-primary-dark dark:text-text-light">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-secondary hover:border-primary-medium hover:text-primary-dark"
          >
            +
          </button>
        </div>
      </div>

      {/* Price / Delete */}
      <div className="flex flex-col items-end justify-between">
        <span className="whitespace-nowrap font-semibold text-primary-dark dark:text-text-light">
          EGP {(item.price * item.quantity).toLocaleString()}
        </span>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-sm text-text-secondary hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, onCheckout }) {
  const shipping = 0;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-xl border border-border-light bg-bg-card p-6 dark:border-primary-medium dark:bg-dark-bg-card">
      
      <h2 className="mb-6 font-heading text-xl font-bold text-primary-dark dark:text-text-light">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-text-secondary">
            Subtotal
          </span>

          <span className="font-medium text-primary-dark dark:text-text-light">
            EGP {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-secondary">
            Shipping
          </span>

          <span className="font-medium text-primary-medium">
            Free
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-secondary">
            Tax (14%)
          </span>

          <span className="font-medium text-primary-dark dark:text-text-light">
            EGP {tax.toLocaleString()}
          </span>
        </div>

      </div>

      <div className="my-6 border-t border-border-light dark:border-primary-medium" />

      <div className="flex items-center justify-between">
        <span className="font-heading font-bold text-primary-dark dark:text-text-light">
          Total
        </span>

        <span className="text-xl font-bold text-accent-gold">
          EGP {total.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-6 w-full rounded-lg bg-primary-dark px-4 py-3 font-semibold text-text-light transition hover:bg-primary-medium"
      >
        Proceed to Checkout
      </button>

    </div>
  );
}

function CouponBox() {
  const [coupon, setCoupon] = useState("");

  const handleApply = () => {
    if (!coupon.trim()) {
      alert("Please enter coupon code");
      return;
    }

    alert(`Coupon "${coupon}" applied`);
    setCoupon("");
  };

  return (
    <div className="mt-6 rounded-xl border border-border-light bg-bg-card p-5 dark:border-primary-medium dark:bg-dark-bg-card">

      <h2 className="mb-4 font-heading font-bold text-primary-dark dark:text-text-light">
        Coupon Code
      </h2>

      <div className="flex gap-3">

        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
          className="min-w-0 flex-1 rounded-lg border border-border-medium bg-bg-input px-4 py-3 text-sm text-primary-dark outline-none placeholder:text-text-secondary focus:border-accent-gold dark:bg-dark-bg-main dark:text-text-light"
        />

        <button
          type="button"
          onClick={handleApply}
          className="rounded-lg bg-accent-gold px-6 py-3 font-semibold text-primary-dark transition hover:bg-accent-gold-hover"
        >
          Apply
        </button>

      </div>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrease = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const handleDelete = (id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  const handleContinueShopping = () => {
    window.location.href = "/products";
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-bg-main py-10 dark:bg-dark-bg-main">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-dark dark:text-text-light">
            Shopping Cart
          </h1>

          <p className="mt-2 text-text-secondary">
            Review your items before checkout.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left */}
          <div className="lg:col-span-2">

            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-card dark:border-primary-medium dark:bg-dark-bg-card">

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onDelete={handleDelete}
                />
              ))}

            </div>

            <CouponBox />

            <button
              type="button"
              onClick={handleContinueShopping}
              className="mt-5 text-sm font-medium text-primary-medium hover:text-primary-dark"
            >
              ← Continue Shopping
            </button>

          </div>

          {/* Right */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              onCheckout={handleCheckout}
            />
          </div>

        </div>
      </div>

    </main>
  );
}

