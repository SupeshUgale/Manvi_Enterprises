const jwt = require("jsonwebtoken");

const generateToken = (id, role = "user") => {
  const secret = process.env.JWT_SECRET || "manvi_enterprises_secret_key_2026";
  return jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

module.exports = generateToken;
