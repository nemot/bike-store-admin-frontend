'use client';

import React, { createContext, useState, useContext, useEffect } from "react";


export interface Category {
  id: number | null;
  name: string;
  children: Category[];
};

export interface CategoryContextType {
  categories: Category[] | null;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  currentCategory: Category | null,
  selectCategory: (id: number | null) => void,
  categoriesLoading: boolean;
  setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CategoriesContext = createContext<CategoryContextType | null>(null);

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  const findCategoryById = (nodes: Category[], id: number): Category | null => {
    for(const cat of nodes) {
      if(cat.id === id) { return cat };
      const found = findCategoryById(cat.children, id);
      if(found) { return found };
    }
    return null
  }

  const selectCategory = (id: number | null): void => {
    setCurrentCategory( id ? findCategoryById(categories, id) : null);
  }

  const fetchCategories = async () => {
    fetch('http://localhost:3200/admin/categories')
      .then(resp => resp.json())
      .then(json => {
        setCategories(json);
        setCategoriesLoading(false);
      })
  };

  useEffect(() => { fetchCategories() }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        currentCategory,
        selectCategory,
        categoriesLoading,
        setCategoriesLoading 
        }}
      >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};