import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: string[];
  itemCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { showToast } = useToast();
  const { user } = useAuth();

  const refreshWishlist = async () => {
    try {
      const res = await api.getWishlist();
      if (res.success) {
        setWishlist(res.data || []);
        setWishlistIds(res.productIds || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isWishlisted = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const res = await api.toggleWishlist(productId);
      if (res.success) {
        setWishlistIds(res.productIds);
        showToast(res.message, res.isWishlisted ? 'success' : 'info');
        refreshWishlist();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update wishlist.', 'error');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await api.removeFromWishlist(productId);
      if (res.success) {
        setWishlistIds(res.productIds);
        showToast('Removed from wishlist.', 'info');
        refreshWishlist();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove from wishlist.', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        itemCount: wishlistIds.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
