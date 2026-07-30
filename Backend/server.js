const path = require("path");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

// Load .env only if running locally (in production, system environment variables are used)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, ".env") });
} else {
  dotenv.config(); // Fallback to default
}

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error(
    "Missing required environment variables (MONGO_URI or JWT_SECRET). Check your environment configuration."
  );
  process.exit(1);
}

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 Manvi Enterprises Backend");
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("==================================");
});