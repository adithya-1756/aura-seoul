import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartTotals } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartTotals | null;
  loading: boolean;
  itemCount: number;
  addToCart: (productId: string, size: string, color?: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const refreshCart = async () => {
    try {
      const res = await api.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const addToCart = async (productId: string, size: string, color?: string, quantity: number = 1): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.addToCart({ productId, size, color, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        showToast(res.message || 'Added to shopping bag.', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to add item.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      const res = await api.updateCartQuantity({ productId, size, color, quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update quantity.', 'error');
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    try {
      const res = await api.removeFromCart({ productId, size, color });
      if (res.success && res.data) {
        setCart(res.data);
        showToast('Item removed from shopping bag.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item.', 'error');
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await api.applyCoupon(code);
      if (res.success && res.data) {
        setCart(res.data);
        showToast(res.message || 'Coupon applied successfully!', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon.', 'error');
      return false;
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await api.removeCoupon();
      if (res.success && res.data) {
        setCart(res.data);
        showToast('Coupon removed.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove coupon.', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
