"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store/useStore";

export function DataInitializer() {
  const { fetchData } = useStore();

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll every 5 seconds to keep data fresh (simulate real-time)
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return null;
}
