const nodemailer = require("nodemailer");

/**
 * Utility to send transactional emails via Nodemailer with headers optimized for Inbox delivery.
 */
const sendEmail = async (options) => {
  try {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.warn("⚠️ SMTP credentials missing in .env file.");
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const senderEmail = smtpUser;
    const senderName = "Manvi Enterprises";

    const recipient = options.email || options.to;
    if (!recipient) {
      throw new Error("No recipient email address provided.");
    }

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
        "Importance": "Normal",
        "List-Unsubscribe": `<mailto:${senderEmail}?subject=unsubscribe>`,
        "Auto-Submitted": "auto-generated",
        ...options.headers,
      },
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email successfully sent to", recipient, "| MessageID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;