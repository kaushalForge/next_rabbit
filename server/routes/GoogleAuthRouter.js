// backend/routes/auth/google.js
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { generateToken } = require("../utils/GenerateToken");
const User = require("../models/user");
const router = express.Router();

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://next-rabbit.vercel.app"
    : "http://localhost:3000";

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    domain: isProd ? ".next-rabbit.vercel.app" : undefined, // subdomain for production
  };
};

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${process.env.BACKEND_URL}/api/auth/google/callback`
          : "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        // User not found → redirect to frontend confirmation page
        if (!user) {
          const params = new URLSearchParams({
            email,
            name: profile.displayName || "",
            avatar: profile.photos?.[0]?.value || "",
            googleId: profile.id,
          }).toString();

          return done(null, false, {
            message: `/auth/confirm-google?${params}`,
          });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// STEP 1 → Redirect to Google
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  })
);

// STEP 2 → Google Callback
router.get(
  "/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=Login failed!` }),
  (req, res) => {
    if (!req.user && res.req.authInfo?.message) {
      return res.redirect(`${FRONTEND_URL}${res.req.authInfo.message}`);
    }

    const { email, role } = req.user;

    // Set token expiry by role
    const tokenExpiryMap = {
      admin: 12 * 60 * 60 * 1000,
      moderator: 24 * 60 * 60 * 1000,
      customer: 48 * 60 * 60 * 1000,
    };
    const maxAge = tokenExpiryMap[role] || 48 * 60 * 60 * 1000;

    const token = generateToken({ email, role }, maxAge);

    res.cookie("cUser", token, { ...cookieOptions(), maxAge });

    return res.redirect(`${FRONTEND_URL}/login?message=Login Successful!`);
  }
);

// STEP 3 → Create new user (if needed)
router.post("/create", async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({
      name,
      email,
      role: "customer",
      avatar,
      googleId,
      authProvider: "google",
    });

    const tokenExpiryMap = {
      admin: 12 * 60 * 60 * 1000,
      moderator: 24 * 60 * 60 * 1000,
      customer: 48 * 60 * 60 * 1000,
    };
    const maxAge = tokenExpiryMap[user.role] || 48 * 60 * 60 * 1000;
    const token = generateToken({ email: user.email, role: user.role }, maxAge);

    res.cookie("cUser", token, { ...cookieOptions(), maxAge });

    return res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
