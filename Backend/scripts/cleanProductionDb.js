const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const cleanProductionDb = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected.");

    // 1. Delete all test orders
    const deletedOrders = await Order.deleteMany({});
    console.log(`🗑️ Removed ${deletedOrders.deletedCount} test order(s) from database.`);

    // 2. Delete all test carts
    const deletedCarts = await Cart.deleteMany({});
    console.log(`🗑️ Removed ${deletedCarts.deletedCount} test cart(s) from database.`);

    // 3. Delete all non-admin users
    const adminEmail = (process.env.ADMIN_EMAIL || "manvienterprises.official@gmail.com").toLowerCase().trim();
    const deletedUsers = await User.deleteMany({ email: { $ne: adminEmail } });
    console.log(`🗑️ Removed ${deletedUsers.deletedCount} test user(s) from database.`);

    // 4. Ensure single Admin user exists with exact credentials
    let admin = await User.findOne({ email: adminEmail });
    const adminPassword = process.env.ADMIN_PASSWORD || "Manviadmine@3105";

    if (!admin) {
      console.log("➕ Admin user not found. Creating production admin account...");
      admin = await User.create({
        name: "Manvi Admin",
        email: adminEmail,
        password: adminPassword,
        phone: "+91 98765 43210",
        mobile: "+91 98765 43210",
        address: "Shop No 12, Commercial Complex, Sector 4, Main Road, New Delhi, India",
        role: "admin",
        isVerified: true,
      });
    } else {
      admin.password = adminPassword;
      admin.role = "admin";
      admin.isVerified = true;
      await admin.save();
      console.log("✅ Admin account password & role verified.");
    }

    console.log("==========================================");
    console.log("🚀 PRODUCTION DATABASE CLEANED & READY");
    console.log("==========================================");
    console.log(`👤 Admin Name:     ${admin.name}`);
    console.log(`📧 Admin Email:    ${admin.email}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    console.log(`🛡️ Admin Role:     ${admin.role}`);
    console.log(`✅ Admin Verified: ${admin.isVerified}`);
    console.log("==========================================");

    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected. Production DB clean.");
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR running clean script:", error);
    process.exit(1);
  }
};

cleanProductionDb();
