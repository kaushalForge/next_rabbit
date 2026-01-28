import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import userModel from "@/models/user";

export async function protectAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    return {
      success: false,
      isAdmin: false,
      message: "Unauthorized user",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findOne({ email: decoded.email }).lean();

    if (!user) {
      return {
        success: false,
        isAdmin: false,
        message: "User not found",
      };
    }

    if (user.role !== "admin") {
      return {
        success: false,
        isAdmin: false,
        message: "Not authorized",
      };
    }

    return {
      success: true,
      isAdmin: true,
      user,
    };
  } catch (err) {
    return {
      success: false,
      isAdmin: false,
      message: "Invalid or expired token",
    };
  }
}
