import React, { JSX } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { deleteReferenceBookRow } from "@shared/api/mutation/directoryAPI.ts";
import { useMutation } from "@tanstack/react-query";
import { MRT_RowData } from "mantine-react-table";

import classes from "../TopToolbar/CalendarModals.module.scss";

export const DeleteConfirmModal = ({
  row,
  opened,
  setOpened,
  refetch,
  link,
}: {
  row: MRT_RowData | undefined;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  link: string;
}): JSX.Element => {
  const id: number = row?.getAllCells()[0].row.original.id;
  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteReferenceBookRow(id, link);
    },
    onSuccess: (response) => {
      if (response === 200) {
        setOpened(false);
        notifications.show({
          title: "Успешно",
          message: `Запись удалена`,
          color: "green",
          autoClose: 5000,
        });
        refetch();
      }
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: "Ошибка",
        color: "red",
        message: error.message,
        position: "bottom-right",
      });
    },
  });

  const deleteRow = async (): Promise<void> => {
    mutation.mutate();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={"Удалить запись"}
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
      size={"450px"}
    >
      <Stack gap={16} p={"16px"}>
        <Text size={"14px"} fw={400}>
          Вы уверены, что хотите удалить запись с идентификатором {id}?
        </Text>
      </Stack>
      <Group w={"100%"} justify="flex-end" gap={8} px={"16px"} py={"8px"}>
        <Button className={classes.button} onClick={() => setOpened(false)}>
          Отменить
        </Button>
        <Button
          className={classes.button}
          onClick={deleteRow}
          loading={mutation.isPending}
        >
          Да
        </Button>
      </Group>
    </Modal>
  );
};
