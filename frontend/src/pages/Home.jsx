import React from 'react';
import SearchBar from '../components/SearchBar';
import { Pill, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Pain Relief', icon: Pill },
  { name: 'Antibiotics', icon: Activity },
  { name: 'Vitamins', icon: ShieldCheck },
  { name: 'Blood Pressure', icon: HeartPulse }
];

const Home = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center transition-colors">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        <div className="relative z-30 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white px-2 mb-6 tracking-tight leading-none drop-shadow-xl">
            Med<span className="text-blue-200 dark:text-blue-400">Match</span>
          </h1>
          <p className="text-blue-100 dark:text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium px-4">
            Same salt composition, lower price. Search over 2000+ medicines and save up to 70% on your medical bills.
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/category/${cat.name}`}
              className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center hover:bg-blue-50 dark:hover:bg-gray-700 transition-all border border-gray-50 dark:border-gray-700 hover:-translate-y-2 group"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4 bg-blue-50 dark:bg-gray-900 p-4 rounded-full group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <cat.icon size={36} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-gray-700 dark:text-gray-200 text-center tracking-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;