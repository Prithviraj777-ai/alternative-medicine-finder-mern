import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-8 transition-colors">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 mb-2">
            <ChevronLeft size={16} /> BACK TO HOME
          </Link>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">Shopping Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">Your cart is empty.</p>
            <p className="text-sm mt-2 mb-6">Looks like you haven't added any medicines yet.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-blue-700 transition">Browse Medicines</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.medicineId} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'; }}
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-xl bg-gray-50 dark:bg-gray-900" 
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{item.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl">
                    <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition text-gray-600 dark:text-gray-200"><Minus size={16}/></button>
                    <span className="font-bold w-6 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition text-gray-600 dark:text-gray-200"><Plus size={16}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.medicineId)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition ml-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Order Summary</h2>
                <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between mb-6 text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Total Price</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">₹{totalPrice}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold shadow hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
