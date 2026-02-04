import axios, { InternalAxiosRequestConfig } from "axios";

export const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 3_600_000,
  withCredentials: true,
});
export const $authHost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 3_600_000,
  withCredentials: true,
});

const authInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const storedData = localStorage.getItem("auth-storage");

  const accessToken = storedData
    ? JSON.parse(storedData).state.accessToken
    : // eslint-disable-next-line unicorn/no-null
      null;
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

$authHost.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      globalThis.location.href = "/login";
    } else if (error.response && error.response.status === 403) {
      globalThis.location.href = "/";
    }
    return Promise.reject(error);
  },
);
