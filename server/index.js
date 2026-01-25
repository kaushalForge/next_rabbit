require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const databaseConnection = require("./models/db");

// Routers
const Home = require("./routes/Home");
const userRouter = require("./routes/UserRouter");
const productRouter = require("./routes/ProductRouter");
const cartRouter = require("./routes/CartRouter");
const adminRouter = require("./routes/AdminRouter");
const googleAuthRouter = require("./routes/GoogleAuthRouter");
const verifyRouter = require("./routes/verifyRouter");

const frontendURL = process.env.FRONTEND_URL;

/* -------------------- MIDDLEWARE -------------------- */

// CORS (must allow credentials for cookies)
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ REQUIRED for Passport (YOU WERE MISSING THIS)
app.use(passport.initialize());
databaseConnection();

/* -------------------- ROUTES -------------------- */
app.use("/", Home);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth/google", googleAuthRouter);
app.use("/api/cookie", verifyRouter);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
