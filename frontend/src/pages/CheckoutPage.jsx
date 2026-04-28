import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Lock, CreditCard, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../services/api';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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

  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Create Order on Backend
      const orderRes = await createRazorpayOrder({ medicines: cart });
      const { order, totalAmount } = orderRes.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use env var if available, but checkout.js doesn't strictly need it if generated via backend properly
        amount: order.amount,
        currency: order.currency,
        name: 'Alternative Medicine Finder',
        description: 'Secure Medicine Purchase',
        order_id: order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // Step 3: Verify Payment
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              medicines: cart,
              name: formData.name,
              address: formData.address,
              phone: formData.phone,
            });

            if (verifyRes.data.success) {
              toast.success('Payment Successful! 🎉');
              clearCart();
              navigate('/order-success', { 
                state: { 
                  orderId: verifyRes.data.order._id, 
                  paymentId: response.razorpay_payment_id 
                } 
              });
            }
          } catch (error) {
            console.error('Payment Verification Error:', error);
            toast.error('Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone
        },
        theme: {
          color: '#2563EB' // blue-600
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Step 4: Handle Failure
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast.error('Failed to initialize payment gateway.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      return toast.error('Please fill out all fields');
    }

    setLoading(true);

    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      // Cash on Delivery
      try {
        const payload = {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          items: cart, // The old route still expects 'items'
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

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border-2 transition ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                >
                  <CreditCard className={paymentMethod === 'razorpay' ? 'text-blue-500' : 'text-gray-500'} />
                  <span className={`font-semibold ${paymentMethod === 'razorpay' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>Pay Online</span>
                </div>
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border-2 transition ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                >
                  <Banknote className={paymentMethod === 'cod' ? 'text-green-500' : 'text-gray-500'} />
                  <span className={`font-semibold ${paymentMethod === 'cod' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Total Amount</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">₹{totalPrice}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : paymentMethod === 'razorpay' ? (
                <>
                  <Lock size={20} />
                  Pay securely with Razorpay
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
