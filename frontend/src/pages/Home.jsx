import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { Pill, Activity, ShieldCheck, HeartPulse, Settings, Sparkles, Leaf, Stethoscope, Droplet, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getByCategory } from '../services/api';
import MedicineCard from '../components/MedicineCard';

const categories = [
  { name: 'Pain Relief', icon: Pill, color: 'bg-red-50 text-red-600', hover: 'group-hover:bg-red-600' },
  { name: 'Antibiotics', icon: Activity, color: 'bg-blue-50 text-blue-600', hover: 'group-hover:bg-blue-600' },
  { name: 'Diabetes', icon: Droplet, color: 'bg-sky-50 text-sky-600', hover: 'group-hover:bg-sky-600' },
  { name: 'Vitamins', icon: ShieldCheck, color: 'bg-orange-50 text-orange-600', hover: 'group-hover:bg-orange-600' },
  { name: 'Ayurvedic', icon: Leaf, color: 'bg-green-50 text-green-600', hover: 'group-hover:bg-green-600' },
  { name: 'Homeopathic', icon: TestTube, color: 'bg-purple-50 text-purple-600', hover: 'group-hover:bg-purple-600' },
  { name: 'Herbal', icon: Sparkles, color: 'bg-emerald-50 text-emerald-600', hover: 'group-hover:bg-emerald-600' },
  { name: 'Unani', icon: HeartPulse, color: 'bg-rose-50 text-rose-600', hover: 'group-hover:bg-rose-600' }
];

const Home = () => {
  const { user } = useAuth();
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetching "Pain Relief" to showcase generic medicines along with the UI updates
        const response = await getByCategory('Pain Relief', 1);
        setFeaturedMedicines(response.data.items.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 py-28 px-4 text-center transition-colors shadow-inner overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-30 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-100 font-bold text-sm tracking-widest mb-6 uppercase border border-white/20 shadow-lg">
            India's #1 Generic & Alternative Medicine Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white px-2 mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Med<span className="text-blue-300 dark:text-blue-400 font-extrabold">Match</span>
          </h1>
          <p className="text-indigo-100 dark:text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium px-4 leading-relaxed">
            Same composition, better price. Explore <span className="font-bold text-white">4000+</span> Allopathic and Natural remedies. Save up to 70% on your medical bills today.
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/category/${cat.name}`}
              className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center transition-all border border-gray-100 dark:border-gray-700 hover:-translate-y-2 group hover:shadow-2xl"
            >
              <div className={`${cat.color} mb-4 p-5 rounded-2xl ${cat.hover} group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <cat.icon size={40} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-gray-800 dark:text-gray-200 text-center tracking-tight text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Medicines Section */}
      <div className="container mx-auto px-4 mb-20 mt-10">
        <div className="flex items-center gap-3 mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
            <Stethoscope size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white tracking-tight">Today's Featured Medicines</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-14 h-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMedicines.map((med) => (
              <MedicineCard key={med._id} medicine={med} />
            ))}
          </div>
        )}
      </div>

      {/* Admin Panel Link */}
      {user?.role === 'admin' && (
        <div className="container mx-auto px-4 mt-12 mb-10 flex justify-center">
          <Link to="/admin" className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-400 font-bold py-4 px-8 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <Settings size={20} />
            Go to Admin Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;