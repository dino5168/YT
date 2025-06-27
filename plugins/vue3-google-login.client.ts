// plugins/vue3-google-login.client.ts
import {defineNuxtPlugin} from "#app";
import GoogleLoginPlugin from "vue3-google-login";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(GoogleLoginPlugin, {
    clientId:
      "440121911282-n1tkv3rtrfu9vnm63ajsrm709vc00h3l.apps.googleusercontent.com",
  });
});
