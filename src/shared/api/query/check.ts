import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

import { $authHost } from "../index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkApiData = async (): Promise<any> => {
  try {
    const response = await $authHost.get(`/authorization/user/check`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: "Ошибка",
        message:
          error.response?.data?.message ||
          "Произошла ошибка при получении данных",
        color: "red",
        autoClose: 5000,
      });
    }
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
};
