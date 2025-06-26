// plugins/google.ts
import {defineNuxtPlugin} from "#app";
import GoogleSignInPlugin from "vue3-google-login";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(GoogleSignInPlugin, {
    clientId:
      "440121911282-n1tkv3rtrfu9vnm63ajsrm709vc00h3l.apps.googleusercontent.com",
  });
});
