// ============================================================================
// AlignHR - API Client
// Lightweight fetch wrapper for communicating with the Express backend.
// Token is passed as a parameter to support both client and server contexts.
// ============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Core fetch wrapper that handles headers, auth, JSON parsing, and errors.
 */
async function fetchApi<T = unknown>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Next.js server-side fetch defaults to IPv6 ::1 for 'localhost', but our Express server is bound to IPv4 0.0.0.0.
  // We replace localhost with 127.0.0.1 on the server to prevent ECONNREFUSED.
  const baseUrl = typeof window === 'undefined' ? API_BASE.replace('localhost', '127.0.0.1') : API_BASE;

  // Normalize path if someone accidentally prefixed it with /api/
  const normalizedPath = path.startsWith('/api/') ? path.substring(4) : path;

  const res = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,
    headers,
  });

  // Handle empty responses (204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data as T;
}

/**
 * Performs a GET request.
 */
export const apiGet = <T = unknown>(path: string, token?: string): Promise<T> =>
  fetchApi<T>(path, { method: 'GET' }, token);

/**
 * Performs a POST request with an optional JSON body.
 */
export const apiPost = <T = unknown>(path: string, body?: unknown, token?: string): Promise<T> =>
  fetchApi<T>(path, { method: 'POST', body: JSON.stringify(body) }, token);

/**
 * Performs a PUT request with an optional JSON body.
 */
export const apiPut = <T = unknown>(path: string, body?: unknown, token?: string): Promise<T> =>
  fetchApi<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token);

/**
 * Performs a DELETE request.
 */
export const apiDelete = <T = unknown>(path: string, token?: string): Promise<T> =>
  fetchApi<T>(path, { method: 'DELETE' }, token);
