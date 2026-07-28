const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

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