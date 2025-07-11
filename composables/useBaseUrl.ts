// composables/useBaseUrl.ts
export function useBaseUrl() {
  const config = useRuntimeConfig();
  //return config.public.ApiBaseUrl;
  console.log("----------");
  console.log(config.API_BASE_URL);
  console.log(config.public.ApiBaseUrl);
  return config.public.ApiBaseUrl;
}
