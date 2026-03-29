import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const CART_KEY = 'chef_halavi_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCartItems(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load cart:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product === product.id);
      const updated = existing
        ? prev.map(item =>
            item.product === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...prev,
            {
              id: `${product.id}-${Date.now()}`,
              product: product.id,
              product_name: product.name,
              product_image: product.image,
              quantity: 1,
              price_at_time: product.price,
              notes: '',
            },
          ];
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) { removeFromCart(itemId); return; }
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCartItems([]);
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems,
      loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
