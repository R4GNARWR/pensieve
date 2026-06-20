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

export const useApi = () => {
  const getCommonHeaders = () => {
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
    return {
      Authorization: userToken.value ? `${userToken.value}` : "",
    };
  };
  const getRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    const config = useRuntimeConfig();
    return useFetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      query: options?.params,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
      lazy: options?.lazy ?? true,
    });
  };

  const postRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    const config = useRuntimeConfig();
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "POST",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
    });
  };

  const putRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    const config = useRuntimeConfig();
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "POST",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
    });
  };

  const deleteRequest = async <T = unknown>(
    url: string,
    options?: FetchOptions
  ) => {
    const config = useRuntimeConfig();
    return $fetch<ApiResponse<T>>(url, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      body: options?.body,
      headers: {
        ...getCommonHeaders(),
        ...options?.headers,
      },
    });
  };

  return { getRequest, postRequest, putRequest, deleteRequest };
};
