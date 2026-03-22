"use client";

import type { BackendProvider } from "@/lib/backend/provider";
import { authService } from "./auth.service";
import { databaseService } from "./database.service";

export const backendProvider: BackendProvider = {
  auth: authService,
  games: databaseService,
};
