import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "~/constants/auth";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/** Возвращает auth-cookie со сроками жизни, совпадающими с JWT */
export const useAuthTokens = () => {
  const cookieOptions = (maxAge: number) => ({
    secure: !import.meta.dev,
    sameSite: "strict" as const,
    maxAge,
  });
  const accessToken = useCookie<string | null>(
    "user_token",
    cookieOptions(ACCESS_TOKEN_TTL_SECONDS)
  );
  const refreshToken = useCookie<string | null>(
    "refresh_token",
    cookieOptions(REFRESH_TOKEN_TTL_SECONDS)
  );

  return { accessToken, refreshToken };
};

/** Сохраняет обе части новой пары токенов */
export const saveAuthTokens = ({
  access_token,
  refresh_token,
}: AuthTokens) => {
  const { accessToken, refreshToken } = useAuthTokens();
  accessToken.value = access_token;
  refreshToken.value = refresh_token;
};

/** Полностью очищает локальные auth-cookie */
export const clearAuthTokens = () => {
  const { accessToken, refreshToken } = useAuthTokens();
  accessToken.value = null;
  refreshToken.value = null;
};
