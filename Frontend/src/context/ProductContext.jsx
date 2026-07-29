import React, { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../data/Product";
import { productsService } from "../api/products";

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
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedCategories] = await Promise.allSettled([
          productsService.getProducts({ limit: 200 }),
          productsService.getCategories(),
        ]);

        if (isMounted) {
          if (fetchedProducts.status === 'fulfilled') {
            const raw = fetchedProducts.value;
            const list = Array.isArray(raw.products)
              ? raw.products
              : Array.isArray(raw.data)
              ? raw.data
              : Array.isArray(raw)
              ? raw
              : null;
            if (list && list.length > 0) {
              // Normalize _id → id for frontend consistency
              const normalized = list.map(p => ({ ...p, id: p._id || p.id }));
              setProducts(normalized);
            }
          }
          if (fetchedCategories.status === 'fulfilled') {
            const raw = fetchedCategories.value;
            const list = Array.isArray(raw.categories)
              ? raw.categories
              : Array.isArray(raw.data)
              ? raw.data
              : Array.isArray(raw)
              ? raw
              : null;
            if (list && list.length > 0) {
              setCategories(list);
            }
          }
        }
      } catch (err) {
        console.warn('Backend products endpoint offline. Using default catalogue:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => { isMounted = false; };
  }, []);

  // Add Product via API
  const addProduct = async (newProductData) => {
    try {
      const response = await productsService.addProduct(newProductData);
      const added = response.product || response;
      setProducts((prev) => [added, ...prev]);
      return added;
    } catch (err) {
      console.warn("Backend addProduct call failed, performing optimistic local update:", err);
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
    }
  };

  // Update Product via API
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await productsService.updateProduct(id, updatedData);
      const updated = res.product || res.data || updatedData;
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === id || p.id === id || p.id === Number(id))
            ? { ...p, ...updated, id: p._id || p.id }
            : p
        )
      );
    } catch (err) {
      console.warn('Backend updateProduct failed, applying local update:', err);
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === id || p.id === id || p.id === Number(id)) {
            return {
              ...p,
              ...updatedData,
              price: updatedData.price !== undefined ? Number(updatedData.price) : p.price,
              actualPrice: updatedData.actualPrice !== undefined ? Number(updatedData.actualPrice) : p.actualPrice,
              stock: updatedData.stock !== undefined ? Number(updatedData.stock) : p.stock,
            };
          }
          return p;
        })
      );
    }
  };

  // Delete Product via API
  const deleteProduct = async (id) => {
    try {
      await productsService.deleteProduct(id);
    } catch (err) {
      console.warn('Backend deleteProduct failed, applying local delete:', err);
    }
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id && p.id !== Number(id)));
  };

  // Add Category via API
  const addCategory = async (categoryData) => {
    try {
      const response = await productsService.addCategory(categoryData);
      const added = response.category || response;
      setCategories((prev) => [...prev, added]);
      return added;
    } catch (err) {
      const slug = categoryData.slug || categoryData.name.replace(/\s+/g, "-").toLowerCase();
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
    }
  };

  // Update Category via API
  const updateCategory = async (slug, updatedData) => {
    try {
      await productsService.updateCategory(slug, updatedData);
    } catch (err) {
      console.warn("Backend updateCategory failed:", err);
    }
    setCategories((prev) =>
      prev.map((cat) => (cat.slug === slug ? { ...cat, ...updatedData } : cat))
    );
  };

  // Delete Category via API
  const deleteCategory = async (slug) => {
    try {
      await productsService.deleteCategory(slug);
    } catch (err) {
      console.warn("Backend deleteCategory failed:", err);
    }
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCategories(INITIAL_CATEGORIES);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
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
