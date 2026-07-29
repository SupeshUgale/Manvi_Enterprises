const { sendContactInquiryEmail } = require("../services/emailService");

// @desc    Submit Contact / Corporate Inquiry Form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number, and message are required.",
      });
    }

    const contactData = {
      name,
      email: email.toLowerCase().trim(),
      phone,
      company: company || "N/A",
      service: service || "General Inquiry",
      message,
    };

    // Send emails asynchronously (acknowledgment to user & lead alert to admin)
    await sendContactInquiryEmail(contactData);

    res.status(200).json({
      success: true,
      message: "Your proposal request has been logged successfully. A confirmation email was sent to your inbox.",
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit contact request.",
    });
  }
};

module.exports = {
  submitContactForm,
};
