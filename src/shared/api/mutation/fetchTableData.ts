import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

import { $authHost } from "../index";

interface PostApiDataParameters {
  link: string;
  page: number;
  size: number;
  searchText?: string;
  sortCriteria?: {
    [key: string]: string;
  };
  // dataStatus: string;
}
export interface ITableDataResponse {
  columnName: {
    [key: string]: string;
  };
  content: IContentItem[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface IContentItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const postApiData = async (
  parameters: PostApiDataParameters,
): Promise<ITableDataResponse> => {
  try {
    const { link } = parameters;
    const response = await $authHost.post(`${link}/search`, parameters);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: "Ошибка",
        message:
          error.response?.data?.message ||
          "Произошла ошибка при отправке данных",
        color: "red",
        autoClose: 5000,
      });
    }
    // Возвращаем пустой объект, соответствующий ITableDataResponse
    return {
      columnName: {},
      content: [],
      page: {
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }
};
