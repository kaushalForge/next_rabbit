import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";
import { isAdmin } from "@/lib/isAdmin";

export async function DELETE(request, { params }) {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User removed successfully!", user },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
