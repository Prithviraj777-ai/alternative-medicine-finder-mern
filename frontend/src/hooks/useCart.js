import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const item = window.localStorage.getItem('med_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  // Listen for updates from other instances of the hook
  useEffect(() => {
    const syncCart = () => {
      try {
        const item = window.localStorage.getItem('med_cart');
        if (item) setCart(JSON.parse(item));
      } catch (e) {}
    };

    window.addEventListener('cart_updated', syncCart);
    window.addEventListener('storage', syncCart); // Cross-tab support

    return () => {
      window.removeEventListener('cart_updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  // Update local storage and emit event
  const updateCart = useCallback((newCart) => {
    setCart(newCart);
    window.localStorage.setItem('med_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart_updated'));
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.medicineId === item._id);
    let newCart;
    if (existing) {
      newCart = cart.map(cartItem =>
        cartItem.medicineId === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      );
    } else {
      newCart = [...cart, { 
        medicineId: item._id, 
        name: item.name, 
        price: item.price, 
        imageUrl: item.imageUrl,
        quantity: 1 
      }];
    }
    updateCart(newCart);
    toast.success('Added to cart');
  };

  const removeFromCart = (id) => {
    updateCart(cart.filter(item => item.medicineId !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    updateCart(cart.map(item => 
      item.medicineId === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => updateCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice };
};
