"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  fetchCartAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeFromCartAction,
} from "@/actions/handleCart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // products array
  const [cartQuantity, setCartQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================
        Fetch Cart
  ========================= */
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const { status, products, totalPrice } = await fetchCartAction();

      if (status === 200 || status === 201) {
        setCart(products || []);
        setTotalPrice(totalPrice || 0);
        const quantity =
          products?.reduce((acc, p) => acc + (p.quantity || 1), 0) || 0;
        setCartQuantity(quantity);
      } else {
        console.error("Failed to fetch cart");
      }
    } catch (err) {
      console.error("fetchCart error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
        Refresh Cart
        Just calls fetchCart
  ========================= */
  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  /* =========================
        Add Item to Cart
  ========================= */
  const addCart = async ({
    productId,
    quantity = 1,
    price,
    offerPrice,
    size = "",
    color = "",
    name,
  }) => {
    try {
      // Optimistic UI
      setCart((prev) => {
        const exists = prev.find(
          (p) =>
            p.productId === productId && p.size === size && p.color === color,
        );
        if (exists) {
          return prev.map((p) =>
            p.productId === productId && p.size === size && p.color === color
              ? { ...p, quantity: (p.quantity || 1) + quantity }
              : p,
          );
        }
        return [
          ...prev,
          { productId, price, offerPrice, quantity, size, color, name },
        ];
      });

      const response = await addToCartAction({
        productId,
        quantity,
        price,
        offerPrice,
        size,
        color,
      });

      await refreshCart(); // Sync with server
      return response;
    } catch (err) {
      console.error("addCart error:", err);
      await refreshCart();
      return { status: 500, message: "Failed to add item" };
    }
  };

  /* =========================
        Update Cart Quantity
  ========================= */
  const updateCart = async ({ productId, quantity, size, color }) => {
    try {
      // Optimistic UI
      setCart((prev) =>
        prev.map((p) =>
          p.productId === productId && p.size === size && p.color === color
            ? { ...p, quantity }
            : p,
        ),
      );

      const response = await updateCartItemQuantityAction({
        productId,
        quantity,
        size,
        color,
      });

      await refreshCart(); // Sync with server
      return response;
    } catch (err) {
      console.error("updateCart error:", err);
      await refreshCart();
      return { status: 500, message: "Failed to update cart" };
    }
  };

  /* =========================
        Remove Item from Cart
  ========================= */
  const removeCart = async ({ productId, size, color }) => {
    try {
      // Optimistic UI
      setCart((prev) =>
        prev.filter(
          (p) =>
            !(
              p.productId === productId &&
              p.size === size &&
              p.color === color
            ),
        ),
      );

      const response = await removeFromCartAction({ productId, size, color });

      await refreshCart(); // Sync with server
      return response;
    } catch (err) {
      console.error("removeCart error:", err);
      await refreshCart();
      return { status: 500, message: "Failed to remove item" };
    }
  };

  /* =========================
        Clear Cart (local only)
  ========================= */
  const clearCart = () => {
    setCart([]);
    setCartQuantity(0);
    setTotalPrice(0);
    toast.success("Cart cleared");
  };

  // useEffect(() => {
  //   const quantity = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  //   const price = cart.reduce(
  //     (acc, item) => acc + item.price * (item.quantity || 1),
  //     0,
  //   );
  //   setCartQuantity(quantity);
  //   setTotalPrice(price);
  // }, [cart]);

  /* =========================
        Fetch cart on mount
  ========================= */
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
