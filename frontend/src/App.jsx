import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MedicineDetails from './pages/MedicineDetails';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicine/:id" element={<MedicineDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;