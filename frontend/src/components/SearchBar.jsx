import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchMedicines } from '../services/api';
import { addToHistory, getSearchHistory } from '../utils/history';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  // Load search history on component mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Debounced Search Logic with AbortController
  useEffect(() => {
    // If there's an ongoing request, cancel it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.trim().length <= 1) {
      setSuggestions([]);
      setHasSearched(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setHasSearched(false);
      abortControllerRef.current = new AbortController();
      
      try {
        const response = await searchMedicines(query, {
          signal: abortControllerRef.current.signal
        });
        // Ensure we are setting an array of data, not the promise itself
        if (response.data) {
          setSuggestions(response.data);
          setHasSearched(true);
        }
      } catch (error) {
        if (error.name === 'AbortError') return; // Ignore aborted requests
        console.error("Search failed:", error);
        toast.error('Failed to fetch search results.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query]);

  const handleSelect = (medicine) => {
    const updatedHistory = addToHistory(medicine.name);
    setHistory(updatedHistory);
    setQuery('');
    setSuggestions([]);
    navigate(`/medicine/${medicine._id}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative group">
        <input
          type="text"
          className="w-full p-4 pl-12 pr-12 rounded-2xl border-2 border-transparent bg-white dark:bg-gray-800 shadow-xl focus:border-blue-500 outline-none transition-all text-lg text-gray-800 dark:text-gray-100"
          placeholder="Search medicines (e.g. Ashwagandha)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500" />
        
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {suggestions.map((med) => (
            <div
              key={med._id}
              onClick={() => handleSelect(med)}
              className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors"
            >
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{med.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{med.saltComposition}</p>
              </div>
              <div className="text-right">
                <span className="text-blue-600 dark:text-blue-400 font-bold block">₹{med.price}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">{med.manufacturer}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length > 1 && !loading && hasSearched && suggestions.length === 0 && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 text-center animate-in fade-in slide-in-from-top-2">
          <p className="font-bold text-gray-500 dark:text-gray-400">No medicines found</p>
          <p className="text-sm text-gray-400 mt-1">Try searching for a different name or salt composition.</p>
        </div>
      )}

      {query.length === 0 && history.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          <p className="w-full text-blue-200 text-xs mb-1 uppercase font-bold tracking-widest">Recent Searches</p>
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(item)}
              className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700 text-white dark:text-gray-200 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <History size={14} /> {item}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-14 top-5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;