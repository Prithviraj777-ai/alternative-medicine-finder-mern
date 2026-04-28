import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};

  if (!orderId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Thank you for your order. We are processing it now.</p>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-left mb-8 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Order Reference ID</p>
          <p className="font-mono text-gray-900 dark:text-white font-bold mb-4">{orderId}</p>
          
          {paymentId && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Payment Transaction ID</p>
              <p className="font-mono text-gray-900 dark:text-white font-bold">{paymentId}</p>
            </>
          )}
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md"
        >
          <Package size={20} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
