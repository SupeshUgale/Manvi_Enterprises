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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.allSettled([
        productsService.getProducts({ limit: 200 }),
        productsService.getCategories(),
      ]);

      let finalProducts = [];
      let finalCategories = [];

      if (fetchedProducts.status === 'fulfilled') {
        const raw = fetchedProducts.value;
        const list = Array.isArray(raw.products)
          ? raw.products
          : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        finalProducts = list.map(p => ({ ...p, id: p._id || p.id }));
      }

      if (fetchedCategories.status === 'fulfilled') {
        const raw = fetchedCategories.value;
        const list = Array.isArray(raw.categories)
          ? raw.categories
          : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        finalCategories = list;
      }

      // Fallback to static datasets if API results are empty or rejected
      if (finalProducts.length === 0) {
        finalProducts = initialProducts.map(p => ({ ...p, id: p._id || p.id }));
      }
      if (finalCategories.length === 0) {
        finalCategories = INITIAL_CATEGORIES;
      }

      setProducts(finalProducts);
      setCategories(finalCategories);
    } catch (err) {
      console.error('Error fetching catalogue from MongoDB, using fallback:', err);
      setError(err);
      setProducts(initialProducts.map(p => ({ ...p, id: p._id || p.id })));
      setCategories(INITIAL_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products and categories from backend API on mount
  useEffect(() => {
    fetchCatalog();
  }, []);

  // Add Product via API (MongoDB)
  const addProduct = async (newProductData) => {
    const response = await productsService.addProduct(newProductData);
    const added = response.product || response.data || response;
    const normalized = { ...added, id: added._id || added.id };
    setProducts((prev) => [normalized, ...prev]);
    await fetchCatalog();
    return normalized;
  };

  // Update Product via API (MongoDB)
  const updateProduct = async (id, updatedData) => {
    const res = await productsService.updateProduct(id, updatedData);
    const updated = res.product || res.data || updatedData;
    setProducts((prev) =>
      prev.map((p) =>
        (p._id === id || p.id === id || p.id === Number(id))
          ? { ...p, ...updated, id: p._id || p.id }
          : p
      )
    );
    await fetchCatalog();
  };

  // Delete Product via API (MongoDB)
  const deleteProduct = async (id) => {
    await productsService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id && p.id !== Number(id)));
    await fetchCatalog();
  };

  // Add Category via API (MongoDB)
  const addCategory = async (categoryData) => {
    const response = await productsService.addCategory(categoryData);
    const added = response.category || response.data || response;
    setCategories((prev) => [...prev, added]);
    await fetchCatalog();
    return added;
  };

  // Update Category via API (MongoDB)
  const updateCategory = async (slug, updatedData) => {
    await productsService.updateCategory(slug, updatedData);
    setCategories((prev) =>
      prev.map((cat) => (cat.slug === slug ? { ...cat, ...updatedData } : cat))
    );
    await fetchCatalog();
  };

  // Delete Category via API (MongoDB)
  const deleteCategory = async (slug) => {
    await productsService.deleteCategory(slug);
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    await fetchCatalog();
  };

  const resetToDefaults = () => {
    fetchCatalog();
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
