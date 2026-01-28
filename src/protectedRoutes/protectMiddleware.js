// /protectedRoutes/protectMiddleware.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import userModel from "@/models/user";
import { NextResponse } from "next/server";

export async function protectAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    return { success: false, user: null, message: "Unauthorized user" };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded) {
      const user = await userModel.findOne({ email: decoded.email }).lean();
      if (user) {
        return NextResponse.json({
          success: true,
          user,
          message: "Authenticated",
        });
      } else {
        return NextResponse.json({ success: false, message: "Not authorized" });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "User does not exist",
      });
    }
  } catch (err) {
    return { success: false, message: "Invalid or expired token" };
  }
}
