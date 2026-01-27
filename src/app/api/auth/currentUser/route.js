import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";

export async function GET(request) {
  try {
    await dbConnect();
    const cookie = request.cookies.get("cUser")?.value;

    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No token provided", user: null },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(cookie, process.env.JWT_KEY);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return NextResponse.json(
        { success: false, message: "Invalid token", user: null },
        { status: 401 },
      );
    }

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", user: null },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/currentUser error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", user: null },
      { status: 500 },
    );
  }
}
