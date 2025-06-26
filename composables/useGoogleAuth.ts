// composables/useGoogleAuth.ts
declare global {
  interface Window {
    googleOneTapScriptLoaded?: boolean;
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {credential: string}) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const useGoogleAuth = () => {
  const router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  //"http://127.0.0.1:8000/auth/google";
  const GOOGLE_CLIENT_ID =
    "440121911282-n1tkv3rtrfu9vnm63ajsrm709vc00h3l.apps.googleusercontent.com";
  const GOOGLE_REDIRECT_URI =
    import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    "http://127.0.0.1:8000/auth/google/callback";

  const generateRandomString = (length: number): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateGoogleOAuthUrl = () => {
    const state = generateRandomString(20);
    localStorage.setItem("oauth_state", state);

    const scope = encodeURIComponent("openid profile email");
    return (
      `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      `&scope=${scope}` +
      `&response_type=code` +
      `&state=${state}` +
      `&service=lso` +
      `&o2v=1` +
      `&flowName=GeneralOAuthFlow`
    );
  };

  const handleGoogleOAuthRedirect = async () => {
    alert("handleGoogleOAuthRedirect");
    const res = await fetch("http://127.0.0.1:8000/auth/google");
    const {auth_url} = await res.json();
    window.location.href = auth_url;
    //const url = generateGoogleOAuthUrl();
    //window.location.href = url;
  };

  const handleGoogleCredentialResponse = async (response: {
    credential: string;
  }) => {
    loading.value = true;
    errorMessage.value = "";
    alert("handleGoogleCredentialResponse");

    const {data, error} = await useApi("/auth/google/callback", {
      method: "POST",
      body: {id_token: response.credential},
    });

    if (error) {
      errorMessage.value = error;
      loading.value = false;
      return;
    }

    const token = useCookie("auth_token", {path: "/"});
    const user = useCookie("user", {path: "/"});

    token.value = data.access_token;
    user.value = data.user;

    successMessage.value = "登入成功！正在跳轉...";
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const initGoogleOneTap = () => {
    if (typeof window === "undefined" || window.googleOneTapScriptLoaded)
      return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.prompt();
      }
    };
    document.head.appendChild(script);
    window.googleOneTapScriptLoaded = true;
  };

  return {
    loading,
    errorMessage,
    successMessage,
    handleGoogleOAuthRedirect,
    initGoogleOneTap,
    handleGoogleCredentialResponse,
  };
};
