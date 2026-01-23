require("dotenv").config();
const express = require("express");
const app = express();
const databaseConnection = require("./models/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Your routers
const Home = require("./routes/Home");
const userRouter = require("./routes/UserRouter");
const productRouter = require("./routes/ProductRouter");
const cartRouter = require("./routes/CartRouter");
const adminRouter = require("./routes/AdminRouter");
const googleAuthRouter = require("./routes/GoogleAuthRouter");
const verifyRouter = require("./routes/verifyRouter");
// Passport + Google OAuth
const passport = require("passport");
require("./config/passport"); // <-- your GoogleStrategy file

const frontendURL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------- Passport session setup -----------
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET || "some-secret", // put in .env for prod
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
// ---------------------------------------------

databaseConnection();

// Your existing routes
app.use("/", Home);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth/google", googleAuthRouter);
app.use("/api/cookie", verifyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
