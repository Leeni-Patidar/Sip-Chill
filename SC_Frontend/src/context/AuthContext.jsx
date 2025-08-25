import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  getMe,
  updateProfileApi,
  setAuthToken,
} from "../api/auth";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  orders: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        orders: [],
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    default:
      return state;
  }
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check session on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("sipAndChillToken");
      const storedUser = localStorage.getItem("sipAndChillUser");

      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const { data } = await getMe();
          dispatch({ type: "LOGIN_SUCCESS", payload: data });
        } catch {
          logout(); // token invalid → clear
        }
      } else if (storedUser) {
        // fallback: old storage format
        dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(storedUser) });
      }

      const storedOrders = localStorage.getItem("sipAndChillOrders");
      if (storedOrders) {
        try {
          dispatch({ type: "SET_ORDERS", payload: JSON.parse(storedOrders) });
        } catch {
          localStorage.removeItem("sipAndChillOrders");
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { data } = await loginApi({ email, password }); 
      // backend response: { success, token, user }
      localStorage.setItem("sipAndChillToken", data.token);
      localStorage.setItem("sipAndChillUser", JSON.stringify(data.user));
      setAuthToken(data.token);

      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { data } = await registerApi(userData);
      localStorage.setItem("sipAndChillToken", data.token);
      localStorage.setItem("sipAndChillUser", JSON.stringify(data.user));
      setAuthToken(data.token);

      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      dispatch({ type: "LOGIN_ERROR", payload: msg });
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("sipAndChillUser");
    localStorage.removeItem("sipAndChillToken");
    localStorage.removeItem("sipAndChillOrders");
    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await updateProfileApi(userData);
      localStorage.setItem("sipAndChillUser", JSON.stringify(data));
      dispatch({ type: "UPDATE_PROFILE", payload: data });
      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.user?.id,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    const updatedOrders = [newOrder, ...state.orders];
    localStorage.setItem("sipAndChillOrders", JSON.stringify(updatedOrders));
    dispatch({ type: "ADD_ORDER", payload: newOrder });
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = state.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem("sipAndChillOrders", JSON.stringify(updatedOrders));
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status } });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
