export const useNavLinks = async () => {
  const baseUrl = useBaseUrl();
  return useFetch(`${baseUrl}/nav/links`);
};
