import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export function useCartCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const setItems = useCartStore((state) => state.setItems);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchCountAndCart = async () => {
      setCount(0);
      setLoading(true);
      try {
        // Check if user is authenticated by looking for auth token
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch cart items and update Zustand store
        const cartRes = await fetch("/api/cart/list");
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setItems(cartData.cart || []);
        }

        // Fetch cart count
        const countRes = await fetch("/api/cart/count");
        if (countRes.ok) {
          const countData = await countRes.json();
          setCount(countData.count);
        }
      } catch {
        setCount(0);
      }
      setLoading(false);
    };
    fetchCountAndCart();
  }, [setItems]);

  return { count, loading };
}