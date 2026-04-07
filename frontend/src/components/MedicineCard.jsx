import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, PlusCircle } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';

const MedicineCard = ({ medicine, isCheapest }) => {
  const discount = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(medicine.imageUrl);

  const fallbackImage = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm transition-all hover:shadow-2xl border-2 ${isCheapest ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500'} group`}>
      {isCheapest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
          <Zap size={14} fill="white" /> BEST VALUE
        </div>
      )}
      
      <button 
        onClick={(e) => { e.preventDefault(); toggleFavorite(medicine); }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
      >
        <Heart 
          size={18} 
          className={isFavorite(medicine._id) ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'} 
        />
      </button>

      <div className="h-44 flex items-center justify-center mb-6 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 isolation-auto">
        <img 
          src={imgSrc} 
          onError={() => setImgSrc(fallbackImage)}
          alt={medicine.name} 
          className="max-h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 truncate mb-1">{medicine.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 truncate font-medium">{medicine.saltComposition}</p>

      <div className="flex items-center justify-between mb-5 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl">
        <div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">₹{medicine.price}</span>
          <span className="text-xs text-gray-400 line-through font-semibold">MRP ₹{medicine.mrp}</span>
        </div>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide">
          {discount}% OFF
        </span>
      </div>

      <div className="flex gap-2">
        <Link 
          to={`/medicine/${medicine._id}`}
          className="flex-1 text-center py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors text-sm border-2 border-gray-900 dark:border-gray-100 dark:hover:border-blue-500 hover:border-blue-600"
        >
          Details
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); addToCart(medicine); }}
          className="flex-1 flex items-center justify-center gap-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm border-2 border-blue-600"
        >
          <PlusCircle size={18} /> Cart
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;