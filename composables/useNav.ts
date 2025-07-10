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

export const useNavLinksAllMenu = async () => {
  const baseUrl = useBaseUrl();
  return useFetch(`${baseUrl}/nav/allmenus`);
};
