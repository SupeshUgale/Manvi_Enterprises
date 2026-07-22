import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";
import { ShoppingCart, Filter, BatteryCharging, Zap, Droplet, LayoutGrid, Search, Star, Layers } from "lucide-react";

const ICON_MAP = {
  BatteryCharging,
  Zap,
  Droplet,
  Layers,
};

const Products = () => {
  const { products, categories } = useProduct();
  const { cartItems, addToCart } = useCart();
  const location = useLocation();

  // Search & Filter state
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState(15000); // Max Price limit
  const [minRating, setMinRating] = useState("0");
  const [stockOnly, setStockOnly] = useState(false);

  const [isCartMoving, setIsCartMoving] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);

  const dynamicCategories = [
    { label: "All Products", value: "all", icon: LayoutGrid },
    ...categories.map((c) => ({
      label: c.name,
      value: c.slug,
      icon: ICON_MAP[c.icon] || Layers,
    })),
  ];


  // Extract category from URL search query if exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) {
      setActiveCategory(cat);
    }
  }, [location]);

  // Derive cart count from context
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Extract unique brands for brand filter
  const brandsList = ["all", ...new Set(products.map((p) => p.brand))];

  // Filtering products
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    const matchesCategory =
      activeCategory === "all" ||
      product.category === activeCategory ||
      (activeCategory === "Inverter" && (product.category === "Inverter" || product.category === "UPS"));

    // 2. Search query
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Brand Filter
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;

    // 4. Price Limit
    const matchesPrice = product.price <= priceRange;

    // 5. Rating Limit
    const matchesRating = product.rating >= Number(minRating);

    // 6. Stock availability
    const matchesStock = !stockOnly || product.stock > 0;

    return matchesCategory && matchesSearch && matchesBrand && matchesPrice && matchesRating && matchesStock;
  });

  const handleAddToCart = (e, product) => {
    const buttonRect = e.target.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const newItem = {
      id: Date.now(),
      startX,
      startY,
      image: product.image,
    };

    setFlyingItems((prev) => [...prev, newItem]);
    addToCart(product);

    setTimeout(() => {
      setIsCartMoving(true);
    }, 800);

    setTimeout(() => {
      setIsCartMoving(false);
    }, 1400);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#4B5563] py-16 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden font-sans">
      
      {/* Floating Animated Cart Button (Forest Green) */}
      <Link
        to="/cart"
        className={`fixed bottom-6 right-6 z-50 bg-[#2F5D50] hover:bg-[#244A40] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isCartMoving ? "animate-trolley-scoot scale-110" : "hover:scale-105"
        }`}
        title="Go to Cart"
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D4A64A] text-[#1F2937] text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {cartCount}
          </span>
        )}
      </Link>

      {/* Flying Product duplicate animation */}
      {flyingItems.map((item) => (
        <img
          key={item.id}
          src={item.image}
          alt="flying"
          className="fixed pointer-events-none z-50 w-12 h-12 object-contain rounded-full bg-white p-1 border border-[#E5E7EB] shadow-md animate-product-fly"
          style={{
            "--start-x": `${item.startX}px`,
            "--start-y": `${item.startY}px`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#D4A64A] text-xs font-black uppercase tracking-[0.2em] stats-font">
            Energy Catalog
          </span>
          <h1 className="text-4xl font-bold font-heading text-[#1F2937]">Product Catalog</h1>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Explore authentic energy modules, pure sine wave backups, solar setups, and certified lubrication options.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {dynamicCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#2F5D50] text-white shadow-xs"
                    : "bg-[#8FAE9D]/20 text-[#1F2937] hover:bg-[#8FAE9D]/30 border border-[#8FAE9D]/10"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#8FAE9D]"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter Settings Accordion */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-medium">
          {/* Search box */}
          <div className="space-y-2">
            <label className="block text-[#1F2937] font-bold uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]/60" />
              <input
                type="text"
                placeholder="Product name, brand, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl outline-none text-[#1F2937] focus:ring-2 focus:ring-[#2F5D50]/20 transition"
              />
            </div>
          </div>

          {/* Brand dropdown */}
          <div className="space-y-2">
            <label className="block text-[#1F2937] font-bold uppercase tracking-wider">Brand Name</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl outline-none text-[#1F2937] transition capitalize"
            >
              {brandsList.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "all" ? "All Brands" : brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[#1F2937] font-bold uppercase tracking-wider">Max Price Limit</label>
              <span className="font-bold text-[#2F5D50]">₹{priceRange.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#2F5D50] bg-[#E5E7EB] h-1.5 rounded-full outline-none cursor-pointer"
            />
          </div>

          {/* Additional Quick Filter Switches */}
          <div className="flex items-center justify-between gap-4 pt-4 md:pt-0">
            <div className="space-y-2">
              <label className="block text-[#1F2937] font-bold uppercase tracking-wider">Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] focus:border-[#2F5D50] rounded-xl outline-none text-[#1F2937]"
              >
                <option value="0">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.7">4.7+ Stars</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="stockOnly"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#2F5D50] rounded border-[#E5E7EB] focus:ring-[#2F5D50]"
              />
              <label htmlFor="stockOnly" className="text-[#1F2937] font-bold uppercase cursor-pointer">
                In Stock Only
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#8FAE9D]" />
              <h3 className="text-lg font-bold text-[#1F2937] font-heading">No matching products</h3>
              <p className="text-xs text-[#4B5563]/60 max-w-xs mx-auto mt-2">
                Adjust your search queries or slider metrics to view available inventory.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Products;