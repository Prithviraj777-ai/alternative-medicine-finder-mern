import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlternatives, getLocalAvailability } from '../services/api';
import MedicineCard from '../components/MedicineCard';
import Skeleton from '../components/Skeleton';
import { ArrowLeft, Info, Info as InfoIcon, MapPin, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const MedicineDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
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

    // Handle Local Availability
    setLocalLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocal(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation blocked, using default fallback.");
          fetchLocal(19.0, 72.9); // Default fallback Mumbai
        }
      );
    } else {
      fetchLocal(19.0, 72.9);
    }

    const fetchLocal = async (lat, lng) => {
        try {
            const res = await getLocalAvailability(id, lat, lng);
            setLocalData(res.data);
        } catch(err) {
            console.error("Local fetch err", err);
        } finally {
            setLocalLoading(false);
        }
    };

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

                <div className="mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Best Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">₹{data.original.price}</span>
                        <span className="text-lg text-gray-400 dark:text-gray-500 line-through font-medium">₹{data.original.mrp}</span>
                      </div>
                    </div>
                    {data.original.mrp > data.original.price && (
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-3 py-1 rounded-full text-sm">
                        Save {Math.round(((data.original.mrp - data.original.price) / data.original.mrp) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => addToCart(data.original)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-6 rounded-xl flex justify-center items-center gap-3 transition-all transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
                  >
                    <ShoppingCart size={22} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          {/* Local Pharmacy Availability Section */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-700 transition-colors h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-2xl">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Local Pharmacy</h3>
                </div>

                {localLoading ? (
                    <div className="flex justify-center p-8"><div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div></div>
                ) : localData ? (
                    <div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{localData.shop.name}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{localData.shop.address}</p>
                            <span className="inline-block mt-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-xs font-bold rounded-full">
                                {localData.shop.distance}
                            </span>
                        </div>

                        {localData.isAvailable ? (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl">
                                <CheckCircle size={28} className="shrink-0" />
                                <div>
                                    <p className="font-bold">In Stock Locally!</p>
                                    <p className="text-sm">You can pick this up right now.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-2xl">
                                    <XCircle size={28} className="shrink-0" />
                                    <div>
                                        <p className="font-bold">Sold Out Locally</p>
                                        <p className="text-sm border-b-amber-50">This exact brand is out of stock.</p>
                                    </div>
                                </div>

                                {localData.availableAlternatives && localData.availableAlternatives.length > 0 && (
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                            However, they DO HAVE these cheaper alternatives with the same salt:
                                        </p>
                                        <div className="space-y-3">
                                            {localData.availableAlternatives.map(alt => (
                                                <div key={alt._id} className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/30 shadow-sm p-3 rounded-xl flex justify-between items-center hover:border-purple-300 transition-colors">
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{alt.name}</p>
                                                        <p className="text-xs text-green-600 font-bold">₹{alt.price}</p>
                                                    </div>
                                                    <Link to={`/medicine/${alt._id}`} className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                                        View
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : null}
             </div>
          </div>
        </div>
        
        {/* Alternatives Section below both cards */}
        <div className="mt-12">
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
  );
};

export default MedicineDetails;