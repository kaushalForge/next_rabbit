"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createProductAction(productData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/add`,
    {
      method: "POST",
      headers: {
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
      body: productData,
    },
  );

  const data = await res.json();
  revalidatePath("/admin/products");
  return { status: res.status, message: data.message };
}

export async function updateProductAction(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const id = formData.get("id");

    if (!id) {
      return { status: 400, error: "Product ID missing" };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/update/${id}`,
      {
        method: "PUT",
        headers: {
          Cookie: `cUser=${token}`,
        },
        credentials: "include",
        body: formData,
      },
    );

    const data = await res.json();

    revalidatePath("/admin/products");
    revalidatePath(`/admin/edit/${id}`);

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      status: 500,
      error: "Internal server error",
    };
  }
}

export async function deleteProductAction(productId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/delete/${productId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
    },
  );

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "Server returned invalid JSON" };
  }

  revalidatePath("/admin/products");
  return { status: res.status, message: data.message || "" };
}
