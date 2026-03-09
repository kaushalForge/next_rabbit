"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  fetchOrdersAdminAction,
  updateOrderStatusAction,
  cancelShipmentAction,
  sendOrderEmailAction,
} from "@/actions/adminOrder";
import { useAuth } from "./AuthContext";

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders for admin
  const fetchOrders = useCallback(async () => {
    if (!currentUser || currentUser.role !== "admin") return;

    setLoading(true);
    setError(null);

    try {
      const fetchedOrders = await fetchOrdersAdminAction();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update order/shipment status
  const updateOrderStatus = async (orderId, status, shipmentId = null) => {
    try {
      const res = await updateOrderStatusAction({
        orderId,
        status,
        shipmentId,
      });
      await fetchOrders(); // Refresh orders
      return res;
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      return { status: 500, error: err.message || "Failed to update status" };
    }
  };

  // Cancel a shipment
  const cancelShipment = async (orderId, shipmentId) => {
    try {
      const res = await cancelShipmentAction({ orderId, shipmentId });
      await fetchOrders(); // Refresh orders
      return res;
    } catch (err) {
      console.error("cancelShipment error:", err);
      return { status: 500, error: err.message || "Failed to cancel shipment" };
    }
  };

  // Send email to customer
  const sendEmail = async (orderId, subject, message) => {
    try {
      const res = await sendOrderEmailAction({ orderId, subject, message });
      return res;
    } catch (err) {
      console.error("sendEmail error:", err);
      return { status: 500, error: err.message || "Failed to send email" };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        orders,
        loading: authLoading || loading,
        error,
        fetchOrders,
        updateOrderStatus,
        cancelShipment,
        sendEmail,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
