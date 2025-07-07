export const useNavLinks = async () => {
  const baseUrl = useBaseUrl();

  const authToken = useCookie(AUTH_TOKEN_KEY, {
    maxAge: MAX_AGE, // 7 days
    httpOnly: false,
    secure: true,
    sameSite: "lax",
  });

  const headers: HeadersInit = {};
  if (authToken.value) {
    headers.Authorization = `Bearer ${authToken.value}`;
  } else {
    headers.Authorization = `Bearer`;
  }

  return useFetch(`${baseUrl}/nav/links`, {
    headers,
  });
};

export const useNavLinks_simple = async () => {
  const baseUrl = useBaseUrl();

  return useFetch(`${baseUrl}/nav/links`);
};

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

export const useNavLinksAllMenu = async () => {
  const baseUrl = useBaseUrl();
  return useFetch(`${baseUrl}/nav/allmenus`);
};
