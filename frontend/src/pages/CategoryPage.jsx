import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getByCategory } from '../services/api';
import MedicineCard from '../components/MedicineCard';
import Skeleton from '../components/Skeleton';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const { category } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getByCategory(category, page)
      .then(res => {
        setMedicines(res.data.items || []);
        // Safely check if pages exist
        setTotalPages(res.data.pages || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error(err);
        setError(true);
        toast.error('Failed to load category data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, page]);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-8 transition-colors">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft size={16} /> BACK TO HOME
          </Link>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 capitalize">{category} Medicines</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        {error ? (
           <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-red-100 dark:border-red-900/30">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Could not load medicines</h2>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold">Try Again</button>
           </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
             <p className="text-xl font-bold text-gray-400">No medicines found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {medicines.map(med => (
                <MedicineCard key={med._id} medicine={med} />
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-6 bg-white dark:bg-gray-800 w-max mx-auto p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-800 dark:text-gray-200"
                >
                  <ChevronLeft />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setPage(idx + 1)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                        page === idx + 1 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-800 dark:text-gray-200"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;