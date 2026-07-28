const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Manvi Enterprises" <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      replyTo: process.env.SMTP_USER,
      text: options.message,
      html:
        options.html ||
        `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;border:1px solid #e5e7eb;border-radius:10px;padding:30px">
            <h2 style="color:#0f766e;text-align:center;">
                Manvi Enterprises
            </h2>

            <p>Hello,</p>

            <p>Your verification code is:</p>

            <div style="text-align:center;margin:25px 0;">
                <span style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#2563eb;">
                    ${options.otp || ""}
                </span>
            </div>

            <p>This OTP is valid for <b>10 minutes</b>.</p>

            <p>If you didn't request this code, you can safely ignore this email.</p>

            <hr>

            <p style="font-size:12px;color:#777;">
                © ${new Date().getFullYear()} Manvi Enterprises
            </p>
        </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;