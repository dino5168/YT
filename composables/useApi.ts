export async function useApi<T = any>(
  url: string,
  options: {
    method?: string;
    body?: Record<string, any>;
    headers?: HeadersInit;
  } = {}
): Promise<{data: T | null; error: string | null}> {
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: json.detail || "發生錯誤",
      };
    }

    return {
      data: json,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || "網路請求失敗",
    };
  }
}
