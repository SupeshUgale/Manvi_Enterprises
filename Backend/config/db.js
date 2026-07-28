const mongoose = require("mongoose");
const dns = require("dns");

// Force IPv4 first
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("==================================");
    console.log("✅ MongoDB Atlas Connected");
    console.log(`📂 Database : ${conn.connection.name}`);
    console.log(`🌍 Host     : ${conn.connection.host}`);
    console.log("==================================");
  } catch (error) {
    console.error("==================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    console.error("==================================");
    process.exit(1);
  }
};

module.exports = connectDB;