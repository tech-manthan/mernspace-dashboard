import type { LoginData } from "../types/auth.type";
import { api } from "./client";

// Auth Service
export const login = (credentials: LoginData) =>
  api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
