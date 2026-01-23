const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

/* ------------------ GOOGLE STRATEGY ------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        // 🔒 Enforce Gmail-only login
        if (!email.endsWith("@gmail.com")) {
          return done(new Error("Only @gmail.com accounts are allowed"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // 🔐 Random password (Google users never use it directly)
          const hashedPassword = await bcrypt.hash(
            Math.random().toString(36).slice(-12),
            10,
          );

          user = await User.create({
            name: profile.displayName,
            email,
            password: hashedPassword,
            avatar: profile.photos?.[0]?.value || "",
            role: "customer",
            authProvider: "google",
            googleId: profile.id,
          });
        } else {
          user.lastLogin = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

/* ------------------ SERIALIZE / DESERIALIZE ------------------ */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
