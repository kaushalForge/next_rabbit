"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  fetchCartAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeFromCartAction,
} from "@/actions/handleCart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CART ================= */
  const fetchCart = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { status, products, totalPrice } = await fetchCartAction();

      if (status === 200 || status === 201) {
        setCart(products || []);
        setTotalPrice(totalPrice || 0);
      }
    } catch (err) {
      console.error("fetchCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  /* ================= ADD ITEM ================= */
  const addCart = async (data) => {
    try {
      const response = await addToCartAction(data);

      if (response?.status === 200 || response?.status === 201) {
        await fetchCart();
      }

      return response; // ✅ return to component
    } catch (error) {
      console.error("addCart error:", error);
      return { status: 500, message: "Failed to add item" };
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateCart = async (data) => {
    try {
      const response = await updateCartItemQuantityAction(data);

      if (response?.status === 200 || response?.status === 201) {
        setCart(response.products || []);
        setTotalPrice(response.totalPrice || 0);
      }

      return response; // ✅ important
    } catch (error) {
      console.error("updateCart error:", error);
      return { status: 500, message: "Failed to update quantity" };
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeCart = async (data) => {
    try {
      const response = await removeFromCartAction(data);

      if (response?.status === 200 || response?.status === 201) {
        setCart(response.products || []);
        setTotalPrice(response.totalPrice || 0);
      }

      return response; // ✅ important
    } catch (error) {
      console.error("removeCart error:", error);
      return { status: 500, message: "Failed to remove item" };
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartQuantity(0);
    setTotalPrice(0);
  };

  /* ================= AUTO RECALC ================= */
  useEffect(() => {
    const quantity = cart.reduce((acc, p) => acc + (p.quantity || 1), 0);
    setCartQuantity(quantity);
  }, [cart]);

  /* ================= USER CHANGE ================= */
  useEffect(() => {
    if (!currentUser) {
      clearCart();
      setLoading(false);
      return;
    }

    fetchCart();
  }, [currentUser, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartQuantity,
        totalPrice,
        loading,
        addCart,
        updateCart,
        removeCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
