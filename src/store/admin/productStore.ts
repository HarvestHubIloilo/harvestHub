import { create } from "zustand";
import { Product } from "@/lib/definitions";

interface ProductStoreState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  updateProductToggle: (productId: string, field: "is_featured" | "is_recommended", value: boolean) => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  updateProductToggle: (productId: string, field: "is_featured" | "is_recommended", value: boolean) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.product_id === Number(productId)
          ? { ...product, [field]: value }
          : product,
      ),
    })),
}));
