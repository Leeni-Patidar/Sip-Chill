

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  orders: []
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        orders: []
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    
    default:
      return state;
  }
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('sipAndChillUser');
    const storedOrders = localStorage.getItem('sipAndChillOrders');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('sipAndChillUser');
      }
    }
    
    if (storedOrders) {
      try {
        const orders = JSON.parse(storedOrders);
        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        localStorage.removeItem('sipAndChillOrders');
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'customer',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=d97706&color=fff`,
        phone: '',
        address: '',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('sipAndChillUser', JSON.stringify(userData));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      
      return { success: true, user: userData };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Invalid credentials' });
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        role: 'customer',
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=d97706&color=fff`,
        phone: userData.phone || '',
        address: '',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('sipAndChillUser', JSON.stringify(newUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      
      return { success: true, user: newUser };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Registration failed' });
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sipAndChillUser');
    localStorage.removeItem('sipAndChillOrders');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('sipAndChillUser', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: userData });
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.user?.id,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    const updatedOrders = [newOrder, ...state.orders];
    localStorage.setItem('sipAndChillOrders', JSON.stringify(updatedOrders));
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('sipAndChillOrders', JSON.stringify(updatedOrders));
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
