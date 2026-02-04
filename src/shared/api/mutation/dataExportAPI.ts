import { notifications } from "@mantine/notifications";
import { $authHost } from "@shared/api";
import { AxiosError, AxiosResponse } from "axios";

const handleSuccessResponse = (
  response: AxiosResponse,
  format: string,
): void => {
  const url = globalThis.URL.createObjectURL(new Blob([response.data]));
  const contentDisposition = response.headers["content-disposition"];
  let filename = `exported_data_${format.toLowerCase()}.xlsx`;
  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
      contentDisposition,
    );
    if ((matches !== undefined && !matches) || matches[1]) {
      if (matches) {
        filename = matches[1].replace(/['"]/g, "");
      }
    } else {
      const fallbackMatch = /filename=(.*?)(;|$)/.exec(contentDisposition);
      if (
        ((fallbackMatch !== undefined && !fallbackMatch) || fallbackMatch[1]) &&
        fallbackMatch
      ) {
        filename = fallbackMatch[1].trim();
      }
    }
  }

  const linkForDownload = document.createElement("a");
  linkForDownload.href = url;
  linkForDownload.setAttribute("download", filename);
  document.body.append(linkForDownload);
  linkForDownload.click();
  linkForDownload.remove();
  notifications.show({
    title: "Успешно",
    message: `Выгрузка в ${format} прошла успешно`,
    color: "green",
    autoClose: 5000,
  });

  globalThis.URL.revokeObjectURL(url);
};

const handleErrorResponse = (error: unknown): void => {
  if (error instanceof AxiosError) {
    notifications.show({
      title: "Ошибка",
      message:
        error.response?.data?.message || "Произошла ошибка при выгрузке данных",
      color: "red",
      autoClose: 5000,
    });
  }
  console.error("Error posting API data:", error);
  throw new Error("Failed to post API data");
};

export const exportData = async (
  parameters: object,
  link: string,
  format: string,
): Promise<void> => {
  try {
    const response = await $authHost.post(
      `data-export${link}/${format.toLowerCase()}`,
      parameters,
      {
        responseType: "blob",
      },
    );

    if (response.status === 200) {
      handleSuccessResponse(response, format);
    }
  } catch (error: unknown) {
    handleErrorResponse(error);
  }
};
