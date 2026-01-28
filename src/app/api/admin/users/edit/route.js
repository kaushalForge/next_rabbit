import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";
import { isAdmin } from "@/lib/isAdmin";

export async function PATCH(req) {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, role } = body;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.role = role || "customer";
    await user.save();

    return NextResponse.json({
      message: "User role updated successfully",
      newRole: user.role,
    });
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
