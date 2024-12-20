'use client';

import React, { createContext, useState, useContext, useEffect } from "react";
import { useCategories } from "@/providers/CategroiesProvider"

export type CategoryTag = { id: number; name: string; }

export interface Product {
  id: number | null;
  name: string;
  price: number;
  image_url: string | null;
  image_thumb_url: string | null;
  description: string | null;
  category_tags: CategoryTag[];
};

export interface ProductContextType {
  products: Product[] | null;
  productsLoading: boolean;
  setProductsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProducts: () => void;
  updateProduct: (product: Product) => Promise<Product>;
};

export const ProductsContext = createContext<ProductContextType | null>(null);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const { currentCategory } = useCategories();

  const fetchProducts = () => {
    fetch(`${process.env.API_HOST}/admin/products?category_id=${currentCategory?.id || ''}`)
      .then(resp => resp.json())
      .then(json => {
        setProducts(json);
        setProductsLoading(false);
      })
  }

  const updateProduct = (product: Product): Promise<Product> => {
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description!)
    formData.append('category_tags', JSON.stringify(product.category_tags))
    
    return fetch(
      `${process.env.API_HOST}/admin/products/${product.id}`,
      { method: 'PUT', body: formData }
    ).then((response) => {
      if (!response.ok) { throw new Error(`Failed to update product: ${response.statusText}`) }
      return product
    })
  }

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        productsLoading,
        setProductsLoading,
        fetchProducts,
        updateProduct
      }}
      >
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