import { notifications } from "@mantine/notifications";
import { $authHost } from "@shared/api";

export interface CorrectionalRecordsDayResponse {
  correctionalRecordsDayId: number;
  correctionalDate: string;
  correctionalUser: string;
}

export const getCorrectionalRecordsDay =
  async (): Promise<CorrectionalRecordsDayResponse> => {
    try {
      const response = await $authHost.get(
        `/reglament-procedures/correctional-records-day/`,
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
