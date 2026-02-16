"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { fetchOrdersAction } from "@/actions/handleOrder";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [allShipments, setAllShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
        Fetch Orders
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
      const response = await fetchOrdersAction();
      const fetchedOrders = response.orders || [];
      const shipments = fetchedOrders.flatMap(
        (order) => order?.shipments || [],
      );
      setOrders(fetchedOrders);
      setAllShipments(shipments);
    } catch (error) {
      console.error("fetchOrders error:", error);
      setOrders([]);
      setAllShipments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /* =========================
        Refresh Orders
  ========================= */
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalOrders = useMemo(() => {
    return allShipments?.length || 0;
  }, [allShipments]);

  const pendingOrders = useMemo(() => {
    if (!allShipments || allShipments.length === 0) return 0;

    return allShipments.filter((shipment) =>
      ["pending", "pending_order"].includes(shipment?.status?.toLowerCase()),
    ).length;
  }, [allShipments]);

  const totalSpent = useMemo(() => {
    if (!allShipments || allShipments.length === 0) return 0;
    return orders[0]?.totalPrice || 0;
  }, [allShipments]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        allShipments,
        loading,
        refreshOrders,
        totalOrders,
        pendingOrders,
        totalSpent,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  return context;
};
