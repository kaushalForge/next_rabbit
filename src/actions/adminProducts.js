"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Product from "@/models/product";

export async function createProductAction(productData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/add`,
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
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/edit/${id}`,
      {
        method: "PATCH",
        headers: {
          Cookie: `cUser=${token}`,
        },
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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/delete/${productId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: `cUser=${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    revalidatePath("/admin/products");

    return {
      status: res.status,
      message: data?.message || "Something went wrong",
    };
  } catch (error) {
    console.error("Error deleting product:", error);

    return {
      status: 500,
      message: "Failed to delete product",
    };
  }
}
