const sendEmail = require("../utils/sendEmail");

// Company metadata for email footers
const COMPANY = {
  name: "Manvi Enterprises",
  tagline: "Your Trusted Partner for Batteries, Inverters & Power Solutions",
  address: "Shop No 12, Commercial Complex, Sector 4, Main Road, New Delhi, India",
  phone: "+91 98765 43210",
  email: "manvienterprises.official@gmail.com",
};

/**
 * Common HTML Wrapper to ensure standards compliance & avoid Spam filters
 */
const getBaseHtmlWrapper = (title, bodyContent) => {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #333333; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f6f8; padding: 30px 0; }
        .main-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0f766e 0%, #042f2e 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
        .header p { margin: 5px 0 0 0; font-size: 12px; opacity: 0.85; }
        .content { padding: 35px 30px; line-height: 1.6; color: #475569; }
        .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer a { color: #0f766e; text-decoration: none; }
        .btn { display: inline-block; padding: 12px 28px; background-color: #0f766e; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 15px; }
        .otp-box { background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table th, .info-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .info-table th { background-color: #f8fafc; color: #1e293b; font-weight: 600; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <div class="main-container">
                        <!-- Header -->
                        <div class="header">
                            <h1>${COMPANY.name}</h1>
                            <p>${COMPANY.tagline}</p>
                        </div>
                        
                        <!-- Content -->
                        <div class="content">
                            ${bodyContent}
                        </div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <p><strong>${COMPANY.name}</strong></p>
                            <p>${COMPANY.address}</p>
                            <p>Phone: ${COMPANY.phone} | Email: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p>
                            <p style="margin-top: 15px; font-size: 11px; color: #94a3b8;">
                                © ${currentYear} ${COMPANY.name}. All rights reserved.<br>
                                You received this transactional email regarding your account or order activity.
                            </p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};

/**
 * 1. Send Registration / Authentication OTP
 */
const sendOtpEmail = async (email, otp, name = "Valued Customer") => {
  const subject = `Your Security Verification Code - ${COMPANY.name}`;
  
  const text = `Hello ${name},\n\nYour One-Time Password (OTP) for account verification at ${COMPANY.name} is: ${otp}\n\nThis code is valid for 10 minutes.\nIf you did not request this verification code, please ignore this email.\n\nRegards,\n${COMPANY.name} Team`;

  const bodyContent = `
    <h2 style="color: #0f766e; margin-top: 0;">Account Verification</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for connecting with <strong>${COMPANY.name}</strong>. Please use the verification code below to complete your registration or login:</p>
    
    <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #166534;">Valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
    </div>
    
    <p>If you did not request this code, you can safely disregard this message.</p>
    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Team</strong></p>
  `;

  const html = getBaseHtmlWrapper(subject, bodyContent);

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * 2. Send Welcome Email after successful Registration
 */
const sendWelcomeEmail = async (email, name = "Customer") => {
  const subject = `Welcome to ${COMPANY.name}!`;

  const text = `Hello ${name},\n\nWelcome to ${COMPANY.name}! Your account has been verified successfully. Explore top automotive batteries, inverters, and power backup solutions on our portal.\n\nBest regards,\n${COMPANY.name} Team`;

  const bodyContent = `
    <h2 style="color: #0f766e; margin-top: 0;">Welcome to ${COMPANY.name}! 🎉</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We are delighted to welcome you to <strong>${COMPANY.name}</strong>. Your account has been verified and activated successfully.</p>
    <p>You can now seamlessly browse our complete range of high-performance tubular batteries, home inverters, UPS systems, and automotive lubricants.</p>
    
    <div style="text-align: center; margin: 25px 0;">
        <a href="${process.env.CLIENT_URL || '#'}" class="btn">Explore Our Catalog</a>
    </div>

    <p>If you need any support or corporate quotes, feel free to reply to this email or call our hotline.</p>
    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Team</strong></p>
  `;

  const html = getBaseHtmlWrapper(subject, bodyContent);

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * 3. Send Order Confirmation Email
 */
const sendOrderConfirmationEmail = async (email, order) => {
  const subject = `Order Confirmed #${order.orderId || order._id} - ${COMPANY.name}`;

  const itemsListText = (order.products || [])
    .map((p) => `- ${p.name} (Qty: ${p.quantity}) - ₹${p.price * p.quantity}`)
    .join("\n");

  const text = `Hello ${order.customer?.name || "Customer"},\n\nThank you for your order with ${COMPANY.name}!\n\nOrder ID: ${order.orderId || order._id}\nTotal Amount: ₹${order.totalAmount}\nPayment Method: ${order.paymentMethod}\nStatus: ${order.orderStatus}\n\nItems:\n${itemsListText}\n\nShipping Address:\n${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}\n\nWe will process and ship your order promptly.\n\nRegards,\n${COMPANY.name}`;

  const itemsHtml = (order.products || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const bodyContent = `
    <h2 style="color: #0f766e; margin-top: 0;">Order Confirmation</h2>
    <p>Hello <strong>${order.customer?.name || "Customer"}</strong>,</p>
    <p>Thank you for your purchase! We have received your order <strong>#${order.orderId || order._id}</strong> and are preparing it for dispatch.</p>
    
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px 0;"><strong>Order ID:</strong> #${order.orderId || order._id}</p>
        <p style="margin: 0 0 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}</p>
        <p style="margin: 0 0 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod || "COD"}</p>
        <p style="margin: 0;"><strong>Payment Status:</strong> <span style="color: #16a34a; font-weight: bold;">${order.paymentStatus || "Pending"}</span></p>
    </div>

    <h3>Order Summary</h3>
    <table class="info-table">
        <thead>
            <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHtml}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" style="text-align: right; font-weight: bold; padding: 12px 10px;">Grand Total:</td>
                <td style="text-align: right; font-weight: bold; font-size: 16px; color: #0f766e; padding: 12px 10px;">
                    ₹${(order.totalAmount || 0).toLocaleString("en-IN")}
                </td>
            </tr>
        </tfoot>
    </table>

    <h3>Shipping Address</h3>
    <p style="background-color: #fafafa; padding: 12px; border-radius: 6px; border: 1px solid #f0f0f0;">
        <strong>${order.customer?.name || ""}</strong><br>
        ${order.shippingAddress?.address || ""}<br>
        ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}<br>
        Phone: ${order.customer?.phone || ""}
    </p>

    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Team</strong></p>
  `;

  const html = getBaseHtmlWrapper(subject, bodyContent);

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * 4. Send Order Status Update Email
 */
const sendOrderStatusUpdateEmail = async (email, order) => {
  const subject = `Order #${order.orderId || order._id} Status Update: ${order.orderStatus} - ${COMPANY.name}`;

  const text = `Hello ${order.customer?.name || "Customer"},\n\nYour order #${order.orderId || order._id} status has been updated to: ${order.orderStatus}.\nPayment Status: ${order.paymentStatus || "Pending"}\n\nThank you for choosing ${COMPANY.name}.`;

  const bodyContent = `
    <h2 style="color: #0f766e; margin-top: 0;">Order Status Update</h2>
    <p>Hello <strong>${order.customer?.name || "Customer"}</strong>,</p>
    <p>The status of your order <strong>#${order.orderId || order._id}</strong> has been updated.</p>

    <div style="text-align: center; margin: 25px 0; padding: 20px; background-color: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
        <span style="font-size: 14px; text-transform: uppercase; color: #166534; font-weight: bold;">Current Status</span>
        <div style="font-size: 28px; font-weight: bold; color: #0f766e; margin-top: 5px;">${order.orderStatus}</div>
    </div>

    <p><strong>Payment Status:</strong> ${order.paymentStatus || "Pending"}</p>
    <p><strong>Total Amount:</strong> ₹${(order.totalAmount || 0).toLocaleString("en-IN")}</p>

    <p>If you have any questions regarding your delivery or installation, please don't hesitate to reach out to our team.</p>
    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Team</strong></p>
  `;

  const html = getBaseHtmlWrapper(subject, bodyContent);

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * 5. Send Password Reset OTP Email
 */
const sendPasswordResetEmail = async (email, otp, name = "User") => {
  const subject = `Password Reset Request - ${COMPANY.name}`;

  const text = `Hello ${name},\n\nYou requested a password reset for your account at ${COMPANY.name}. Your verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\nIf you did not request a password reset, please ignore this email.`;

  const bodyContent = `
    <h2 style="color: #0f766e; margin-top: 0;">Password Reset Request</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We received a request to reset your password for your <strong>${COMPANY.name}</strong> account.</p>

    <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #166534;">Valid for <strong>10 minutes</strong>.</p>
    </div>

    <p>If you did not request a password reset, please ignore this message or contact customer support if you have security concerns.</p>
    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Security Team</strong></p>
  `;

  const html = getBaseHtmlWrapper(subject, bodyContent);

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * 6. Send Contact Inquiry Notification to Admin & Confirmation to Customer
 */
const sendContactInquiryEmail = async (contactData) => {
  const { name, email, phone, company, service, message } = contactData;

  // 1. Email to Customer acknowledging receipt
  const customerSubject = `Inquiry Received - ${COMPANY.name}`;
  const customerText = `Hello ${name},\n\nThank you for reaching out to ${COMPANY.name}. We have received your inquiry regarding "${service}". Our team will contact you within 24 hours.\n\nRegards,\n${COMPANY.name}`;

  const customerBody = `
    <h2 style="color: #0f766e; margin-top: 0;">We Received Your Inquiry</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for reaching out to <strong>${COMPANY.name}</strong>. We have successfully logged your inquiry regarding <strong>${service}</strong>.</p>
    <p>Our technical team will review your requirement and reach out to you within 24 business hours.</p>

    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0f766e;">
        <p style="margin: 0 0 5px 0;"><strong>Category:</strong> ${service}</p>
        <p style="margin: 0;"><strong>Your Message:</strong> "${message}"</p>
    </div>

    <br>
    <p>Best regards,<br><strong>${COMPANY.name} Desk</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: customerSubject,
    text: customerText,
    html: getBaseHtmlWrapper(customerSubject, customerBody),
  });

  // 2. Email to Admin notifying about new lead
  if (process.env.SMTP_USER) {
    const adminSubject = `[NEW INQUIRY] Lead from ${name} - ${service}`;
    const adminText = `New Lead Received:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company || "N/A"}\nCategory: ${service}\nMessage: ${message}`;
    const adminBody = `
      <h2 style="color: #0f766e; margin-top: 0;">New Proposal / Contact Lead</h2>
      <table class="info-table">
        <tr><th>Name</th><td>${name}</td></tr>
        <tr><th>Email</th><td>${email}</td></tr>
        <tr><th>Phone</th><td>${phone}</td></tr>
        <tr><th>Company</th><td>${company || "N/A"}</td></tr>
        <tr><th>Category</th><td>${service}</td></tr>
        <tr><th>Message</th><td>${message}</td></tr>
      </table>
    `;
    try {
      await sendEmail({
        to: process.env.SMTP_USER,
        subject: adminSubject,
        text: adminText,
        html: getBaseHtmlWrapper(adminSubject, adminBody),
      });
    } catch (err) {
      console.error("Admin notification email failed:", err.message);
    }
  }
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
  sendContactInquiryEmail,
};
