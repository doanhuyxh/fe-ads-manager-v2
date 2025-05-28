const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: Method;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export async function fetcher<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${baseURL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
    cache: options.cache || "no-store",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Đã có lỗi xảy ra");
  }
  return json;
}
