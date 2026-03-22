"use client";

import { Account, Client, Databases } from "appwrite";

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  savedGamesCollectionId: string;
}

const config: AppwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  savedGamesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SAVED_GAMES_COLLECTION_ID ?? "",
};

let clientSingleton: Client | null = null;

export function getAppwriteConfig(): AppwriteConfig {
  return config;
}

export function isAppwriteConfigured(): boolean {
  return Object.values(config).every(Boolean);
}

export function getAppwriteClient(): Client {
  if (!clientSingleton) {
    clientSingleton = new Client().setEndpoint(config.endpoint).setProject(config.projectId);
  }

  return clientSingleton;
}

export function getAccount(): Account {
  return new Account(getAppwriteClient());
}

export function getDatabases(): Databases {
  return new Databases(getAppwriteClient());
}
