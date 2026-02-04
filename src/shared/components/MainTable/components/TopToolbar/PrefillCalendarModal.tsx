import React, { JSX, useState } from "react";
import {
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { prefillCalendar } from "@shared/api/mutation/calendarAPI";
import { useMutation } from "@tanstack/react-query";

import classes from "./CalendarModals.module.scss";

export const PrefillCalendarModal = ({
  opened,
  setOpened,
  refetch,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}): JSX.Element => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState<number | string>(currentYear);

  const handleClosePrefillCalendarModal = (): void => {
    setOpened(false);
    setYear(currentYear);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      return await prefillCalendar(Number(year));
    },
    onSuccess: (response) => {
      if (response === 200) {
        setOpened(false);
        setYear(currentYear);
        notifications.show({
          title: "Успешно",
          message: `Календарь выходных дней для всех стран на ${year} год предзаполнен`,
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

  const prefill = async (): Promise<void> => {
    if (!year) {
      notifications.show({
        title: "Ошибка",
        message: "Пожалуйста, выберите год предзаполнения.",
        color: "red",
        autoClose: 5000,
      });
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClosePrefillCalendarModal}
      title={"Предзаполнение"}
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
      size={"xs"}
    >
      <Stack gap={16} p={"16px"}>
        <Text size={"14px"} fw={400}>
          Предзаполнение календаря выходных дней для всех стран
        </Text>
        <Flex direction="column" gap={"4px"}>
          <Text fw={400} size={"14px"} lh={"100%"}>
            Год
          </Text>
          <NumberInput
            placeholder="Выберите год"
            value={year}
            onChange={setYear}
          />
        </Flex>
      </Stack>
      <Group w={"100%"} justify="flex-end" gap={8} px={"16px"} py={"8px"}>
        <Button
          className={classes.button}
          onClick={handleClosePrefillCalendarModal}
        >
          Отменить
        </Button>
        <Button
          className={classes.button}
          onClick={prefill}
          loading={mutation.isPending}
        >
          Предзаполнить
        </Button>
      </Group>
    </Modal>
  );
};
