# 🚀 Manvi Enterprises Backend

A scalable and production-ready backend for the **Manvi Enterprises** e-commerce platform built using the **MERN Stack**. This backend provides REST APIs for authentication, product management, categories, cart, orders, reviews, and admin operations.

---

## 📌 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Nodemailer (Email OTP)
- Cloudinary (Image Upload)
- Multer
- Express Validator
- Helmet
- Morgan
- Cookie Parser
- CORS
- dotenv

---

## 📂 Project Structure

```text
backend/
│
├── config/
├── constants/
├── controllers/
├── helpers/
├── middleware/
├── models/
├── public/
├── routes/
├── services/
├── uploads/
├── utils/
├── validators/
│
├── .env
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## ✨ Features

- User Authentication
- JWT Authorization
- Email OTP Verification
- User Profile Management
- Category Management
- Product Management
- Shopping Cart
- Wishlist
- Order Management
- Product Reviews
- Contact Form
- Admin Dashboard
- Image Upload using Cloudinary
- Search, Filter & Pagination

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/SupeshUgale/Manvi_Enterprises.git
```

### Navigate to Backend

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root directory and configure:

```env
PORT=4550
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_APP_PASSWORD

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

COOKIE_SECRET=YOUR_COOKIE_SECRET
```

---

## ▶️ Run the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

## 🌐 API Base URL

```
http://localhost:4550
```

---

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/logout
```

### Users

```
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/address
```

### Categories

```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Cart

```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove
DELETE /api/cart/clear
```

### Orders

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/status/:id
```

### Reviews

```
POST   /api/reviews
GET    /api/reviews/:productId
PUT    /api/reviews/:id
DELETE /api/reviews/:id
```

### Admin

```
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/orders
```

---

## 🔒 Authentication

This project uses:

- JWT (JSON Web Token)
- Protected Routes
- Role-Based Authorization
- Secure Cookies

---

## 📤 Image Upload

Images are uploaded using:

- Multer
- Cloudinary

---

## 📚 Learning Objectives

This project demonstrates:

- REST API Development
- MVC Architecture
- MongoDB Relationships
- Authentication & Authorization
- Express Middleware
- Error Handling
- Backend Best Practices

---

## 👨‍💻 Developer

**Supesh Ugale**

Government Polytechnic Gondia

Diploma in Information Technology

MERN Stack Developer

---

## 📄 License

This project is developed for educational and internship purposes.