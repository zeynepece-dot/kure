"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthBootstrap() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      void bootstrap();
    }
  }, [bootstrap, initialized]);

  return null;
}
