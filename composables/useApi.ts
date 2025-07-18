export async function useApi<T>(
  url: string,
  options: {
    method?: string;
    body?: BodyInit | Record<string, any>;
    headers?: HeadersInit;
  }
): Promise<{data: T | null; error: string | null}> {
  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      method: options.method || "GET",
      body: isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body),
      headers: isFormData
        ? options.headers // 不要加 Content-Type，瀏覽器自動處理
        : {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
    });

    if (!response.ok) {
      const errText = await response.text();
      return {data: null, error: `HTTP ${response.status}: ${errText}`};
    }

    const data = await response.json();
    return {data, error: null};
  } catch (err: any) {
    return {data: null, error: err.message || "Unknown error"};
  }
}
