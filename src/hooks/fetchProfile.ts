"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore, UserProfile } from "@/store/authStore";

export default function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const user = useAuthStore((s) => s.user);
  const isLogged = useAuthStore((s) => s.isLogged);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated by looking for auth token
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        clearUser();
        setLoading(false);
        return;
      }

      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) {
        clearUser();
        setLoading(false);
        return;
      }
      const data = await res.json();
      const profile: UserProfile = {
        id: data?.id ?? data?.user_id ?? null,
        user_id: data?.user_id ?? data?.id ?? null,
        username: data?.username ?? data?.user?.user_metadata?.full_name ?? data?.name ?? null,
        image_url: data?.image_url ?? data?.user?.avatar_url ?? null,
      };
      setUser(profile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch profile");
      clearUser();
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, isLogged, loading, error, refresh: fetchProfile, clearUser };
}