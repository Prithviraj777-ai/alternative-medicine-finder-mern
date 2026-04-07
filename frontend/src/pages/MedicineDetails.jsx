import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlternatives } from '../services/api';
import MedicineCard from '../components/MedicineCard';
import Skeleton from '../components/Skeleton';
import { ArrowLeft, Info, Info as InfoIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const MedicineDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    getAlternatives(id)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch medicine details. Please try again.");
        toast.error("Error fetching alternatives");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"><Skeleton /></div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton /><Skeleton /><Skeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <InfoIcon size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "Medicine not found."}</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-200">
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold truncate text-gray-900 dark:text-white">{data.original.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Card */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-700 transition-colors">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl mb-8 p-4">
               <img src={data.original.imageUrl} className="w-full h-64 object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal" alt={data.original.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'; }} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{data.original.name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-bold mb-6 text-lg">{data.original.manufacturer}</p>
            
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Form</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{data.original.form}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Pack Size</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{data.original.packSize}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Category</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs">{data.original.category}</span>
              </div>
              <div className="p-5 bg-blue-50 dark:bg-gray-900/50 border border-blue-100 dark:border-gray-700/50 rounded-2xl flex gap-4 mt-6 items-start">
                <Info className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Salt Composition</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-300">{data.original.saltComposition}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors">
              <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                Alternatives Found 
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-lg shadow-sm">
                  {data.alternatives.length}
                </span>
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Cheaper substitutes with the exact same composition.</p>
            </div>

            {data.alternatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.alternatives.map(alt => (
                  <MedicineCard 
                    key={alt._id} 
                    medicine={alt} 
                    isCheapest={alt._id === data.cheapestId} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-16 rounded-3xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-xl font-bold">No cheaper alternatives found for this specific salt combination.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;