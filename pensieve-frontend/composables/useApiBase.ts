interface FetchOptions {
  params?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  lazy?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: number;
}

type NuxtAppWithRefresh = ReturnType<typeof useNuxtApp> & {
  _authRefreshPromise?: Promise<void>;
};

/** Извлекает HTTP-код из ошибок useFetch и $fetch */
export const getErrorStatus = (error: any): number | undefined => {
  const status =
    error?.statusCode ??
    error?.status ??
    error?.response?.status ??
    error?.data?.error?.code;
  return typeof status === "number" ? status : undefined;
};

export const isAuthError = (error: any) => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

/** Создаёт API-клиент с автоматическим обновлением пары токенов */
export const useApi = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp() as NuxtAppWithRefresh;
  const { accessToken, refreshToken } = useAuthTokens();

  const getCommonHeaders = () => ({
    Authorization: accessToken.value || "",
  });

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  /** Получает и сохраняет новую пару токенов через refresh-cookie */
  const refreshAuthTokens = async () => {
    if (!refreshToken.value) {
      throw Object.assign(new Error("Refresh token is missing"), {
        statusCode: 401,
      });
    }

    const response = await $fetch<ApiResponse<AuthTokens>>("/refresh", {
      baseURL: config.public.apiBase,
      method: "POST",
      body: { refresh_token: refreshToken.value },
      retry: 0,
    });

    if (!response.data?.access_token || !response.data?.refresh_token) {
      throw new Error("Invalid refresh token response");
    }

    accessToken.value = response.data.access_token;
    refreshToken.value = response.data.refresh_token;
  };

  /** Объединяет параллельные обновления в один запрос к /refresh */
  const refreshWithLock = () => {
    if (!nuxtApp._authRefreshPromise) {
      nuxtApp._authRefreshPromise = refreshAuthTokens()
        .catch((error) => {
          if (isAuthError(error)) clearTokens();
          throw error;
        })
        .finally(() => {
          nuxtApp._authRefreshPromise = undefined;
        });
    }
    return nuxtApp._authRefreshPromise;
  };

  const canRefresh = (url: string) =>
    !["/login", "/register", "/refresh"].includes(url);

  /** Запускает refresh перед повтором запроса с ошибкой авторизации */
  const handleResponseError = async (
    url: string,
    response: any,
    retry: number | false | undefined
  ) => {
    if (!retry || !canRefresh(url) || !isAuthError(response)) return;
    await refreshWithLock();
  };

  const getRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    return useFetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      query: options?.params,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
      lazy: options?.lazy ?? true,
      retry: canRefresh(url) ? 1 : 0,
      retryStatusCodes: [401, 403],
      onRequest({ options: requestOptions }) {
        requestOptions.headers = new Headers(requestOptions.headers);
        requestOptions.headers.set(
          "Authorization",
          getCommonHeaders().Authorization
        );
      },
      async onResponseError({ response, options: requestOptions }) {
        await handleResponseError(url, response, requestOptions.retry);
      },
    });
  };

  const postRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "POST",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
      retry: canRefresh(url) ? 1 : 0,
      retryStatusCodes: [401, 403],
      onRequest({ options: requestOptions }) {
        requestOptions.headers = new Headers(requestOptions.headers);
        requestOptions.headers.set(
          "Authorization",
          getCommonHeaders().Authorization
        );
      },
      async onResponseError({ response, options: requestOptions }) {
        await handleResponseError(url, response, requestOptions.retry);
      },
    });
  };

  const putRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "POST",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
      retry: canRefresh(url) ? 1 : 0,
      retryStatusCodes: [401, 403],
      onRequest({ options: requestOptions }) {
        requestOptions.headers = new Headers(requestOptions.headers);
        requestOptions.headers.set(
          "Authorization",
          getCommonHeaders().Authorization
        );
      },
      async onResponseError({ response, options: requestOptions }) {
        await handleResponseError(url, response, requestOptions.retry);
      },
    });
  };

  const deleteRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
      retry: canRefresh(url) ? 1 : 0,
      retryStatusCodes: [401, 403],
      onRequest({ options: requestOptions }) {
        requestOptions.headers = new Headers(requestOptions.headers);
        requestOptions.headers.set(
          "Authorization",
          getCommonHeaders().Authorization
        );
      },
      async onResponseError({ response, options: requestOptions }) {
        await handleResponseError(url, response, requestOptions.retry);
      },
    });
  };

  return { getRequest, postRequest, putRequest, deleteRequest };
};
