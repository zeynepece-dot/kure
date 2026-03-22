"use client";

import { create } from "zustand";
import type { BackendUser } from "@/lib/backend/types";
import { backendProvider } from "@/services";

interface Credentials {
  email: string;
  password: string;
  name?: string;
}

interface AuthStore {
  user: BackendUser | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (credentials: Credentials) => Promise<boolean>;
  register: (credentials: Credentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Beklenmeyen bir hata olustu.";
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initialized: false,
  isLoading: false,
  error: null,

  async bootstrap() {
    set({ isLoading: true, error: null });
    try {
      const user = await backendProvider.auth.getCurrentUser();
      set({ user, initialized: true, isLoading: false });
    } catch (error) {
      set({ user: null, initialized: true, isLoading: false, error: getErrorMessage(error) });
    }
  },

  async login({ email, password }) {
    set({ isLoading: true, error: null });
    try {
      const user = await backendProvider.auth.login(email, password);
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return false;
    }
  },

  async register({ email, password, name }) {
    set({ isLoading: true, error: null });
    try {
      const user = await backendProvider.auth.register(email, password, name);
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return false;
    }
  },

  async logout() {
    set({ isLoading: true, error: null });
    try {
      await backendProvider.auth.logout();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },

  clearError() {
    set({ error: null });
  },
}));
