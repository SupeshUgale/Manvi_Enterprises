const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");
const generateSlug = require("./helpers/slugGenerator");

// 1. Copy assets from Frontend to Backend public uploads directory
const sourceDir = path.join(__dirname, "../Frontend/src/assets/product");
const targetDir = path.join(__dirname, "public/uploads");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(sourceDir)) {
  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    const srcFile = path.join(sourceDir, file);
    const destFile = path.join(targetDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
  console.log(`📸 Copied ${files.length} product images to Backend /public/uploads`);
}

// Map asset variables from Frontend/src/data/Product.js to static backend paths
const imageMap = {
  amaronBike: "/uploads/amaron_bike.png",
  amaronB1: "/uploads/amrogon_b1.png",
  castrolGTX: "/uploads/CastrolGTX.png",
  castrolMagnatec: "/uploads/CastrolMagnatec.png",
  dreams2Eoil: "/uploads/Dreams2_Eoil.png",
  dreams3Eoil: "/uploads/Dreams3_Eoil.png",
  dreams4Eoil: "/uploads/Dreams4_Eoil.png",
  dreamsEoil: "/uploads/DreamsEoil.png",
  exideGQP850: "/uploads/ExideGQP850.png",
  exideGQP1050: "/uploads/ExideGQP1050.png",
  luminousEcoVoltNeo1050: "/uploads/LuminousEcoVoltNeo1050.png",
  luminousZelio1100: "/uploads/luminousZelio1100.png",
  masterLine1L: "/uploads/MasterLine_1L.jpg",
  masterLineMP3Eoil: "/uploads/MasterLineMP_3Eoil.png",
  powerzoneB1: "/uploads/Powerzone_b1.png",
  powerzoneBike: "/uploads/powerzone_bick.png",
  shellHelixUltra: "/uploads/ShellHelixUltra.png",
};

// Raw product data corresponding to Frontend/src/data/Product.js
const rawProducts = [
  {
    name: "Amaron Car Battery",
    category: "Car Battery",
    subCategory: "Car Battery",
    brand: "Amaron",
    model: "AR60L",
    capacity: "60 Ah",
    warranty: "48 Months",
    technology: "Calcium Maintenance Free",
    rating: 4.8,
    reviews: 156,
    price: 6200,
    actualPrice: 6900,
    discount: 10,
    badge: "Best Seller",
    stock: 40,
    sku: "AMARON-CAR-60AH",
    description: "High-performance maintenance-free Amaron car battery with superior starting power and long service life.",
    features: ["Maintenance Free", "High Cranking Power", "Long Service Life"],
    imageKey: "amaronB1",
  },
  {
    name: "Powerzone Car Battery",
    category: "Car Battery",
    subCategory: "Car Battery",
    brand: "Powerzone",
    model: "PZ65D26R",
    capacity: "65 Ah",
    warranty: "48 Months",
    technology: "Calcium",
    rating: 4.7,
    reviews: 132,
    price: 5900,
    actualPrice: 6600,
    discount: 11,
    badge: "Popular",
    stock: 35,
    sku: "POWERZONE-CAR-65AH",
    description: "Reliable maintenance-free Powerzone battery for all passenger cars.",
    features: ["Maintenance Free", "High Starting Power", "Long Battery Life"],
    imageKey: "powerzoneB1",
  },
  {
    name: "Amaron Bike Battery",
    category: "Bike Battery",
    subCategory: "Bike Battery",
    brand: "Amaron",
    model: "APBTZ5L",
    capacity: "5 Ah",
    warranty: "48 Months",
    technology: "VRLA",
    rating: 4.8,
    reviews: 218,
    price: 1850,
    actualPrice: 2100,
    discount: 12,
    badge: "Top Rated",
    stock: 75,
    sku: "AMARON-BIKE-5AH",
    description: "Premium VRLA bike battery delivering reliable starting performance.",
    features: ["Leak Proof", "Maintenance Free", "Quick Start"],
    imageKey: "amaronBike",
  },
  {
    name: "Powerzone Bike Battery",
    category: "Bike Battery",
    subCategory: "Bike Battery",
    brand: "Powerzone",
    model: "PZ-BTZ5",
    capacity: "5 Ah",
    warranty: "36 Months",
    technology: "VRLA",
    rating: 4.6,
    reviews: 94,
    price: 1550,
    actualPrice: 1800,
    discount: 14,
    badge: "Hot",
    stock: 60,
    sku: "POWERZONE-BIKE-5AH",
    description: "Compact maintenance-free motorcycle battery with dependable performance.",
    features: ["Maintenance Free", "Leak Proof", "Easy Installation"],
    imageKey: "powerzoneBike",
  },
  {
    name: "Castrol GTX Essential 20W-50 Engine Oil",
    category: "Engine Oil",
    subCategory: "Car Engine Oil",
    brand: "Castrol",
    model: "GTX-E-20W50-3L",
    capacity: "3 Litres",
    warranty: "No Warranty",
    technology: "Mineral Oil",
    rating: 4.6,
    reviews: 420,
    price: 1350,
    actualPrice: 1650,
    discount: 18,
    badge: "Value Pack",
    stock: 200,
    sku: "MANVI-OIL-CAS50",
    description: "Provides superior anti-sludge protection to extend your car engine life, keeping the engine channels clean and free-flowing.",
    features: ["Advanced anti-sludge formula", "High thermal stability", "Protects against viscosity breakdown"],
    imageKey: "castrolGTX",
  },
  {
    name: "Castrol Magnatec 5W-30 Full Synthetic Engine Oil",
    category: "Engine Oil",
    subCategory: "Car Engine Oil",
    brand: "Castrol",
    model: "MAG-5W30-3.5L",
    capacity: "3.5 Litres",
    warranty: "No Warranty",
    technology: "Dualock Synthetic Technology",
    rating: 4.8,
    reviews: 512,
    price: 2450,
    actualPrice: 3100,
    discount: 20,
    badge: "Premium",
    stock: 150,
    sku: "MANVI-OIL-CAS30",
    description: "Clinging intelligent molecules provide continuous protection from the exact second you start your car, reducing warm-up wear drastically.",
    features: ["Dualock technology reduces engine wear by 50%", "Maintains peak performance under high stress", "Improves fuel economy"],
    imageKey: "castrolMagnatec",
  },
  {
    name: "Dreams EcoDrive 2 10W-30 4T Bike Engine Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "Dreams",
    model: "DR-ED2-10W30",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Premium Mineral",
    rating: 4.2,
    reviews: 64,
    price: 399,
    actualPrice: 499,
    discount: 20,
    badge: "New Launch",
    stock: 300,
    sku: "MANVI-OIL-DRM02",
    description: "Engineered for smooth gear shifts and enhanced clutch grip in modern commuter motorcycles running in heavy city traffic.",
    features: ["Optimized friction management", "Resists high temperature oxidation", "Keeps engine components clean"],
    imageKey: "dreams2Eoil",
  },
  {
    name: "Dreams EcoDrive 3 20W-40 Premium Engine Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "Dreams",
    model: "DR-ED3-20W40",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Semi-Synthetic",
    rating: 4.3,
    reviews: 72,
    price: 440,
    actualPrice: 550,
    discount: 20,
    badge: "Popular",
    stock: 250,
    sku: "MANVI-OIL-DRM03",
    description: "High-viscosity stability engine oil custom formulated to minimize engine noise and vibrations in cruiser and heavy-duty commuter bikes.",
    features: ["Excellent film strength", "Reduces operational engine noise", "Enhanced wear protection for valve trains"],
    imageKey: "dreams3Eoil",
  },
  {
    name: "Dreams EcoDrive 4 15W-50 Synthetic Blend Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "Dreams",
    model: "DR-ED4-15W50",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Synthetic Blend",
    rating: 4.4,
    reviews: 53,
    price: 499,
    actualPrice: 650,
    discount: 23,
    badge: "Top Rated",
    stock: 180,
    sku: "MANVI-OIL-DRM04",
    description: "Heavy-duty performance synthetic blend formulated specifically for touring motorcycles requiring robust high-temperature stability.",
    features: ["Excellent thermal shear resistance", "Prevents clutch slippage structural issues", "Reduces carbon deposits"],
    imageKey: "dreams4Eoil",
  },
  {
    name: "Dreams Standard 10W-40 4T Engine Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "Dreams",
    model: "DR-STD-10W40",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Mineral Base",
    rating: 4.1,
    reviews: 41,
    price: 375,
    actualPrice: 450,
    discount: 16,
    badge: "Standard",
    stock: 400,
    sku: "MANVI-OIL-DRMSTD",
    description: "Cost-effective everyday engine oil offering uniform lubrication and heat management for entry-level regular commuter bikes.",
    features: ["Uniform operational lubrication film", "Prevents piston ring scuffing", "Affordable maintenance profile"],
    imageKey: "dreamsEoil",
  },
  {
    name: "Exide GQP 850VA Square Wave Inverter",
    category: "Inverter",
    subCategory: "Home Inverter",
    brand: "Exide",
    model: "EX-GQP-850",
    capacity: "850VA",
    warranty: "24 Months",
    technology: "Square Wave",
    rating: 4.3,
    reviews: 148,
    price: 4900,
    actualPrice: 6200,
    discount: 20,
    badge: "Reliable",
    stock: 50,
    sku: "MANVI-INV-EX850",
    description: "Economical home inverter featuring advanced microcontroller-based design to deliver stable backup power during outages.",
    features: ["Microcontroller-based intelligent control", "Fast battery charging cycle", "Smart overload sensing protection"],
    imageKey: "exideGQP850",
  },
  {
    name: "Exide GQP 1050VA Pure Sine Wave Inverter",
    category: "Inverter",
    subCategory: "Home Inverter",
    brand: "Exide",
    model: "EX-GQP-1050",
    capacity: "1050VA",
    warranty: "24 Months",
    technology: "Pure Sine Wave",
    rating: 4.6,
    reviews: 195,
    price: 6499,
    actualPrice: 8200,
    discount: 20,
    badge: "Top Choice",
    stock: 40,
    sku: "MANVI-INV-EX1050",
    description: "Premium pure sine wave inverter ensuring zero humming noise and complete protection for your sensitive home appliances and electronics.",
    features: ["Pure sine wave output protects appliances", "Auto-smart battery charging technology", "Dual-stage short circuit protection"],
    imageKey: "exideGQP1050",
  },
  {
    name: "Luminous Eco Volt Neo 1050 Smart Inverter",
    category: "Inverter",
    subCategory: "Home Inverter",
    brand: "Luminous",
    model: "ECO-VOLT-NEO-1050",
    capacity: "900VA",
    warranty: "24 Months",
    technology: "Pure Sine Wave",
    rating: 4.5,
    reviews: 289,
    price: 6199,
    actualPrice: 7700,
    discount: 19,
    badge: "Best Seller",
    stock: 75,
    sku: "MANVI-INV-LUM1050",
    description: "High-efficiency residential pure sine wave inverter that charges even at low input voltages down to 90V AC.",
    features: ["Supports wide battery profiles (Flat/Tubular)", "Intelligent thermal management", "ECO & UPS dual mode configuration"],
    imageKey: "luminousEcoVoltNeo1050",
  },
  {
    name: "Luminous Zelio+ 1100 Intelligent Home UPS",
    category: "Inverter",
    subCategory: "Home Inverter",
    brand: "Luminous",
    model: "ZELIO-PLUS-1100",
    capacity: "900VA",
    warranty: "24 Months",
    technology: "Pure Sine Wave (Intelligent)",
    rating: 4.7,
    reviews: 342,
    price: 6899,
    actualPrice: 8600,
    discount: 19,
    badge: "Smart Tech",
    stock: 55,
    sku: "MANVI-INV-LUMZELIO",
    description: "Indias most intelligent home UPS featuring a digital display that shows backup and charging time remaining in hours & minutes.",
    features: ["Intelligent LED display dashboard", "Advanced 32-bit processor control", "Safe for sensitive electronic gear"],
    imageKey: "luminousZelio1100",
  },
  {
    name: "MasterLine Performance 1L Premium Engine Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "MasterLine",
    model: "ML-PERF-1L",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Premium Mineral",
    rating: 4.0,
    reviews: 38,
    price: 360,
    actualPrice: 450,
    discount: 20,
    badge: "Value Choice",
    stock: 190,
    sku: "MANVI-OIL-ML01",
    description: "High quality engine lubrication oil tailored to provide uniform heat reduction and reduce engine friction wear profiles.",
    features: ["Stable engine wear protection grids", "Effective carbon deposit cleanup", "Smooth clutch engagement profiles"],
    imageKey: "masterLine1L",
  },
  {
    name: "MasterLine MP3 MaxPower 4T Engine Oil",
    category: "Engine Oil",
    subCategory: "Bike Engine Oil",
    brand: "MasterLine",
    model: "ML-MP3-MAX",
    capacity: "1 Litre",
    warranty: "No Warranty",
    technology: "Semi-Synthetic",
    rating: 4.2,
    reviews: 45,
    price: 425,
    actualPrice: 530,
    discount: 19,
    badge: "New Arrival",
    stock: 140,
    sku: "MANVI-OIL-MLMP3",
    description: "Advanced MP3 formulation helps unleash engine power by reducing drag and maximizing torque output seamlessly.",
    features: ["Active engine power additive packages", "Excellent high shear stabilization", "Corrosion resistant protection film"],
    imageKey: "masterLineMP3Eoil",
  },
  {
    name: "Powerzone DIN60 Premium Car Battery",
    category: "Car Battery",
    subCategory: "Four Wheeler Battery",
    brand: "Powerzone",
    model: "PZ-DIN60-L",
    capacity: "60Ah",
    warranty: "48 Months",
    technology: "Calcium-Silver Alloy",
    rating: 4.4,
    reviews: 132,
    price: 5499,
    actualPrice: 6900,
    discount: 20,
    badge: "Heavy Duty",
    stock: 45,
    sku: "MANVI-CAR-PZ60",
    description: "High cranking performance maintenance-free car battery engineered by Amara Raja to suit demanding luxury passenger vehicles.",
    features: ["High cold cranking amp capacity", "Patented silver alloy grid tech", "Factory filled and factory sealed"],
    imageKey: "powerzoneB1",
  },
  {
    name: "Powerzone 2.5LC Motorcycle VRLA Battery",
    category: "Bike Battery",
    subCategory: "VRLA Battery",
    brand: "Powerzone",
    model: "PZ-2.5LC",
    capacity: "2.5Ah",
    warranty: "24 Months",
    technology: "VRLA Maintenance Free",
    rating: 4.3,
    reviews: 178,
    price: 950,
    actualPrice: 1200,
    discount: 20,
    badge: "Value Pick",
    stock: 160,
    sku: "MANVI-BIK-PZ2.5",
    description: "Reliable entry-level bike battery offering high safety standards and reliable start triggers for economy commuter bikes.",
    features: ["Gas recombination system features", "Absorbent Glass Mat technology design", "Leak-proof performance casing"],
    imageKey: "powerzoneBike",
  },
  {
    name: "Shell Helix Ultra 5W-40 Fully Synthetic Motor Oil",
    category: "Engine Oil",
    subCategory: "Car Engine Oil",
    brand: "Shell",
    model: "HELIX-ULTRA-4L",
    capacity: "4 Litres",
    warranty: "No Warranty",
    technology: "PurePlus Technology (Gas-to-Liquid)",
    rating: 4.9,
    reviews: 642,
    price: 3450,
    actualPrice: 4500,
    discount: 23,
    badge: "Premium Plus",
    stock: 95,
    sku: "MANVI-OIL-SHL4L",
    description: "Top-tier fully synthetic engine oil manufactured from natural gas, delivering ultimate engine cleanliness and superior wear protection.",
    features: ["Formulated from natural gas pure base", "Unsurpassed sludge build-up defenses", "Excellent extreme cold start flow properties"],
    imageKey: "shellHelixUltra",
  },
];

const seedData = async () => {
  try {
    console.log("🔌 Connecting to MongoDB cluster...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected.");

    // Clear existing products, categories, and users
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log("🗑️ Cleared existing products, categories, and users from MongoDB.");

    // Create 1 Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@manvienterprises.com",
      password: "Admin@123456",
      phone: "+91 98765 43210",
      mobile: "+91 98765 43210",
      address: "Shop No 12, Commercial Complex, Sector 4, Main Road, New Delhi, India",
      role: "admin",
    });
    console.log(`👤 Created Single Admin User: ${adminUser.email}`);

    // Unique Categories list
    const categoryNames = [
      "Car Battery",
      "Bike Battery",
      "Engine Oil",
      "Inverter",
      "Solar Panel",
      "Battery Accessories",
    ];

    const categoryDocs = await Category.insertMany(
      categoryNames.map((name) => ({
        name,
        slug: generateSlug(name),
        description: `High-quality ${name} solutions from Manvi Enterprises`,
        isActive: true,
      }))
    );
    console.log(`✅ Seeded ${categoryDocs.length} Categories.`);

    // Seed Products
    const productsToInsert = rawProducts.map((p) => {
      const imgPath = imageMap[p.imageKey] || "/uploads/amrogon_b1.png";
      return {
        name: p.name,
        category: p.category,
        subCategory: p.subCategory,
        brand: p.brand,
        capacity: p.capacity,
        warranty: p.warranty,
        stock: p.stock || 20,
        price: p.price,
        actualPrice: p.actualPrice,
        discount: p.discount,
        badge: p.badge || "",
        sku: p.sku || "",
        description: p.description,
        features: p.features || [],
        image: imgPath,
        images: [imgPath],
      };
    });

    const seededProducts = await Product.insertMany(productsToInsert);
    console.log(`🚀 Successfully Seeded ${seededProducts.length} Products into MongoDB!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
