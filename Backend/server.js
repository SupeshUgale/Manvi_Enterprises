const path = require("path");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables. Check Backend/.env before starting the server.");
  process.exit(1);
}

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log("==================================");
    console.log("🚀 Manvi Enterprises Backend");
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    console.log("==================================");
});