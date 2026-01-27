import { NextResponse } from "next/server";
import { fetchAdminProducts } from "@/controllers/admin/adminProductController";
import { protect } from "@/protectedRoutes/protectMiddleware";
import { protectAdmin } from "@/protectedRoutes/adminMiddleware";

export async function GET() {
  const auth = await protect();
  if (!auth.success) return { status: 401, body: auth };

  const roleCheck = await protectAdmin(auth.user);
  if (!roleCheck.success) return { status: 403, body: roleCheck };

  const products = await fetchAdminProducts();
  return { status: 200, body: { success: true, products } };
}
