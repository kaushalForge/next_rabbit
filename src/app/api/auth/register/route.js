import { NextResponse } from "next/server";
import { googleRegisterController } from "@/controllers/users/userController";

export async function GET(request) {
  return NextResponse.json({ message: "Register page is working fine!" });
}

export const POST = googleRegisterController;
