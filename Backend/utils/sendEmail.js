const nodemailer = require("nodemailer");

/**
 * Helper to create Nodemailer transport with timeouts
 */
const createTransporter = (host, port, user, pass) => {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // Force IPv4 - Render & many cloud hosts block IPv6 outbound causing ENETUNREACH
    family: 4,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
};

/**
 * Utility to send transactional emails via Nodemailer with dual-port fallback optimized for Cloud Hosts.
 */
const sendEmail = async (options) => {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpUser = process.env.SMTP_USER || "manvienterprises.official@gmail.com";
  const rawPass = process.env.SMTP_PASS || "oxwb ufsr egza frwx";
  const smtpPass = rawPass.replace(/\s+/g, "");

  // Port 465 (SSL) works best on cloud hosts like Render/Vercel/AWS where port 587 is often blocked
  const primaryPort = Number(process.env.SMTP_PORT) || 465;
  const fallbackPort = primaryPort === 465 ? 587 : 465;

  const recipient = options.email || options.to;
  if (!recipient) {
    throw new Error("No recipient email address provided.");
  }

  const senderName = "Manvi Enterprises";
  const senderEmail = smtpUser;

  // Default plain text fallback if not provided
  const plainTextBody =
    options.text ||
    options.message ||
    (options.otp
      ? `Your OTP is ${options.otp}. Valid for 10 minutes.`
      : "Thank you for connecting with Manvi Enterprises.");

  // Default HTML if not provided
  const htmlBody =
    options.html ||
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${options.subject || "Manvi Enterprises Notification"}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
    <h2 style="color: #0f766e; text-align: center;">Manvi Enterprises</h2>
    <p>Hello,</p>
    <p>${plainTextBody}</p>
    ${
      options.otp
        ? `<div style="text-align: center; margin: 25px 0;"><span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #15803d; background: #f0fdf4; padding: 10px 20px; border-radius: 8px; display: inline-block;">${options.otp}</span></div>`
        : ""
    }
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #777; text-align: center;">© ${new Date().getFullYear()} Manvi Enterprises. All rights reserved.</p>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: recipient,
    subject: options.subject || "Notification from Manvi Enterprises",
    replyTo: senderEmail,
    text: plainTextBody,
    html: htmlBody,
    headers: {
      "X-Mailer": "Manvi Enterprises Express Server",
      "X-Priority": "3 (Normal)",
      "X-MSMail-Priority": "Normal",
      Importance: "Normal",
      "List-Unsubscribe": `<mailto:${senderEmail}?subject=unsubscribe>`,
      "Auto-Submitted": "auto-generated",
      ...options.headers,
    },
  };

  // Dual-port attempt: try primary port (465 SSL), if blocked/times out, try fallback (587 STARTTLS)
  try {
    const transporter = createTransporter(smtpHost, primaryPort, smtpUser, smtpPass);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${recipient} via port ${primaryPort} | MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (primaryError) {
    console.warn(`⚠️ Primary SMTP attempt (port ${primaryPort}) failed: ${primaryError.message}. Retrying via fallback port ${fallbackPort}...`);
    try {
      const fallbackTransporter = createTransporter(smtpHost, fallbackPort, smtpUser, smtpPass);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`✅ Email successfully sent to ${recipient} via fallback port ${fallbackPort} | MessageID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (fallbackError) {
      console.error("❌ Email Error (Both SMTP ports 465 & 587 failed):", fallbackError.message);
      throw new Error(`Email delivery failed: ${fallbackError.message}`);
    }
  }
};

module.exports = sendEmail;