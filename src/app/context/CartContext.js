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

  /* =========================
        Fetch Cart (only if user exists)
  ========================= */
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

  /* =========================
        Add Item
  ========================= */
  const addCart = async (data) => {
    try {
      setCart((prev) => {
        const exists = prev.find(
          (p) =>
            p.productId === data.productId &&
            p.size === data.size &&
            p.color === data.color,
        );

        if (exists) {
          return prev.map((p) =>
            p.productId === data.productId &&
            p.size === data.size &&
            p.color === data.color
              ? { ...p, quantity: (p.quantity || 1) + data.quantity }
              : p,
          );
        }

        return [...prev, data];
      });

      await addToCartAction(data);
      await refreshCart();
    } catch {
      await refreshCart();
    }
  };

  /* =========================
        Update Quantity
  ========================= */
  const updateCart = async (data) => {
    try {
      setCart((prev) =>
        prev.map((p) =>
          p.productId === data.productId &&
          p.size === data.size &&
          p.color === data.color
            ? { ...p, quantity: data.quantity }
            : p,
        ),
      );

      await updateCartItemQuantityAction(data);
      await refreshCart();
    } catch {
      await refreshCart();
    }
  };

  /* =========================
        Remove Item
  ========================= */
  const removeCart = async (data) => {
    try {
      setCart((prev) =>
        prev.filter(
          (p) =>
            !(
              p.productId === data.productId &&
              p.size === data.size &&
              p.color === data.color
            ),
        ),
      );

      const { status, message, products, totalPrice } =
        await removeFromCartAction(data);
      setTotalPrice(totalPrice);
      setCart(products);
      await refreshCart();
      return { status, message };
    } catch {
      await refreshCart();
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartQuantity(0);
    setTotalPrice(0);
  };

  /* =========================
        Auto recalc when cart changes
  ========================= */
  useEffect(() => {
    const quantity = cart.reduce((acc, p) => acc + (p.quantity || 1), 0);
    setCartQuantity(quantity);
  }, [cart]);

  /* =========================
        🔥 MAIN LOGIC (very important)
        React to user change
  ========================= */
  useEffect(() => {
    if (!currentUser) {
      clearCart(); // logout → empty instantly
      setLoading(false);
      return;
    }

    fetchCart(); // login → fetch cart
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
