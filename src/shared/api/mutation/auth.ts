import { $host } from "@shared/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface LoginParameters {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

const login = async ({
  username,
  password,
}: LoginParameters): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await $host.post(
    "/authorization/login",
    { username, password },
    { withCredentials: true },
  );
  return response.data;
};

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginParameters
> => {
  return useMutation<LoginResponse, Error, LoginParameters>({
    mutationFn: login,
  });
};

interface RefreshTokenParameters {
  token: string;
}

const refresh = async ({
  token,
}: RefreshTokenParameters): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await $host.post(
    "/authorization/refresh-token",
    { token },
    { withCredentials: true },
  );
  return response.data;
};

export const useRefresh = (): UseMutationResult<
  LoginResponse,
  Error,
  RefreshTokenParameters
> => {
  return useMutation<LoginResponse, Error, RefreshTokenParameters>({
    mutationFn: refresh,
  });
};
