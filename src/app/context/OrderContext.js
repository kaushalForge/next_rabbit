"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { fetchOrdersAction } from "@/actions/handleOrder";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [allShipments, setAllShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
        Fetch orders from API
  ========================= */
  const fetchOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      setAllShipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use success instead of status to match API
      const { status, orders } = await fetchOrdersAction();
      if (status === 200) {
        const allShipments = orders.flatMap((order) => order.shipments || []);
        setOrders(orders);
        setAllShipments(allShipments);
      } else {
        setOrders([]);
        setAllShipments([]);
      }
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
      setAllShipments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /* =========================
        Refresh orders
  ========================= */
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  /* =========================
        Auto-fetch on login/admin change
  ========================= */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        allShipments,
        loading,
        refreshOrders,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
