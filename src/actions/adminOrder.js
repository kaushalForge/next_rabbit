"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/* ================== FETCH ALL ORDERS ================== */
export async function fetchOrdersAdminAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`,
      {
        method: "GET",
        headers: {
          Cookie: `cUser=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    const data = await res.json();
    return data.orders;
  } catch (error) {
    console.error("fetchOrdersAdminAction error:", error);
    throw error;
  }
}

/* ================== UPDATE ORDER OR SHIPMENT STATUS ================== */
export async function updateOrderStatusAction({
  orderId,
  shipmentId,
  // order/shipment status
  status,
  paymentStatus,
  paymentMethod,
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        body: JSON.stringify({
          orderId,
          shipmentId,
          // only include fields that were actually passed — undefined fields
          // are stripped by JSON.stringify so the API won't accidentally
          // overwrite fields the caller didn't intend to change
          ...(status !== undefined && { status }),
          ...(paymentStatus !== undefined && { paymentStatus }),
          ...(paymentMethod !== undefined && { paymentMethod }),
        }),
      },
    );

    const data = await res.json();

    revalidatePath("/admin/orders");
    if (shipmentId) revalidatePath(`/admin/orders/${orderId}`);

    return { status: res.status, data };
  } catch (error) {
    console.error("updateOrderStatusAction error:", error);
    return { status: 500, error: "Internal server error" };
  }
}

/* ================== CANCEL SPECIFIC SHIPMENT ================== */
export async function cancelShipmentAction({ orderId, shipmentId }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        body: JSON.stringify({ orderId, shipmentId }),
      },
    );

    const data = await res.json();

    revalidatePath("/admin/orders");
    if (orderId) revalidatePath(`/admin/orders/${orderId}`);

    return { status: res.status, data };
  } catch (error) {
    console.error("cancelShipmentAction error:", error);
    return { status: 500, error: "Internal server error" };
  }
}

/* ================== RESTORE CANCELLED SHIPMENT ================== */
export async function restoreShipmentAction({ orderId, shipmentId }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders/restore`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        body: JSON.stringify({ orderId, shipmentId }),
      },
    );

    const data = await res.json();

    revalidatePath("/admin/orders");
    if (orderId) revalidatePath(`/admin/orders/${orderId}`);

    return { status: res.status, data };
  } catch (error) {
    console.error("restoreShipmentAction error:", error);
    return { status: 500, error: "Internal server error" };
  }
}

/* ================== SEND EMAIL TO CUSTOMER ================== */
export async function sendOrderEmailAction({ orderId, subject, message }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        body: JSON.stringify({ orderId, subject, message }),
      },
    );

    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    console.error("sendOrderEmailAction error:", error);
    return { status: 500, error: "Internal server error" };
  }
}

/* ================== SEND EMAIL TO All CUSTOMER ================== */
export async function sendBulkEmailAction({ subject, message }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders/email/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        body: JSON.stringify({ subject, message }),
      },
    );

    const data = await res.json();
    return { status: res.status, data };
  } catch (error) {
    console.error("sendBulkEmailAction error:", error);
    return { status: 500, error: "Internal server error" };
  }
}
