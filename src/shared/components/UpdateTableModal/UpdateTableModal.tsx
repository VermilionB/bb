import { JSX, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Group,
  Modal,
  rem,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications, showNotification } from "@mantine/notifications";
import IconFileUpload from "@public/assets/IconFileUpload.svg?react";
import { uploadDirectory } from "@shared/api/mutation/directoryAPI.ts";
import SvgButton from "@shared/components/SvgWrapper/SvgButton.tsx";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";

import classes from "./UpdateTableModal.module.scss";

const UpdateTableModal = ({
  link,
  opened,
  close,
}: {
  link: string;
  opened: boolean;
  close: () => void;
}): JSX.Element => {
  const openReference = useRef<() => void>(null);
  const [file, setFile] = useState<File | null>();
  const colorScheme = useMantineColorScheme();

  const controller = new AbortController();
  const { t } = useTranslation(["upload-file"]);

  const uploadFiles = async (): Promise<void> => {
    const formData = new FormData();

    if (!file) return;

    try {
      formData.append(`file`, file);
      const status = await uploadDirectory(link, formData);
      console.log(status);

      if (status === 200) {
        close();
        notifications.show({
          title: "Сообщение",
          message: "Справочник отправлен в очередь на обновление",
          color: "#4B6FAC",
          autoClose: 5000,
        });
        setFile(undefined);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);

      const messages = error.response.data.message;

      const messageString = messages
        .map((message: string) => `${message}`)
        .join("\n");

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          showNotification({
            title: t("upload-file:upload-file.upload-error-title"),
            message: (
              <Text style={{ whiteSpace: "pre-line" }}>{messageString}</Text>
            ),
            color: "red",
            autoClose: false,
          });
        } else {
          showNotification({
            title: t("upload-file:upload-file.upload-error-title"),
            message: "Произошла неизвестная ошибка.",
            color: "red",
            autoClose: false,
          });
        }
      } else {
        showNotification({
          title: t("upload-file:upload-file.upload-error-title"),
          message: "Произошла ошибка сети или сервер недоступен.",
          color: "red",
          autoClose: false,
        });
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        controller.abort();
        setFile(undefined);
      }}
      title={t("upload-file:upload-file.modal-title")}
      overlayProps={{
        backgroundOpacity: 0.55,
      }}
      centered
      classNames={{
        content: classes.content,
        body: classes.mantineModalBody,
        header: classes.header,
        title: classes.title,
        close: classes.close,
      }}
    >
      <div className={classes.modalWrapper}>
        <UnstyledButton className={classes.fileButton}>
          {file ? (
            <Card withBorder radius="md" m="md">
              <Stack>
                <IconFile width="100%" />
                <Text fz="sm">{file.name}</Text>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    setFile(undefined);
                  }}
                >
                  <IconX />
                </Button>
              </Stack>
            </Card>
          ) : (
            <Dropzone
              openRef={openReference}
              onDrop={(droppedFile) => {
                setFile(droppedFile[0]);
              }}
              radius="md"
              classNames={{
                inner: classes.inner,
              }}
            >
              <div style={{ pointerEvents: "none" }}>
                <Group justify="center" mt="32px">
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: rem(50),
                        height: rem(50),
                      }}
                      color="#006040"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: rem(50),
                        height: rem(50),
                      }}
                      color="red"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <SvgButton SvgIcon={IconFileUpload} fillColor={"#333333"} />
                  </Dropzone.Idle>
                </Group>

                <Text ta="center" fw={700} fz="lg" mt="16px">
                  <Dropzone.Accept>
                    {t("upload-file:upload-file.dropzone-accept")}
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    {t("upload-file:upload-file.dropzone-reject")}
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    {t("upload-file:upload-file.dropzone-idle")}
                  </Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" mb="32px" c="dimmed">
                  {t("upload-file:upload-file.dropzone-description")}
                </Text>
              </div>
            </Dropzone>
          )}
        </UnstyledButton>
      </div>

      <Group
        w={"100%"}
        justify="flex-end"
        gap={8}
        px={"16px"}
        py={"8px"}
        style={{
          borderTop: `1px solid ${colorScheme.colorScheme === "dark" ? "#444444" : "#DFDFDF"}`,
        }}
      >
        <Button
          className={classes.button}
          onClick={uploadFiles}
          disabled={!file}
        >
          {t("upload-file:upload-file.upload-button")}
        </Button>
      </Group>
    </Modal>
  );
};

export default UpdateTableModal;
