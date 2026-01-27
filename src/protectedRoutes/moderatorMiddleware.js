import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";
import { NextResponse } from "next/server";

export async function protectModerator() {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    return NextResponse.json({ message: "Cannot get token!" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return NextResponse.json({ message: "Error decoding" });
  }

  const user = await userModel.findOne({ email: decoded.email }).lean();

  if (!user) {
    return NextResponse.json({ message: "User does not exists!" });
  }

  if (user.role !== "moderator") {
    return user;
  }
}
