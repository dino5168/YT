// composables/useFetchWithAuth.ts

export async function useFetchWithAuth<T>(
  url: string,
  options: {
    method?: string;
    body?: Record<string, any>;
    headers?: HeadersInit;
  } = {}
): Promise<{data: T | null; error: string | null}> {
  const token = useCookie("auth_token").value;

  return await useApi<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      ...(options.headers || {}),
    },
  });
}
