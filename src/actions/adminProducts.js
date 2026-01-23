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
      body: productData,
    },
  );

  const data = await res.json();
  revalidatePath("/admin/products");
  return { status: res.status, message: data.message };
}

export async function updateProductAction(productData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) throw new Error("Not authenticated");

  const { _id, ...body } = productData;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/update/${_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  revalidatePath("/admin/edit");
  revalidatePath(`/admin/edit/${_id}`);
  return { status: res.status };
}

// export async function deleteProductAction(productId) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("cUser")?.value;
//   if (!token) throw new Error("Not authenticated");

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/delete/${productId}`,
//     {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `cUser=${token}`,
//       },
//     },
//   );

//   let data;
//   try {
//     data = await res.json();
//   } catch {
//     data = { message: "Server returned invalid JSON" };
//   }

//   revalidatePath("/admin/products");

//   return { status: res.status, message: data.message || "" };
// }
