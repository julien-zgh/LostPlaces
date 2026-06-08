import { create } from "zustand";

interface Category {
  _id: string;
  category_id: string;
  category: string;
  color: string;
  icon: string;
}

interface CatState {
  categories: Category[] | null;
  setCategories: (categories: Category[]) => void;
  getCategoryName: (id: string) => string;
}

export const useCategoriesStore = create<CatState>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  getCategoryName: (id) => {
    const cat = get().categories.find((c) => c._id === id);
    return cat ? cat.category : "Unknown Category";
  },
}));
