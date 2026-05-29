// ==========================================
// Custom API Hook with Auth token injection
// ==========================================
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosRequestConfig } from "axios";
import { useCallback } from "react";

export function useApi() {
  const { getToken } = useAuth();

  const request = useCallback(
    async <T>(config: AxiosRequestConfig): Promise<T> => {
      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(config.headers as Record<string, string>),
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios({ ...config, headers });
      return response.data;
    },
    [getToken]
  );

  const get = useCallback(
    <T>(url: string, params?: Record<string, unknown>) =>
      request<T>({ method: "GET", url, params }),
    [request]
  );

  const post = useCallback(
    <T>(url: string, data?: unknown) => request<T>({ method: "POST", url, data }),
    [request]
  );

  const put = useCallback(
    <T>(url: string, data?: unknown) => request<T>({ method: "PUT", url, data }),
    [request]
  );

  const del = useCallback(
    <T>(url: string) => request<T>({ method: "DELETE", url }),
    [request]
  );

  return { get, post, put, del, request };
}
