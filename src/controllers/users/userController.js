import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { dbConnect } from "@/lib/dbConnection";
import User from "@/models/user";
import { generateToken } from "@/utils/GenerateToken";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function googleLoginController(request) {
  try {
    await dbConnect();

    // 1️⃣ Get ID token from request
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Missing Google token" },
        { status: 400 },
      );
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        googleId,
        authProvider: "google",
        role: "customer",
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      user.avatar = picture || user.avatar;
      user.googleId = googleId || user.googleId;
      await user.save();
    }

    const token = generateToken(user, { expiresIn: "7d" });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
        },
      },
      { status: 200 },
    );

    response.cookies.set("cUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 },
    );
  }
}

export async function googleRegisterController(request) {
  try {
    await dbConnect();

    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Missing Google token" },
        { status: 400 },
      );
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let statusCode = 200;
    let message = "";
    const emailNormalized = email.toLowerCase();
    let user = await User.findOne({ email: emailNormalized });

    if (user) {
      // ✅ Existing user → auto-login
      user.lastLogin = new Date();
      await user.save();
      statusCode = 200;
      message = "User already registered. Logged in automatically.";
    } else {
      // ✅ New user → registration
      user = await User.create({
        name,
        email: emailNormalized,
        avatar: picture,
        googleId,
        authProvider: "google",
        role: "customer",
        lastLogin: new Date(),
      });
      statusCode = 201;
      message = "Registration successful";
    }
    // Generate JWT token
    const token = generateToken(user, { expiresIn: "7d" });

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
        },
      },
      { status: statusCode },
    );

    response.cookies.set("cUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 },
    );
  }
}
