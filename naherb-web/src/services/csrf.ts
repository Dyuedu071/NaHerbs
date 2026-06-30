import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

let cachedCsrfToken: string | null = null;
let csrfFetchPromise: Promise<string | null> | null = null;

function readCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearCsrfToken(): void {
  cachedCsrfToken = null;
}

export async function getCsrfToken(): Promise<string | null> {
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  const fromCookie = readCsrfTokenFromCookie();
  if (fromCookie) {
    cachedCsrfToken = fromCookie;
    return cachedCsrfToken;
  }

  if (!csrfFetchPromise) {
    csrfFetchPromise = axios
      .get<{ token?: string }>(`${API_BASE_URL}/auth/csrf`, {
        withCredentials: true,
      })
      .then((response) => {
        cachedCsrfToken = response.data?.token ?? readCsrfTokenFromCookie();
        return cachedCsrfToken;
      })
      .catch(() => readCsrfTokenFromCookie())
      .finally(() => {
        csrfFetchPromise = null;
      });
  }

  return csrfFetchPromise;
}
