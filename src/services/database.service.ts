"use client";

import { ID, Permission, Query, Role } from "appwrite";
import { getAppwriteConfig, getDatabases, isAppwriteConfigured } from "@/lib/appwrite";
import type { GameSaveService } from "@/lib/backend/provider";
import { mapSavedGameDocument, serializeSavedGame } from "@/lib/backend/serializers";
import { BackendError, type ListResult, type SavedGamePayload, type SavedGameRecord } from "@/lib/backend/types";
import { authService } from "./auth.service";

function requireConfig() {
  if (!isAppwriteConfigured()) {
    throw new BackendError(
      "Appwrite ortam degiskenleri eksik. README ve .env.example dosyalarini kontrol edin.",
      "appwrite_not_configured",
    );
  }
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

async function requireUserId(): Promise<string> {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw new BackendError("Kayitli oyunlar icin giris yapmalisiniz.", "unauthorized");
  }

  return user.id;
}

export const databaseService: GameSaveService = {
  async listSavedGames(): Promise<ListResult<SavedGameRecord>> {
    requireConfig();

    try {
      const userId = await requireUserId();
      const config = getAppwriteConfig();
      const result = await getDatabases().listDocuments(config.databaseId, config.savedGamesCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("$updatedAt"),
        Query.limit(50),
      ]);

      return {
        documents: result.documents.map((document) => mapSavedGameDocument(document as never)),
        total: result.total,
      };
    } catch (error) {
      throw normalizeError(error, "Kayitli oyunlar getirilemedi.");
    }
  },

  async createSavedGame(payload) {
    requireConfig();

    try {
      const userId = await requireUserId();
      const config = getAppwriteConfig();
      const document = await getDatabases().createDocument(
        config.databaseId,
        config.savedGamesCollectionId,
        ID.unique(),
        {
          userId,
          ...serializeSavedGame(payload),
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      );

      return mapSavedGameDocument(document as never);
    } catch (error) {
      throw normalizeError(error, "Oyun kaydedilemedi.");
    }
  },

  async updateSavedGame(id, payload) {
    requireConfig();

    try {
      const userId = await requireUserId();
      const config = getAppwriteConfig();
      const document = await getDatabases().updateDocument(config.databaseId, config.savedGamesCollectionId, id, {
        userId,
        ...serializeSavedGame(payload),
      });

      return mapSavedGameDocument(document as never);
    } catch (error) {
      throw normalizeError(error, "Kayitli oyun guncellenemedi.");
    }
  },

  async deleteSavedGame(id) {
    requireConfig();

    try {
      const config = getAppwriteConfig();
      await requireUserId();
      await getDatabases().deleteDocument(config.databaseId, config.savedGamesCollectionId, id);
    } catch (error) {
      throw normalizeError(error, "Kayitli oyun silinemedi.");
    }
  },

  async getSavedGame(id) {
    requireConfig();

    try {
      const config = getAppwriteConfig();
      await requireUserId();
      const document = await getDatabases().getDocument(config.databaseId, config.savedGamesCollectionId, id);
      return mapSavedGameDocument(document as never);
    } catch (error) {
      throw normalizeError(error, "Kayitli oyun yuklenemedi.");
    }
  },
};
