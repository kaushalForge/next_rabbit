// /protectedRoutes/protectMiddleware.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";

export async function protect() {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  console.log(token);

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return { success: false, message: "Invalid or expired token" };
  }

  const user = await userModel.findOne({ email: decoded.email }).lean();

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return { success: true, user };
}
