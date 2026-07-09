// nuxt.config.ts
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const internalApiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://127.0.0.1:5000"
    : "http://backend:5000";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["@/assets/scss/global.scss"],
  runtimeConfig: {
    public: {
      static: "/",
      apiBase: "/api",
    },
  },
  typescript: {
    typeCheck: true,
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "~/assets/scss/_functions.scss" as *;
          @use "~/assets/scss/_mixins.scss" as *;
          @use "~/assets/scss/_vars.scss" as *;
          @use "~/assets/scss/_reset.scss" as *;
          @use "~/assets/scss/_fonts.scss" as *;
          `,
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  nitro: {
    routeRules: {
      "/api/**": {
        proxy: `${internalApiUrl}/api/**`,
      },
      "/uploads/**": {
        proxy: `${internalApiUrl}/uploads/**`,
      },
    },
  },
});
