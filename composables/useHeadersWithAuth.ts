// composables/useHeadersWithAuth.ts
export const useHeadersWithAuth = () => {
  const token = useCookie("auth_token").value;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  };

  return headers;
};
