import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/api';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      return toast.error('Please fill out all fields');
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        items: cart,
        totalPrice: totalPrice,
      };

      await createOrder(payload);
      toast.success('Order Placed Successfully! 🎉');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-8 transition-colors">
        <div className="container mx-auto px-4">
          <Link to="/cart" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 mb-2">
            <ChevronLeft size={16} /> BACK TO CART
          </Link>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl transition-all border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-8 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl">
            <Lock size={20} />
            <p className="font-semibold text-sm">Secure Checkout - Paying ₹{totalPrice} on Delivery</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Prithviraj Chauhan"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Example Street, City..."
                rows="3"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-xl"
            >
              {loading ? 'Processing...' : `Place Order • ₹${totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
