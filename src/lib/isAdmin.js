import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";

export async function isAdmin() {
  // 1️⃣ Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) return;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch {
    return;
  }
  await dbConnect();
  const user = await User.findById(decoded.id).lean();
  if (!user || user.role !== "admin") return;

  return { id: decoded.id, status: 200, ok: true, user };
}
