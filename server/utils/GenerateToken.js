const jwt = require("jsonwebtoken");

const generateToken = (userId, expiresIn) => {
  // fallback to 48h if invalid
  const validExpiries = ["12h", "24h", "48h"];
  if (!validExpiries.includes(expiresIn)) {
    expiresIn = "48h";
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_KEY,
    { expiresIn }, // now guaranteed valid string
  );
};

module.exports.generateToken = generateToken;
