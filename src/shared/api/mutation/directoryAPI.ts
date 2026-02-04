import { notifications } from "@mantine/notifications";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { $authHost } from "../index";

export type DataType = string | number | boolean;

export interface ReferenceBookParameters {
  [key: string]: DataType;
}

interface CreateUpdateReferenceBookResponse {
  [key: string]: DataType;
}

export const uploadDirectory = async (
  link: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<number> => {
  try {
    const { status } = await $authHost.post(
      `${link}/upload-file`,
      formData,
      config,
    );
    return status;
  } catch (error: unknown) {
    console.error("Error uploading directory:", error);
    throw error;
  }
};

const createReferenceBookRow = async (
  dto: ReferenceBookParameters,
  link: string,
): Promise<CreateUpdateReferenceBookResponse> => {
  try {
    const response: AxiosResponse<CreateUpdateReferenceBookResponse> =
      await $authHost.post(`${link}/`, dto, {
        withCredentials: true,
      });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

const updateReferenceBookRow = async (
  id: number,
  dto: ReferenceBookParameters,
  link: string,
): Promise<CreateUpdateReferenceBookResponse> => {
  try {
    const response: AxiosResponse<CreateUpdateReferenceBookResponse> =
      await $authHost.put(`${link}/${id}`, dto, {
        withCredentials: true,
      });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

const handleError = (error: unknown): void => {
  const errorMessages: Record<number, string> = {
    409: "Запись с такой Страной и Датой уже существует",
    400: "Возникла непредвиденная ошибка",
    500: "Ошибка при добавлении записи в Календарь выходных дней",
  };

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message =
      status !== undefined && errorMessages[`${status}`]
        ? errorMessages[`${status}`]
        : error.response?.data?.message || "Неизвестная ошибка";

    notifications.show({
      title: "Ошибка",
      message,
      color: "red",
      autoClose: 5000,
    });
  }
};

export const useCreateReferenceBookRow = (): UseMutationResult<
  CreateUpdateReferenceBookResponse,
  Error,
  { dto: ReferenceBookParameters; link: string }
> => {
  return useMutation<
    CreateUpdateReferenceBookResponse,
    Error,
    { dto: ReferenceBookParameters; link: string }
  >({
    mutationFn: ({ dto, link }) => createReferenceBookRow(dto, link),
  });
};

export const useUpdateReferenceBookRow = (): UseMutationResult<
  CreateUpdateReferenceBookResponse,
  Error,
  { id: number; dto: ReferenceBookParameters; link: string }
> => {
  return useMutation<
    CreateUpdateReferenceBookResponse,
    Error,
    { id: number; dto: ReferenceBookParameters; link: string }
  >({
    mutationFn: ({ id, dto, link }) => updateReferenceBookRow(id, dto, link),
  });
};

export const deleteReferenceBookRow = async (
  id: number,
  link: string,
): Promise<number> => {
  try {
    const response = await $authHost.delete(`${link}/${id}`);
    return response.status;
  } catch (error) {
    notifications.show({
      title: "Ошибка",
      message: "Ошибка удаления записи",
      color: "red",
      autoClose: 5000,
    });
    throw error;
  }
};
