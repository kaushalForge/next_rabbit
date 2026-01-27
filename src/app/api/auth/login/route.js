import { NextResponse } from "next/server";
// import { setAuthCookie } from "@/lib/cookies";
import { googleLoginController } from "@/controllers/users/userController";

export async function GET(request) {
  return NextResponse.json({ message: "Login page is working fine!" });
}

export const POST = googleLoginController;
