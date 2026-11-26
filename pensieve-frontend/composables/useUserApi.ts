import type { User } from "~/types/User";
import type {AuthTokens} from "~/composables/useAuthTokens";
import { useUserStore } from "~/stores/userStore";
import { useSettingsStore } from "~/stores/settingsStore";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface AuthData extends AuthTokens {
  user: User;
}

/** Очищает локальную сессию и возвращает пользователя на главную */
const clearUserData = async () => {
  const userStore = useUserStore();
  userStore.user = null;
  clearAuthTokens();
  if (import.meta.client) await navigateTo("/");
};

/** Сохраняет пользователя и токены после входа или регистрации */
const saveUserFromResponse = ({user, access_token, refresh_token}: AuthData) => {
    const settingsStore = useSettingsStore();
  if (user && access_token && refresh_token) {
    saveAuthTokens({ access_token, refresh_token });
    useUserStore().user = user;
      settingsStore.isAuthModalVisible = false;
      settingsStore.popups.push({message: "Вы успешно авторизовались!", variant: "success"});
  } else {
      settingsStore.popups.push({message: "Что-то пошло не так", variant: "error"});
  }
};

export const useAuthenticateUser = async ({email, password}: LoginData) => {
  const { postRequest } = useApi();
    const settingsStore = useSettingsStore();
  try {
    const response = await postRequest<AuthData>("/login", {
      body: {email, password},
    });
    saveUserFromResponse(response.data);
  } catch (error: any) {
    const message = error.data?.error?.message;
      if (message) settingsStore.popups.push({message, variant: "error"});
  }
};

export const useRegisterUser = async ({name, email, password}: RegisterData) => {
  const { postRequest } = useApi();
    const settingsStore = useSettingsStore();
  try {
    const response = await postRequest<AuthData>("/register", {
      body: {name, email, password},
    });
    saveUserFromResponse(response.data);
  } catch (error: any) {
    const message = error.data?.error?.message;
      if (message) settingsStore.popups.push({message, variant: "error"});
  }
};

/** Восстанавливает пользователя и очищает сессию только при ошибке авторизации */
export const useAuthorizeUser = async () => {
  const { getRequest } = useApi();
  const userStore = useUserStore();
  try {
    const { data: response, error } = await getRequest<User>("/authorize");
    if (response.value?.data) {
      userStore.user = response.value?.data;
      return;
    }
    if (isAuthError(error.value)) {
      await clearUserData();
      return;
    }
    if (error.value) {
      console.error("Authorization error:", error.value);
    }
  } catch (e) {
    if (isAuthError(e)) {
      await clearUserData();
      return;
    }
    console.error("Request failed:", e);
  }
};

/** Отзывает серверные refresh-токены и очищает локальную сессию */
export const useLogout = async () => {
  const { getRequest } = useApi();
    const settingsStore = useSettingsStore();
  try {
    const { error } = await getRequest("/logout");
    if (error.value) throw error.value;
    await clearUserData();
  } catch (error: any) {
    const message = error.data?.error?.message;
      if (message) settingsStore.popups.push({message, variant: "error"});
  }
};
