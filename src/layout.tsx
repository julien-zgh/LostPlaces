import { useEffect } from "react";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const RootLayout = ({ children }) => {
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const { pathname } = useLocation();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, [setCategories]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return <>{children}</>;
};

export default RootLayout;
