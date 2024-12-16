import React from "react";
import { CategoriesProvider } from "@/providers/CategroiesProvider";
import { ProductsProvider } from "@/providers/ProductsProvider";

const ApplicationProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </CategoriesProvider>
  );
};

export default ApplicationProviders;