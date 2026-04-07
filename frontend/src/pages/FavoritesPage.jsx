import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, HeartCrack } from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-8 transition-colors">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 mb-2">
            <ChevronLeft size={16} /> BACK TO HOME
          </Link>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">My Favorites</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <HeartCrack size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-bold">No favorites yet.</p>
            <p className="text-sm mt-2">Start hearting medicines to save them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(med => (
              <MedicineCard key={med._id} medicine={med} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
