export const useNavLinksRoleId = async (role_id: string) => {
  const baseUrl = useBaseUrl();

  return useFetch(`${baseUrl}/nav/qyerLinkbyRoleId/${role_id}`);
};

export const useNavLinksV1 = async () => {
  const navLinks = ref<any>(null);
  const error = ref<Error | null>(null);
  const baseUrl = useBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/nav/links`); // 使用相對路徑
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    navLinks.value = await res.json();
  } catch (err) {
    error.value = err as Error;
  }

  return {navLinks, error};
};
