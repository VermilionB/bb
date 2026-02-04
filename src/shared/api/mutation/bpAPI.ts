/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications";
import { $authHost } from "@shared/api";
import { AxiosError } from "axios";

export const syncDataSCBank = async (link: string): Promise<any> => {
  try {
    const response = await $authHost.post(`${link}/sync`);
    if (response.status === 200) {
      notifications.show({
        title: "Успешно",
        message: "Данные обновлены",
        color: "green",
        autoClose: 5000,
      });
    }
    return response.status;
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: "Ошибка",
        message:
          error.response?.data?.message ||
          "Произошла ошибка при синхронизации данных",
        color: "red",
        autoClose: 5000,
      });
    }
    // eslint-disable-next-line consistent-return
    return;
  }
};

export const getInfo = async (link: string, id: number): Promise<any> => {
  try {
    const response = await $authHost.get(`${link}/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        notifications.show({
          title: "Ошибка",
          message:
            error.response?.data?.message ||
            "Не существует указанного делового партнера",
          color: "red",
          autoClose: 5000,
        });
      } else {
        notifications.show({
          title: "Ошибка",
          message:
            error.response?.data?.message ||
            "Произошла ошибка при получении данных",
          color: "red",
          autoClose: 5000,
        });
      }
    }

    // eslint-disable-next-line consistent-return
    return;
  }
};

export const getColumns = async (
  link: string,
  columnType: string,
): Promise<any> => {
  try {
    const response = await $authHost.get(`${link}/columns/${columnType}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: "Ошибка",
        message:
          error.response?.data?.message ||
          "Произошла ошибка при получении колонок таблицы",
        color: "red",
        autoClose: 5000,
      });
    }
    // eslint-disable-next-line consistent-return
    return;
  }
};
