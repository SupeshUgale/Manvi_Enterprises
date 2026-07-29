const generateOTP = require("../utils/generateOTP");

/**
 * OTP Service Helper for generating and tracking one-time passwords
 */
const createOtpSession = (expiresInMinutes = 10) => {
  const otp = generateOTP();
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  return { otp, expiresAt };
};

const isOtpValid = (storedOtp, inputOtp, expiresAt) => {
  if (!storedOtp || !inputOtp || !expiresAt) return false;
  if (Date.now() > expiresAt) return false;
  return String(storedOtp).trim() === String(inputOtp).trim();
};

module.exports = {
  createOtpSession,
  isOtpValid,
};
