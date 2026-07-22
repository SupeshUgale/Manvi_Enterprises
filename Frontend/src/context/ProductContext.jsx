import React, { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../data/Product";

const ProductContext = createContext();

const INITIAL_CATEGORIES = [
  {
    name: "Batteries",
    slug: "Battery",
    count: "8 Products Available",
    desc: "Maintenance-free automotive, inverter, and bike batteries.",
    icon: "BatteryCharging",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Inverters & UPS",
    slug: "Inverter",
    count: "5 Products Available",
    desc: "Pure sine wave home, enterprise, and solar power back-up systems.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Engine Oils & Lube",
    slug: "Engine Oil",
    count: "4 Products Available",
    desc: "Premium synthetic multi-grade engine lubricants and industrial oils.",
    icon: "Droplet",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("manvi_products");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved products:", e);
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("manvi_categories");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved categories:", e);
    }
    return INITIAL_CATEGORIES;
  });

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("manvi_products", JSON.stringify(products));
    } catch (e) {
      console.error("Error saving products:", e);
    }
  }, [products]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("manvi_categories", JSON.stringify(categories));
    } catch (e) {
      console.error("Error saving categories:", e);
    }
  }, [categories]);

  // Add Product
  const addProduct = (newProductData) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
    const formattedProduct = {
      id: newId,
      name: newProductData.name || "New Product",
      category: newProductData.category || "General",
      subCategory: newProductData.subCategory || "General",
      brand: newProductData.brand || "Manvi",
      model: newProductData.model || `MOD-${newId}`,
      capacity: newProductData.capacity || "N/A",
      warranty: newProductData.warranty || "12 Months",
      technology: newProductData.technology || "Standard",
      rating: Number(newProductData.rating) || 4.5,
      reviews: Number(newProductData.reviews) || 1,
      price: Number(newProductData.price) || 0,
      originalPrice: Number(newProductData.originalPrice) || Number(newProductData.price) || 0,
      discount: newProductData.discount ? Number(newProductData.discount) : 0,
      badge: newProductData.badge || "New",
      stock: Number(newProductData.stock) || 10,
      sku: newProductData.sku || `MANVI-PRD-${newId}`,
      description: newProductData.description || "",
      features: Array.isArray(newProductData.features)
        ? newProductData.features
        : (newProductData.features || "").split(",").map((f) => f.trim()).filter(Boolean),
      specifications: newProductData.specifications || {
        warranty: newProductData.warranty || "12 Months",
        brand: newProductData.brand || "Manvi",
      },
      image: newProductData.image || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
      images: [
        newProductData.image || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80"
      ],
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [formattedProduct, ...prev]);
    return formattedProduct;
  };

  // Update Product
  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === Number(id)) {
          return {
            ...p,
            ...updatedData,
            price: updatedData.price !== undefined ? Number(updatedData.price) : p.price,
            originalPrice: updatedData.originalPrice !== undefined ? Number(updatedData.originalPrice) : p.originalPrice,
            stock: updatedData.stock !== undefined ? Number(updatedData.stock) : p.stock,
            rating: updatedData.rating !== undefined ? Number(updatedData.rating) : p.rating,
            features: typeof updatedData.features === "string"
              ? updatedData.features.split(",").map((f) => f.trim()).filter(Boolean)
              : updatedData.features || p.features,
          };
        }
        return p;
      })
    );
  };

  // Delete Product
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  };

  // Add Category
  const addCategory = (categoryData) => {
    const slug = categoryData.slug || categoryData.name.replace(/\s+/g, " ");
    const exists = categories.some((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (exists) {
      throw new Error(`Category "${categoryData.name}" already exists!`);
    }

    const newCategory = {
      name: categoryData.name,
      slug: slug,
      count: categoryData.count || "0 Products",
      desc: categoryData.desc || "High-performance energy and product division.",
      icon: categoryData.icon || "Layers",
      image: categoryData.image || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
    };

    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  // Update Category
  const updateCategory = (slug, updatedData) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.slug === slug) {
          return { ...cat, ...updatedData };
        }
        return cat;
      })
    );
  };

  // Delete Category
  const deleteCategory = (slug) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  // Reset to default inventory
  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem("manvi_products");
    localStorage.removeItem("manvi_categories");
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
