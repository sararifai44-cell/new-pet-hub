import { useState, useEffect, useCallback } from "react";
import { mockProducts } from "../../../lib/mockData";

const STORAGE_KEY = "pethub_products";

export function useProducts() {
  // ✅ تحميل أولي من localStorage أو من mockProducts
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return mockProducts;
    } catch (e) {
      console.error("Failed to load products from localStorage", e);
      return mockProducts;
    }
  });

  // ✅ كل ما تتغير products نخزنها في localStorage (ما في setState هون)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  }, [products]);

  // ➕ إضافة منتج جديد
  const addProduct = useCallback((productData) => {
    setProducts((prev) => {
      const last = prev[prev.length - 1];
      const nextId = last ? Number(last.id) + 1 : 1;

      const newProduct = {
        id: nextId,
        stock_quantity: 0, // default
        ...productData, // يسمحلك تمرّر stock_quantity لو بدك
      };

      return [...prev, newProduct];
    });
  }, []);

  // ✏️ تحديث منتج (نمرّر كائن كامل فيه id)
  const updateProduct = useCallback((updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(updatedProduct.id)
          ? { ...p, ...updatedProduct }
          : p
      )
    );
  }, []);

  // 🗑️ حذف منتج
  const deleteProduct = useCallback((id) => {
    setProducts((prev) =>
      prev.filter((p) => String(p.id) !== String(id))
    );
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
