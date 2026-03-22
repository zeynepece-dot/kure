"use client";

import { ID, type Models } from "appwrite";
import { getAccount, isAppwriteConfigured } from "@/lib/appwrite";
import type { AuthService } from "@/lib/backend/provider";
import { BackendError, type BackendUser } from "@/lib/backend/types";

function requireConfig() {
  if (!isAppwriteConfigured()) {
    throw new BackendError(
      "Appwrite ortam degiskenleri eksik. README ve .env.example dosyalarini kontrol edin.",
      "appwrite_not_configured",
    );
  }
}

function mapUser(user: Models.User<Models.Preferences>): BackendUser {
  return {
    id: user.$id,
    email: user.email,
    name: user.name || user.email,
  };
}

function normalizeError(error: unknown, fallbackMessage: string): BackendError {
  if (typeof error === "object" && error !== null) {
    const message = "message" in error && typeof error.message === "string" ? error.message : fallbackMessage;
    const code =
      "code" in error && (typeof error.code === "string" || typeof error.code === "number")
        ? String(error.code)
        : "appwrite_error";
    return new BackendError(message, code, error);
  }

  return new BackendError(fallbackMessage, "appwrite_error", error);
}

export const authService: AuthService = {
  async register(email, password, name) {
    requireConfig();

    try {
      const account = getAccount();
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return mapUser(user);
    } catch (error) {
      throw normalizeError(error, "Kayit islemi tamamlanamadi.");
    }
  },

  async login(email, password) {
    requireConfig();

    try {
      const account = getAccount();
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return mapUser(user);
    } catch (error) {
      throw normalizeError(error, "Giris yapilamadi.");
    }
  },

  async logout() {
    requireConfig();

    try {
      await getAccount().deleteSession("current");
    } catch (error) {
      throw normalizeError(error, "Oturum kapatilamadi.");
    }
  },

  async getCurrentUser() {
    if (!isAppwriteConfigured()) {
      return null;
    }

    try {
      const user = await getAccount().get();
      return mapUser(user);
    } catch {
      return null;
    }
  },

  async hasActiveSession() {
    const user = await authService.getCurrentUser();
    return Boolean(user);
  },
};
