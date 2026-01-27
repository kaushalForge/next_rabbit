import { NextResponse } from "next/server";
import { fetchAdminProducts } from "@/controllers/admin/adminProductController";
import { protect } from "@/protectedRoutes/protectMiddleware";
import { protectAdmin } from "@/protectedRoutes/adminMiddleware";

export async function GET(req) {
  const user = await protect();
  await protectAdmin(user);

  return await fetchAdminProducts();
}
