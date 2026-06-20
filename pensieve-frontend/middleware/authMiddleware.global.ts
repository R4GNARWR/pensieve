import { useUserStore } from "~/stores/userStore";
import { useSettingsStore } from "~/stores/settingsStore";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const router = useRouter();
  const isRouteValid = router.resolve(to.path).matched.length > 0;

  if (!isRouteValid)
    throw createError({
      statusCode: 404,
      statusMessage: "Страница не найдена",
    });

  // To-do: Переписать все на useAuthorizeUser, для SSR
  const userStore = useUserStore();
  const isLoggedIn = userStore.user?.id ? true : false;

  if (!isLoggedIn && to.path !== "/" && import.meta.client) {
    return await navigateTo("/?login=true", { replace: true });
  }
});
