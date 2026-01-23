const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/GenerateToken");
const User = require("../models/user");
const router = express.Router();

/* ------------------ PASSPORT STRATEGY ------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // User doesn't exist → redirect to frontend confirmation page
          const params = new URLSearchParams({
            email,
            name: profile.displayName,
            avatar: profile.photos[0]?.value || "",
            googleId: profile.id,
          }).toString();

          return done(null, false, {
            message: `/auth/confirm-google?${params}`,
          });
        }

        // Update last login timestamp for existing users
        user.lastLogin = new Date();
        await user.save();

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

/* ------------------ SERIALIZE / DESERIALIZE ------------------ */
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* ------------------ ROUTES ------------------ */

// Step 1: Redirect to Google login
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
  }),
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Login failed!`,
  }),
  (req, res) => {
    // If user creation needs confirmation
    if (!req.user && res.req.authInfo?.message) {
      return res.redirect(
        `${process.env.FRONTEND_URL}${res.req.authInfo.message}`,
      );
    }

    const { role, email, name, _id, avatar } = req.user;

    const tokenExpiryMap = {
      admin: 12 * 60 * 60 * 1000,
      moderator: 24 * 60 * 60 * 1000,
      customer: 48 * 60 * 60 * 1000,
    };

    const maxAge = tokenExpiryMap[role] || 48 * 60 * 60 * 1000;
    const sameSite = process.env.NODE_ENV === "production" ? "none" : "lax";

    const token = generateToken({ email, role }, maxAge);

    // ✅ Set cookie
    res.cookie("cUser", token, {
      httpOnly: true,
      secure: false, // production → true
      sameSite,
      path: "/",
      maxAge,
    });

    // ✅ Redirect (OAuth correct flow)
    res.redirect(`${process.env.FRONTEND_URL}/login?message=Login successful!`);
  },
);

// Step 3: Create new user after frontend confirmation
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
    const sameSite = "lax";

    const token = generateToken({ email: user.email, role: user.role }, maxAge);

    res.cookie("cUser", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite,
      path: "/",
      maxAge,
    });

    res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
