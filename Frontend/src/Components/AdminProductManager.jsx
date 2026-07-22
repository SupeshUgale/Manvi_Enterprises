import React, { useState, useEffect } from "react";
import { useProduct } from "../context/ProductContext";
import {
  Package, PlusCircle, Edit3, Trash2, Search, Filter, Layers, Check,
  AlertCircle, Sparkles, Image, RefreshCw, X, ShieldCheck, Tag, DollarSign,
  Box, ListCheck, FileText, ArrowRight
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductManager({ initialEditId = null }) {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, resetToDefaults } = useProduct();
  const [activeTab, setActiveTab] = useState("products"); // "products", "categories", "add-product"

  // Search & Filter state for product table
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Modal / Form state for Add or Edit Product
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Form State for Product
  const emptyProductForm = {
    name: "",
    category: categories[0]?.slug || "Battery",
    subCategory: "",
    brand: "",
    model: "",
    capacity: "",
    warranty: "36 Months",
    technology: "Maintenance Free",
    price: "",
    originalPrice: "",
    discount: "0",
    stock: "25",
    sku: "",
    badge: "Popular",
    description: "",
    featuresText: "High Starting Power, Long Service Life, Low Maintenance",
    specVoltage: "12V",
    specCapacity: "",
    specWarranty: "36 Months",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
  };
  const [productForm, setProductForm] = useState(emptyProductForm);

  // Modal / Form state for Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const emptyCategoryForm = {
    name: "",
    slug: "",
    desc: "",
    icon: "BatteryCharging",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
  };
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  // Check if instructed to edit a specific product on mount
  useEffect(() => {
    if (initialEditId) {
      const target = products.find((p) => p.id === Number(initialEditId));
      if (target) {
        handleOpenEditProduct(target);
      }
    }
  }, [initialEditId, products]);

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || "",
      category: prod.category || "Battery",
      subCategory: prod.subCategory || "",
      brand: prod.brand || "",
      model: prod.model || "",
      capacity: prod.capacity || "",
      warranty: prod.warranty || "36 Months",
      technology: prod.technology || "Maintenance Free",
      price: prod.price ? String(prod.price) : "",
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      discount: prod.discount ? String(prod.discount) : "0",
      stock: prod.stock !== undefined ? String(prod.stock) : "10",
      sku: prod.sku || "",
      badge: prod.badge || "Popular",
      description: prod.description || "",
      featuresText: Array.isArray(prod.features) ? prod.features.join(", ") : prod.features || "",
      specVoltage: prod.specifications?.voltage || "12V",
      specCapacity: prod.specifications?.capacity || prod.capacity || "",
      specWarranty: prod.specifications?.warranty || prod.warranty || "36 Months",
      image: prod.image || "",
    });
    setIsProductModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      Swal.fire("Error", "Product Name and Price are required!", "error");
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      subCategory: productForm.subCategory || productForm.category,
      brand: productForm.brand || "Manvi",
      model: productForm.model || `MOD-${Date.now().toString().slice(-4)}`,
      capacity: productForm.capacity || "N/A",
      warranty: productForm.warranty,
      technology: productForm.technology,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
      discount: Number(productForm.discount) || 0,
      stock: Number(productForm.stock) || 0,
      sku: productForm.sku || `MANVI-${Date.now().toString().slice(-6)}`,
      badge: productForm.badge,
      description: productForm.description || "High quality product.",
      features: productForm.featuresText.split(",").map((f) => f.trim()).filter(Boolean),
      specifications: {
        voltage: productForm.specVoltage,
        capacity: productForm.specCapacity || productForm.capacity || "N/A",
        warranty: productForm.specWarranty || productForm.warranty,
        brand: productForm.brand || "Manvi",
      },
      image: productForm.image || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      Swal.fire({
        icon: "success",
        title: "Product Updated!",
        text: `"${productForm.name}" was updated successfully.`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
      });
    } else {
      addProduct(payload);
      Swal.fire({
        icon: "success",
        title: "Product Added!",
        text: `"${productForm.name}" has been added to inventory.`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
      });
    }

    setIsProductModalOpen(false);
    setProductForm(emptyProductForm);
    setEditingProduct(null);
  };

  // Delete Product handler
  const handleDeleteProduct = (id, name) => {
    Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action will remove the product from the catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#8FAE9D",
      confirmButtonText: "Yes, Delete Product",
      cancelButtonText: "Cancel",
      customClass: { popup: "rounded-2xl border shadow-xl" },
    }).then((res) => {
      if (res.isConfirmed) {
        deleteProduct(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product removed.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  // Create Category handler
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      Swal.fire("Error", "Category Name is required!", "error");
      return;
    }

    try {
      addCategory({
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.replace(/\s+/g, " "),
        desc: categoryForm.desc || "Product division",
        icon: categoryForm.icon,
        image: categoryForm.image,
      });

      Swal.fire({
        icon: "success",
        title: "Category Created!",
        text: `Category "${categoryForm.name}" added successfully.`,
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#2F5D50",
      });

      setIsCategoryModalOpen(false);
      setCategoryForm(emptyCategoryForm);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Delete Category handler
  const handleDeleteCategory = (slug, name) => {
    Swal.fire({
      title: `Delete Category "${name}"?`,
      text: "Removing this category will affect category filtering.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#8FAE9D",
      confirmButtonText: "Yes, Delete",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteCategory(slug);
        Swal.fire("Deleted", `Category ${name} was deleted.`, "success");
      }
    });
  };

  // Filter products for table view
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F2937] via-[#2F5D50] to-[#244A40] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#D4A64A] mb-1">
              <ShieldCheck className="w-4 h-4" /> Admin Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">Product & Category Management</h1>
            <p className="text-xs text-[#8FAE9D] mt-1 max-w-xl">
              Add new products, update prices, manage stock, edit technical info, or create new product categories.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleOpenAddProduct}
              className="bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="bg-[#D4A64A] hover:bg-[#b88e39] text-[#1F2937] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Layers className="w-4 h-4" /> Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex border-b border-[#E5E7EB] dark:border-gray-700 gap-4">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "products"
              ? "border-[#2F5D50] text-[#2F5D50] dark:text-[#8FAE9D]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-[#2F5D50] text-[#2F5D50] dark:text-[#8FAE9D]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" /> Categories ({categories.length})
        </button>
        <button
          onClick={resetToDefaults}
          className="ml-auto text-[11px] font-bold text-gray-400 hover:text-rose-500 flex items-center gap-1 transition cursor-pointer"
          title="Reset to default sample inventory"
        >
          <RefreshCw className="w-3 h-3" /> Reset Defaults
        </button>
      </div>

      {/* TAB 1: PRODUCTS LIST TABLE */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {/* Table Filters */}
          <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, brand, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-[#FAFAF8] dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2F5D50]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 text-xs border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-200">
                <thead className="bg-[#FAFAF8] dark:bg-gray-700/50 uppercase text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-[#E5E7EB] dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Brand / Model</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status Info</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-700">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-400">
                        No products found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FAFAF8] dark:bg-gray-700 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 p-1">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-bold text-gray-900 dark:text-white truncate">{p.name}</p>
                              <p className="text-[10px] font-mono text-gray-400 truncate">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#2F5D50] dark:text-[#8FAE9D]">{p.category}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-800 dark:text-gray-200">{p.brand}</p>
                          <p className="text-[10px] text-gray-400">{p.model || "N/A"}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                          ₹{p.price?.toLocaleString("en-IN")}
                          {p.originalPrice > p.price && (
                            <span className="block text-[10px] text-gray-400 line-through font-normal">
                              ₹{p.originalPrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 10
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : p.stock > 0
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4A64A]/10 text-[#D4A64A]">
                            {p.badge || "Standard"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-[#2F5D50]/10 text-[#2F5D50] hover:bg-[#2F5D50] hover:text-white transition cursor-pointer"
                              title="Edit product info"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES LIST */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</h3>
                    <p className="text-[10px] text-[#2F5D50] dark:text-[#8FAE9D] font-mono">Slug: {cat.slug}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.slug, cat.name)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 transition cursor-pointer ml-auto"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 text-xs font-sans space-y-5"
            >
              <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#2F5D50]/10 rounded-xl flex items-center justify-center text-[#2F5D50]">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                      {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
                    </h2>
                    <p className="text-[10px] text-gray-400">Fill in product specs, pricing, stock and details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Amaron Heavy Duty Battery"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2F5D50]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. Amaron, Exide, Castrol, Luminous"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Model / SubCategory
                    </label>
                    <input
                      type="text"
                      value={productForm.model}
                      onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                      placeholder="e.g. AR-60L or Car Battery"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 5999"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Original Price (MRP ₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      placeholder="e.g. 6999"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Available Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="e.g. 30"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      value={productForm.warranty}
                      onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                      placeholder="e.g. 36 Months"
                      className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter detailed description of the product..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Key Features (comma separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.featuresText}
                    onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
                    placeholder="Maintenance Free, High Cranking Power, Long Warranty"
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-3 rounded-xl transition cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save Product Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD CATEGORY */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs font-sans"
            >
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-base font-heading">Add Product Category</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value })}
                    placeholder="e.g. Solar Systems, Bike Accessories"
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Category Description
                  </label>
                  <textarea
                    rows={2}
                    value={categoryForm.desc}
                    onChange={(e) => setCategoryForm({ ...categoryForm, desc: e.target.value })}
                    placeholder="Short summary of this division..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2F5D50] hover:bg-[#244A40] text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs mt-2"
                >
                  Create Category
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
