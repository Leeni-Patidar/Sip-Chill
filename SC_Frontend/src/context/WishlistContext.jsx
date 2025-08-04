'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  items: [],
  itemCount: 0,
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Item already in wishlist, don't add again
        return state;
      }
      
      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        itemCount: newItems.length
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        itemCount: newItems.length
      };
    }

    case 'CLEAR_WISHLIST':
      return initialState;

    case 'SET_WISHLIST': {
      return {
        items: action.payload,
        itemCount: action.payload.length
      };
    }

    default:
      return state;
  }
};

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('sipAndChillWishlist');
    if (storedWishlist) {
      try {
        const wishlistItems = JSON.parse(storedWishlist);
        dispatch({ type: 'SET_WISHLIST', payload: wishlistItems });
      } catch (error) {
        localStorage.removeItem('sipAndChillWishlist');
      }
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('sipAndChillWishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (id) => {
    return state.items.some(item => item.id === id);
  };

  const toggleWishlistItem = (item) => {
    if (isInWishlist(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <WishlistContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      clearWishlist,
      isInWishlist,
      toggleWishlistItem,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};