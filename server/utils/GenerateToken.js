const jwt = require("jsonwebtoken");

const generateToken = ({ email, role }) => {
  return jwt.sign({ email: email, role: role }, process.env.JWT_KEY, {
    expiresIn: "12h",
  });
};

module.exports.generateToken = generateToken;
