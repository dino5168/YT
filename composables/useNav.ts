export const useNavLinks = async () => {
  const baseUrl = useBaseUrl();

  const authToken = useCookie(AUTH_TOKEN_KEY, {
    maxAge: MAX_AGE, // 7 days
    httpOnly: false,
    secure: true,
    sameSite: "lax",
  });
  console.log("navLinks==================================== 0 ");
  console.log(authToken);

  const headers: HeadersInit = {};
  if (authToken.value) {
    headers.Authorization = `Bearer ${authToken.value}`;
  } else {
    headers.Authorization = `Bearer`;
  }
  const navLinks = useFetch(`${baseUrl}/nav/links`, {
    headers,
  });
  console.log("navLinks====================================");
  console.log(navLinks);

  return navLinks;
};

export const useNavLinks_simple = async () => {
  const baseUrl = useBaseUrl();

  return useFetch(`${baseUrl}/nav/links`);
};

export const useNavLinksAllMenu = async () => {
  const baseUrl = useBaseUrl();
  return useFetch(`${baseUrl}/nav/allmenus`);
};
