'use client';

import React, { createContext, useState, useContext, useEffect } from "react";
import type { CategoryTag } from '@/providers/ProductsProvider';


export interface Category {
  id: number | null;
  name: string;
  tag?: string;
  path(): string[];
  children: Category[];
};

export interface CategoryContextType {
  categories: Category[] | null;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  currentCategory: Category | null,
  selectCategory: (id: number | null) => void,
  categoriesLoading: boolean;
  setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateCategory: (id: number | null, tag: string | null) => void;
  tags: (nodes: Category[]) => {id: number, name: string}[]
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
    console.log('Setting category: ', id)
    setCurrentCategory( id ? findCategoryById(categories, id) : null);
  }

  const tags = (nodes: Category[] | null): CategoryTag[] => {
    if (!nodes) { return [] }
    let arr: {id: number, name: string}[] = []
    nodes.forEach((node) => {
      arr.push({ id: node.id!, name: node.tag! })
      arr = arr.concat(tags(node.children))
    })
    return arr
  }

  const fetchCategories = async () => {
    fetch(`${process.env.API_HOST}/admin/categories`)
      .then(resp => resp.json())
      .then(json => {
        setCategories(json);
        setCategoriesLoading(false);
      })
  };

  const updateCategory = async (id: number | null, tag: string | null) => {
    if (!id || !tag) { return }

    const body = new FormData();
    body.append('tag', tag);

    fetch(`${process.env.API_HOST}/admin/categories/${id}`, { method: 'PUT', body: body })
      .then(() => {
        fetchCategories()
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
        setCategoriesLoading,
        updateCategory,
        tags,
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