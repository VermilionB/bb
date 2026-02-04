import React, { JSX } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { deleteCalendarRow } from "@shared/api/mutation/calendarAPI";
import { useMutation } from "@tanstack/react-query";
import { MRT_RowData } from "mantine-react-table";

import classes from "../TopToolbar/CalendarModals.module.scss";

export const CalendarDeleteModal = ({
  row,
  opened,
  setOpened,
  refetch,
}: {
  row: MRT_RowData | undefined;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}): JSX.Element => {
  const weekendId: number = row?.getAllCells()[0].row.original.weekendId;
  const countryName: string = row?.getAllCells()[0].row.original.country;
  const weekendDate: string = row?.getAllCells()[0].row.original.weekendDate;
  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteCalendarRow(weekendId);
    },
    onSuccess: (response) => {
      if (response === 204) {
        setOpened(false);
        notifications.show({
          title: "Успешно",
          message: `Удалено успешно`,
          color: "green",
          autoClose: 5000,
        });
        refetch();
      }
    },
    onError: (error) => {
      console.log(error);
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
          Вы уверены, что хотите удалить запись: {countryName} {weekendDate}?
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
