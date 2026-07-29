const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();


// ================================
// TRUST PROXY (Render)
// ================================

app.set("trust proxy", 1);


// ================================
// BODY PARSER
// ================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// ================================
// CORS CONFIGURATION
// ================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://manvienterprises.netlify.app",
];


app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman, mobile apps, server requests
      if (!origin) {
        return callback(null, true);
      }


      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      return callback(
        new Error("CORS Error: Origin not allowed")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ================================
// SECURITY
// ================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);


app.use(cookieParser());


// ================================
// LOGGER
// ================================

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// ================================
// STATIC FILES
// ================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "public/uploads")
  )
);


// ================================
// TEST API
// ================================

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "🚀 Welcome to Manvi Enterprises API",

    version: "1.0.0",

  });

});


// ================================
// API ROUTES
// ================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);


// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message:
      `Route '${req.originalUrl}' not found.`,

  });

});


// ================================
// ERROR HANDLER
// ================================

app.use(errorHandler);


module.exports = app;