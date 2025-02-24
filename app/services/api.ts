import axios, { AxiosRequestConfig } from "axios";
import { ActorFormData } from "../types";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
const ENDPOINTS = {
  ACTORS: "/api/actors",
  ACTOR_PROFILE: "/api/actors/profile",
} as const;

interface AuthConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string;
  };
}

export const api = {
  get: async (endpoint: string, config?: AuthConfig) => {
    try {
      console.log(`Making GET request to: ${endpoint}`, { config });
      const response = await axiosInstance.get(endpoint, config);
      console.log(`GET response for ${endpoint}:`, response.data);
      return response;
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  },

  delete: async (endpoint: string, config?: AuthConfig) => {
    try {
      console.log(`Making DELETE request to: ${endpoint}`, { config });
      const response = await axiosInstance.delete(endpoint, config);
      console.log(`DELETE response for ${endpoint}:`, response.data);
      return response;
    } catch (error) {
      console.error(`API DELETE error for ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: unknown, config?: AuthConfig) => {
    try {
      console.log(`Making POST request to: ${endpoint}`, { data, config });
      const response = await axiosInstance.post(endpoint, data, config);
      console.log(`POST response for ${endpoint}:`, response.data);
      return response;
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  },
};

// Actor API calls
export const actorApi = {
  getAll: () => api.get(ENDPOINTS.ACTORS),
  getProfile: () => api.get(ENDPOINTS.ACTOR_PROFILE),
  create: (actor: ActorFormData) => api.post(ENDPOINTS.ACTORS, actor),
  update: (id: number, actor: ActorFormData) =>
    api.post(`${ENDPOINTS.ACTORS}/${id}`, actor),
  delete: async (id: number, token?: string) => {
    const config: AuthConfig = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return api.delete(`${ENDPOINTS.ACTORS}/${id}`, config);
  },
};

// Development mode check
const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";
console.log("API Service Mode:", {
  isDevelopment,
  NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
});
