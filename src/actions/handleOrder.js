"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL;

// Get user token
const getOwner = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    return token || null;
  } catch (err) {
    console.error("Cannot get token:", err);
    return null;
  }
};

/* =========================
      Create Order
========================= */
export async function createOrderAction(orderData) {
  try {
    const token = await getOwner();
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    console.log(data);

    return {
      status: res.status,
      message: data?.message || "Order placed",
      order: data,
    };
  } catch (err) {
    console.error("createOrderAction error:", err);
    return {
      status: 500,
      message: err.message,
    };
  }
}

/* =========================
      Fetch My Orders
========================= */
export async function fetchOrdersAction() {
  try {
    const token = await getOwner();
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    const ordersArray = data.orders || [];
    return {
      status: res.status,
      orders: ordersArray,
    };
  } catch (err) {
    console.error("fetchMyOrdersAction error:", err);
    return {
      status: 500,
      orders: [],
    };
  }
}

// Cancel Order
export async function cancelOrderAction(shipmentId) {
  try {
    if (!shipmentId) {
      return {
        status: 400,
        success: false,
        message: "Shipment ID is required",
      };
    }

    const token = await getOwner();

    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "PATCH", // ✅ changed from GET
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify({ shipmentId }), // ✅ send shipmentId
      cache: "no-store",
    });

    const data = await res.json();

    return {
      status: res.status,
      success: data?.success ?? false,
      message: data?.message ?? "Something went wrong",
      cancelledShipment: data?.cancelledShipment ?? null,
      order: data?.order ?? null,
    };
  } catch (err) {
    console.error("cancelOrderAction error:", err);
    return {
      status: 500,
      success: false,
      message: "Internal error",
    };
  }
}

/* =========================
      Fetch Single Order
========================= */
export async function fetchSingleOrderAction(id) {
  try {
    const token = await getOwner();

    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: "GET",
      headers: {
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    return {
      status: res.status,
      order: data,
    };
  } catch (err) {
    console.error("fetchSingleOrderAction error:", err);
    return { status: 500 };
  }
}

/* =========================
      Update Order Status (Admin)
========================= */
export async function updateOrderStatusAction(id, updates) {
  try {
    const token = await getOwner();

    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data?.message,
    };
  } catch (err) {
    console.error("updateOrderStatusAction error:", err);
    return { status: 500 };
  }
}

/* =========================
      Delete Order (Admin/Test)
========================= */
export async function deleteOrderAction(id) {
  try {
    const token = await getOwner();

    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `cUser=${token}`,
      },
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data?.message,
    };
  } catch (err) {
    console.error("deleteOrderAction error:", err);
    return { status: 500 };
  }
}
