// composables/useApiClient.ts
export function useApiClient() {
  const baseUrl = useBaseUrl();

  const get = async (path: string, options = {}) => {
    return await $fetch(`${baseUrl}/${path}`, options);
  };

  return {get};
}
