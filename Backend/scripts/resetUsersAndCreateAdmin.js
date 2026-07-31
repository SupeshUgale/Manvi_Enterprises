const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load backend environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");

const resetUsersAndCreateAdmin = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected.");

    // Delete all existing users
    const deleteResult = await User.deleteMany({});
    console.log(`🗑️ Removed ${deleteResult.deletedCount} existing user(s) from database.`);

    // Create 1 single Admin account
    const adminEmail = process.env.ADMIN_EMAIL || "manvienterprises.official@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Manviadmine@3105";

    const admin = await User.create({
      name: "Manvi Admin",
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      phone: "+91 98765 43210",
      mobile: "+91 98765 43210",
      address: "Shop No 12, Commercial Complex, Sector 4, Main Road, New Delhi, India",
      role: "admin",
      isVerified: true,
    });

    console.log("==========================================");
    console.log("🚀 PRODUCTION ADMIN USER CREATED SUCCESSFULLY");
    console.log("==========================================");
    console.log(`👤 Name:       ${admin.name}`);
    console.log(`📧 Email:      ${admin.email}`);
    console.log(`🔑 Password:   ${adminPassword}`);
    console.log(`🛡️ Role:       ${admin.role}`);
    console.log(`✅ Verified:   ${admin.isVerified}`);
    console.log("==========================================");

    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected. Script complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR running reset script:", error);
    process.exit(1);
  }
};

resetUsersAndCreateAdmin();
