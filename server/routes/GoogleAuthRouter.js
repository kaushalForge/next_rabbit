const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { generateToken } = require("../utils/GenerateToken");
const User = require("../models/user");

const router = express.Router();

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

        // ❌ User not found → send to frontend confirmation
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

        // ✅ Update last login
        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// STEP 1 → Redirect to Google
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  }),
);

// STEP 2 → Google Callback
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Login failed!`,
  }),
  (req, res) => {
    if (!req.user && res.req.authInfo?.message) {
      return res.redirect(
        `${process.env.FRONTEND_URL}${res.req.authInfo.message}`,
      );
    }

    const { role, email } = req.user;

    const tokenExpiryMap = {
      admin: 12 * 60 * 60 * 1000,
      moderator: 24 * 60 * 60 * 1000,
      customer: 48 * 60 * 60 * 1000,
    };

    const maxAge = tokenExpiryMap[role] || 48 * 60 * 60 * 1000;

    const token = generateToken({ email, role }, maxAge);

    // ✅ COOKIE (PRODUCTION SAFE)
    res.cookie("cUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge,
    });

    // ✅ Redirect back to frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?message=Login Successful!`,
    );
  },
);

// STEP 3 → Create user after confirmation
router.post("/create", async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = await User.create({
      name,
      email,
      role: "customer",
      avatar,
      googleId,
      authProvider: "google",
    });

    const maxAge = 48 * 60 * 60 * 1000;

    const token = generateToken({ email: user.email, role: user.role }, maxAge);

    res.cookie("cUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
