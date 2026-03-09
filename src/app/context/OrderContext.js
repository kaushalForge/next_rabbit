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
import { fetchOrdersAction, cancelOrderAction } from "@/actions/handleOrder";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [allShipments, setAllShipments] = useState([]);
  const [cancelledShipments, setCancelledShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  /* =========================
        Fetch Orders
  ========================= */
  const fetchOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      setAllShipments([]);
      setCancelledShipments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetchOrdersAction();

      // ✅ Handle ANY possible response structure
      let fetchedOrders = [];

      if (Array.isArray(response)) {
        fetchedOrders = response;
      } else if (Array.isArray(response?.orders)) {
        fetchedOrders = response.orders;
      } else if (Array.isArray(response?.data?.orders)) {
        fetchedOrders = response.data.orders;
      }


      // Extract shipments
      const extractedActive = fetchedOrders.flatMap((order) =>
        Array.isArray(order?.shipments) ? order.shipments : [],
      );

      const extractedCancelled = fetchedOrders.flatMap((order) =>
        Array.isArray(order?.cancelledProducts) ? order.cancelledProducts : [],
      );

      setOrders(fetchedOrders);
      setAllShipments(extractedActive);
      setCancelledShipments(extractedCancelled);
    } catch (error) {
      console.error("fetchOrders error:", error);

      setOrders([]);
      setAllShipments([]);
      setCancelledShipments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /* =========================
        Cancel Shipment
  ========================= */
  const cancelShipment = useCallback(
    async (shipmentId) => {
      if (!shipmentId) {
        return {
          success: false,
          status: 400,
          message: "Shipment ID is required",
        };
      }

      setCancelling(true);

      try {
        const response = await cancelOrderAction(shipmentId);

        if (response?.success) {
          await fetchOrders();
        }

        return {
          success: response?.success ?? false,
          status: response?.status ?? 500,
          message: response?.message ?? "Something went wrong",
        };
      } catch (err) {
        console.error("cancelShipment error:", err);

        return {
          success: false,
          status: 500,
          message: "Internal error",
        };
      } finally {
        setCancelling(false);
      }
    },
    [fetchOrders],
  );

  /* =========================
        Load orders when user changes
  ========================= */
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, fetchOrders]);

  /* =========================
        Derived Values
  ========================= */

  const totalOrders = allShipments.length;

  const pendingOrders = useMemo(() => {
    return allShipments.filter((shipment) => {
      const status = shipment?.status?.toLowerCase?.() ?? "";
      return ["pending", "pending_order"].includes(status);
    }).length;
  }, [allShipments]);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + (order?.totalPrice ?? 0);
    }, 0);
  }, [orders]);

  const value = useMemo(
    () => ({
      orders,
      allShipments,
      cancelledShipments,
      loading,
      cancelling,
      refreshOrders: fetchOrders,
      cancelShipment,
      totalOrders,
      pendingOrders,
      totalSpent,
    }),
    [
      orders,
      allShipments,
      cancelledShipments,
      loading,
      cancelling,
      fetchOrders,
      cancelShipment,
      totalOrders,
      pendingOrders,
      totalSpent,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }

  return context;
};
