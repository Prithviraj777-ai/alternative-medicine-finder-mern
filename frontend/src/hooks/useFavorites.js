import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const item = window.localStorage.getItem('med_favorites');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('med_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (medicine) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((fav) => fav._id === medicine._id);
      if (exists) {
        return prevFavorites.filter((fav) => fav._id !== medicine._id);
      } else {
        return [...prevFavorites, medicine];
      }
    });
  };

  const isFavorite = (id) => favorites.some((fav) => fav._id === id);

  return { favorites, toggleFavorite, isFavorite };
};
