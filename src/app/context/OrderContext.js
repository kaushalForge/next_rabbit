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

    setLoading(true);

    try {
      const response = await fetchOrdersAction();
      const fetchedOrders = Array.isArray(response?.orders)
        ? response.orders
        : [];

      // ✅ Extract active shipments safely
      const extractedActive = fetchedOrders.flatMap((order) =>
        Array.isArray(order?.shipments) ? order.shipments : [],
      );

      // ✅ Extract cancelled shipments safely
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

      setLoading(true);
      try {
        // Call the API
        const response = await cancelOrderAction(shipmentId);
        if (response.success) {
          await fetchOrders();
        }
        return {
          success: response.success ?? false,
          status: response.status ?? 500,
          message: response.message ?? "Something went wrong",
          cancelledShipment: response.cancelledShipment ?? null,
          order: response.order ?? null,
        };
      } catch (err) {
        console.error("cancelShipment error:", err);
        return {
          success: false,
          status: 500,
          message: "Internal error",
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders],
  );

  /* =========================
        Refresh Orders
  ========================= */
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================
        Derived Values
  ========================= */

  // Total active shipments count
  const totalOrders = useMemo(() => {
    return allShipments.length;
  }, [allShipments]);

  // Pending shipments count
  const pendingOrders = useMemo(() => {
    if (!allShipments.length) return 0;

    return allShipments.filter((shipment) => {
      const status = shipment?.status?.toLowerCase?.() || "";
      return ["pending", "pending_order"].includes(status);
    }).length;
  }, [allShipments]);

  // Total spent (based on order documents)
  const totalSpent = useMemo(() => {
    if (!orders.length) return 0;

    return orders.reduce((sum, order) => {
      return sum + (order?.totalPrice || 0);
    }, 0);
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        allShipments,
        cancelledShipments,
        loading,
        refreshOrders,
        cancelShipment, // ✅ Expose cancel function
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
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};
