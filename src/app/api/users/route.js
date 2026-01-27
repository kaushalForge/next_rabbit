import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";

export async function GET(request) {
  try {
    await dbConnect();

    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}
