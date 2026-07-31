const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");
const Category = require("../models/Category");

const PRODUCT_IMAGE_MAP = {
  "amaron car battery": "/product/amrogon_b1.png",
  "powerzone car battery": "/product/Powerzone_b1.png",
  "amaron bike battery": "/product/amaron_bike.png",
  "powerzone bike battery": "/product/powerzone_bick.png",
  "castrol gtx essential 20w-50 engine oil": "/product/CastrolGTX.png",
  "castrol magnatec 5w-30 full synthetic engine oil": "/product/CastrolMagnatec.png",
  "dreams ecodrive 2 10w-30 4t bike engine oil": "/product/Dreams2_Eoil.png",
  "dreams ecodrive 3 20w-40 premium engine oil": "/product/Dreams3_Eoil.png",
  "dreams ecodrive 4 15w-50 synthetic blend oil": "/product/Dreams4_Eoil.png",
  "dreams standard 10w-40 4t engine oil": "/product/DreamsEoil.png",
  "exide gqp 850va square wave inverter": "/product/ExideGQP850.png",
  "exide gqp 1050va pure sine wave inverter": "/product/ExideGQP1050.png",
  "luminous eco volt neo 1050 smart inverter": "/product/LuminousEcoVoltNeo1050.png",
  "luminous zelio+ 1100 intelligent home ups": "/product/luminousZelio1100.png",
  "masterline performance 1l premium engine oil": "/product/MasterLine_1L.jpg",
  "masterline mp3 maxpower 4t engine oil": "/product/MasterLineMP_3Eoil.png",
  "powerzone din60 premium car battery": "/product/Powerzone_b1.png",
  "powerzone 2.5lc motorcycle vrla battery": "/product/powerzone_bick.png",
  "shell helix ultra 5w-40 fully synthetic motor oil": "/product/ShellHelixUltra.png",
};

const CATEGORY_IMAGE_MAP = {
  "car battery": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
  "bike battery": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
  "car-battery": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
  "bike-battery": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
  "battery": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
  "inverter": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
  "inverters & ups": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
  "engine oil": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
  "engine oil & lube": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
  "engine-oil": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
  "solar panel": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  "solar-panel": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  "battery accessories": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
  "battery-accessories": "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
};

const fixAllImages = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected.");

    // Fix Product Images
    const products = await Product.find();
    console.log(`📦 Auditing ${products.length} products in DB...`);

    for (const p of products) {
      const nameKey = p.name.toLowerCase().trim();
      const mappedImg = PRODUCT_IMAGE_MAP[nameKey] || p.image || "/product/amrogon_b1.png";
      p.image = mappedImg;
      if (!p.images || p.images.length === 0 || p.images[0] !== mappedImg) {
        p.images = [mappedImg];
      }
      await p.save();
      console.log(`📸 Fixed Product Image: [${p.name}] -> ${mappedImg}`);
    }

    // Fix Category Images
    const categories = await Category.find();
    console.log(`📁 Auditing ${categories.length} categories in DB...`);

    for (const c of categories) {
      const slugKey = (c.slug || c.name).toLowerCase().trim();
      const mappedImg = CATEGORY_IMAGE_MAP[slugKey] || CATEGORY_IMAGE_MAP[c.name.toLowerCase().trim()] || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80";
      c.img = mappedImg;
      await c.save();
      console.log(`🖼️ Fixed Category Image: [${c.name}] -> ${mappedImg}`);
    }

    console.log("==========================================");
    console.log("🎉 ALL PRODUCT AND CATEGORY IMAGES FIXED!");
    console.log("==========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Fix script error:", err);
    process.exit(1);
  }
};

fixAllImages();
