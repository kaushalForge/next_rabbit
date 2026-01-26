const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { generateToken } = require("../utils/GenerateToken");

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";

/* ===============================
   TOKEN EXPIRY CONFIG
================================ */
const TOKEN_EXPIRY = {
  admin: 12 * 60 * 60 * 1000,
  moderator: 24 * 60 * 60 * 1000,
  customer: 48 * 60 * 60 * 1000,
};

/* ===============================
   COOKIE CONFIG (DEPLOYMENT SAFE)
================================ */
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd ? "true" : "false",
  sameSite: "none",
  path: "/",
  domain: ".next-rabbit.vercel.app",
  maxAge,
});

/* ===============================
   GOOGLE STRATEGY
================================ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        // User does not exist → redirect to confirm page
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

        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

/* ===============================
   SERIALIZATION (OPTIONAL)
================================ */
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* ===============================
   STEP 1 → GOOGLE REDIRECT
================================ */
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

/* ===============================
   STEP 2 → GOOGLE CALLBACK
================================ */
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Login failed`,
  }),
  (req, res) => {
    if (!req.user && res.req.authInfo?.message) {
      return res.redirect(
        `${process.env.FRONTEND_URL}${res.req.authInfo.message}`,
      );
    }

    const { email, role } = req.user;
    const maxAge = TOKEN_EXPIRY[role] || TOKEN_EXPIRY.customer;

    const token = generateToken({ email, role }, maxAge);

    res.cookie("cUser", token, getCookieOptions(maxAge));

    return res.redirect(`${process.env.FRONTEND_URL}/`);
  },
);

/* ===============================
   STEP 3 → CREATE USER AFTER CONFIRM
================================ */
router.post("/create", async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      avatar,
      googleId,
      role: "customer",
      authProvider: "google",
    });

    const maxAge = TOKEN_EXPIRY.customer;
    const token = generateToken({ email: user.email, role: user.role }, maxAge);

    res.cookie("cUser", token, getCookieOptions(maxAge));

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (err) {
    console.error("Google create user error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
