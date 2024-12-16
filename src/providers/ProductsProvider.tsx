'use client';

import React, { createContext, useState, useContext, useEffect } from "react";
import { useCategories } from "@/providers/CategroiesProvider"

export interface Product {
  id: number | null;
  name: string;
  price?: number;

};

export interface ProductContextType {
  products: Product[] | null;
  productsLoading: boolean;
  setProductsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductsContext = createContext<ProductContextType | null>(null);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const { currentCategory } = useCategories();

  const fetchProducts = async () => {
    fetch(`http://localhost:3200/admin/products?category_id=${currentCategory?.id || ''}`)
      .then(resp => resp.json())
      .then(json => {
        setProducts(json);
        setProductsLoading(false);
      })
      
  };

  useEffect(() => { fetchProducts() }, [currentCategory]);

  return (
    <ProductsContext.Provider value={{ products, productsLoading, setProductsLoading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};