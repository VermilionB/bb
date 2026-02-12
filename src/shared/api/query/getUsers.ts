import { notifications } from "@mantine/notifications";
import { $authHost } from "@shared/api";
import { AxiosResponse } from "axios";

interface GetApiDataParameters {
  link: string;
  page: number;
  size: number;
  searchText?: string;
}

export interface UsersResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
}
export const getUsers = async (
  parameters: GetApiDataParameters,
): Promise<UsersResponse[]> => {
  try {
    const response: AxiosResponse<UsersResponse[]> = await $authHost.get(
      `/authorization/admin/users/`,
      { params: parameters },
    );
    return response.data;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifications.show({
      title: "Ошибка",
      message: error.message,
      color: "red",
      autoClose: 5000,
    });
    throw error;
  }
};
