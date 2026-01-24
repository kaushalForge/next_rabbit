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

  const { _id, ...body } = productData;
  const formData = new FormData();

  // Append all fields to FormData
  for (const key in body) {
    const value = body[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/update/${_id}`,
    {
      method: "PUT",
      headers: {
        Cookie: `cUser=${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    },
  );
  console.log(await res.json(), "test");

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
