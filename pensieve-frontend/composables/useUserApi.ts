import type { User } from "~/types/User";
const { getRequest, postRequest } = useApi();
import { useUserStore } from "~/stores/userStore";
import { useSettingsStore } from "~/stores/settingsStore";

const clearUserData = async () => {
  if (!import.meta.client) return;
  const authCookie = useCookie("user_token");
  const userStore = useUserStore();
  userStore.user = null;
  authCookie.value = null;
  await navigateTo("/");
};

const saveUserFromResponse = (data: any) => {
  const {
    user,
    access_token,
    refresh_token,
  }: { user: User; access_token: string; refresh_token: string } = data;
  if (user && access_token) {
    const userToken = useCookie(
      "user_token",
      import.meta.dev
        ? {}
        : {
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
          }
    );
    const refreshToken = useCookie(
      "refresh_token",
      import.meta.dev
        ? {}
        : {
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
          }
    );
    userToken.value = access_token;
    if (refresh_token) {
      refreshToken.value = refresh_token;
    }
    useUserStore().user = user;
    useSettingsStore().isAuthModalVisible = false;
    alert("Вы успешно авторизовались!");
  } else {
    alert("Что-то пошло не так");
  }
};

export const useAuthenticateUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const response: any = await postRequest("/login", {
      body: { username, password },
    });
    saveUserFromResponse(response.data);
  } catch (error: any) {
    const message = error.data?.error?.message;
    if (message) alert(message);
  }
};

export const useRegisterUser = async ({
  name,
  username,
  password,
}: {
  name: string;
  username: string;
  password: string;
}) => {
  try {
    const response: any = await postRequest("/register", {
      body: { name, username, password },
    });
    saveUserFromResponse(response.data);
  } catch (error: any) {
    const message = error.data?.error?.message;
    if (message) alert(message);
  }
};

export const useAuthorizeUser = async () => {
  const userStore = useUserStore();
  try {
    const { data: response, error } = await getRequest<User>("/authorize");
    if (response.value?.data) {
      userStore.user = response.value?.data;
      return;
    }
    if (error.value) {
      console.error("Authorization error:", error.value);
    }
  } catch (e) {
    console.error("Request failed:", e);
  }
  clearUserData();
};

export const useLogout = async () => {
  try {
    await getRequest("/logout");
    clearUserData();
  } catch (error: any) {
    const message = error.data?.error?.message;
    if (message) alert(message);
  }
};

export const useGetAllUsers = async (): Promise<User[]> => {
  try {
    const { data: response } = await getRequest<User[]>("/users");
    return response.value?.data ?? [];
  } catch (e) {
    console.error("Failed to fetch users:", e);
    return [];
  }
};
