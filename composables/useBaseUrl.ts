// composables/useBaseUrl.ts
export function useBaseUrl() {
  const config = useRuntimeConfig();
  return config.public.ApiBaseUrl;
}
