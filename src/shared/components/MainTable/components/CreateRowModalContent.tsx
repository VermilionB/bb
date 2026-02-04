import { FC, JSX, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ReferenceBooks } from "@public/ReferenceBooks.ts";
import {
  DataType,
  ReferenceBookParameters,
  useCreateReferenceBookRow,
} from "@shared/api/mutation/directoryAPI.ts";

import classes from "./TopToolbar/CalendarModals.module.scss";

interface CreateRowModalContentProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processedColumns: any[];
  createRowModalOpened: boolean;
  setCreateRowModalOpened: (value: boolean) => void;
  link: string;
  refetch: () => void;
}

const isDisabled = (columnId: string): boolean => {
  return columnId === "id";
};

const CreateRowModalContent: FC<CreateRowModalContentProperties> = ({
  processedColumns,
  setCreateRowModalOpened,
  table,
  link,
  refetch,
}) => {
  const colorScheme = useMantineColorScheme();
  const { mutate } = useCreateReferenceBookRow();

  const [formValues, setFormValues] = useState<ReferenceBookParameters>({});

  const handleInputChange = (id: string, value: DataType): void => {
    setFormValues((previous) => ({ ...previous, [id]: value }));
    console.log(formValues);
  };

  const handleCreate = (): void => {
    mutate(
      { dto: formValues, link },
      {
        onSuccess: (_data) => {
          // eslint-disable-next-line unicorn/no-null
          table.setCreatingRow(null);
          refetch();
          notifications.show({
            title: "Успешно",
            color: "#74AC4B",
            message: "Запись сохранена",
            position: "bottom-right",
          });
          return _data;
        },
        onError: (createError) => {
          notifications.show({
            title: "Ошибка",
            color: "red",
            message: createError.message,
            position: "bottom-right",
          });
        },
      },
    );
  };
  console.log(link);

  const getInputComponent = (
    columnKey: string,
    columnName: string,
    type: string,
  ): JSX.Element | null => {
    switch (type) {
      case "string": {
        return (
          <TextInput
            placeholder={`Введите ${columnName}`}
            value={formValues[`${columnKey}`] as string}
            onChange={(event) =>
              handleInputChange(columnKey, event.currentTarget.value)
            }
            disabled={isDisabled(columnKey)}
          />
        );
      }
      case "number": {
        return (
          <NumberInput
            placeholder={`Введите ${columnName}`}
            value={formValues[`${columnKey}`] as number}
            onChange={(value) => handleInputChange(columnKey, value)}
            disabled={isDisabled(columnKey)}
          />
        );
      }
      case "boolean": {
        return (
          <Checkbox
            checked={formValues[`${columnName}`] as boolean}
            onChange={(event) =>
              handleInputChange(columnKey, event.currentTarget.checked)
            }
            label={`Введите ${columnKey}`}
            disabled={isDisabled(columnKey)}
          />
        );
      }
      default: {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }
    }
  };

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      <Stack
        style={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "calc(80vh - 50px)",
        }}
        p={"16px"}
        gap={16}
      >
        {processedColumns.map((column) => {
          const referenceBookEntry = ReferenceBooks.find(
            (reference) => reference.link === link,
          );
          console.log("referenceBookEntry", referenceBookEntry);
          const columnType = referenceBookEntry
            ? referenceBookEntry.columns[column.accessorKey]
            : "string";
          return (
            <Flex gap={"4px"} direction="column" key={column.accessorKey}>
              <Text fw={400} size={"14px"} lh={"100%"}>
                {column.header}
              </Text>
              {columnType &&
                getInputComponent(
                  column.accessorKey,
                  column.header,
                  columnType,
                )}
            </Flex>
          );
        })}
      </Stack>
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
          onClick={() => {
            setCreateRowModalOpened(false);
            table.setCreatingRow(undefined);
          }}
        >
          Отменить
        </Button>
        <Button className={classes.button} onClick={handleCreate}>
          Сохранить
        </Button>
      </Group>
    </Flex>
  );
};

export default CreateRowModalContent;
