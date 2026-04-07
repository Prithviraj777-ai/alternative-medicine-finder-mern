import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { totalItems } = useCart();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-blue-600 dark:text-blue-400">
          AltMed<span className="text-gray-800 dark:text-gray-200">Finder</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-gray-500 hover:text-blue-500 transition-colors">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full select-none transform translate-x-1 -translate-y-1">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/favorites" className="p-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart size={20} />
          </Link>
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
