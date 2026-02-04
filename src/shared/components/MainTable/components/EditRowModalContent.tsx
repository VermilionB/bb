import { FC, useEffect, useState } from "react";
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
import {
  DataType,
  ReferenceBookParameters,
  useUpdateReferenceBookRow,
} from "@shared/api/mutation/directoryAPI.ts";
import classes from "@shared/components/MainTable/components/TopToolbar/CalendarModals.module.scss";
import { MRT_Cell, MRT_RowData } from "mantine-react-table";

interface EditRowModalContentProperties {
  row: MRT_RowData;
  editModalOpened: boolean;
  setEditRowModalOpened: (opened: boolean) => void;
  canEdit: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  table: any;
  link: string;
  refetch: () => void;
}

export const isDisabled = (columnId: string): boolean => {
  return columnId === "id" || columnId.endsWith("Id");
};

const EditRowModalContent: FC<EditRowModalContentProperties> = ({
  row,
  setEditRowModalOpened,
  table,
  link,
  refetch,
}) => {
  const { mutate } = useUpdateReferenceBookRow();
  const colorScheme = useMantineColorScheme();
  const [formValues, setFormValues] = useState<ReferenceBookParameters>({});

  useEffect(() => {
    const initialValues: { [key: string]: string | number | boolean } = {};
    for (const cell of Object.keys(row.original)) {
      initialValues[`${cell}`] = row.original[`${cell}`] as DataType;
    }
    setFormValues(initialValues);
  }, [row]);

  const handleInputChange = (id: string, value: DataType): void => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    setFormValues((previous: any) => ({ ...previous, [id]: value }));
  };

  const handleSave = (): void => {
    mutate(
      { id: row.original.id, dto: formValues, link },
      {
        onSuccess: (_data) => {
          // eslint-disable-next-line unicorn/no-null
          table.setEditingRow(null);
          refetch();
          notifications.show({
            title: "Успешно",
            color: "#74AC4B",
            message: "Запись обновлена",
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
        {}
        {row
          .getAllCells()
          .filter(
            (cell: MRT_Cell<typeof row.original>) =>
              cell.column.columnDef.header.length > 0,
          )
          .map((cell: MRT_Cell<typeof row.original>) => {
            const value = formValues[cell.column.id];

            return (
              <Flex
                gap={"4px"}
                direction={"column"}
                justify={"flex-start"}
                key={cell.id}
              >
                <Text fw={400} size={"14px"} lh={"100%"}>
                  {cell.column.columnDef.header}
                </Text>
                {typeof value === "string" && (
                  <TextInput
                    styles={{
                      input: {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        borderRadius: "2px",
                      },
                    }}
                    value={value as string}
                    onChange={(event) =>
                      !isDisabled(cell.column.id) &&
                      handleInputChange(
                        cell.column.id,
                        event.currentTarget.value,
                      )
                    }
                    disabled={isDisabled(cell.column.id)}
                  />
                )}
                {typeof value === "number" && (
                  <NumberInput
                    styles={{
                      input: {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        borderRadius: "2px",
                      },
                    }}
                    value={value as number}
                    onChange={(value_) =>
                      !isDisabled(cell.column.id) &&
                      handleInputChange(cell.column.id, value_)
                    }
                    disabled={isDisabled(cell.column.id)}
                  />
                )}
                {typeof value === "boolean" && (
                  <Checkbox
                    styles={{
                      input: {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        borderRadius: "2px",
                      },
                    }}
                    checked={value as boolean}
                    onChange={(event) =>
                      !isDisabled(cell.column.id) &&
                      handleInputChange(
                        cell.column.id,
                        event.currentTarget.checked,
                      )
                    }
                    disabled={isDisabled(cell.column.id)}
                    label={value.toString()}
                  />
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
            setEditRowModalOpened(false);
            table.setEditingRow(undefined);
          }}
        >
          Отменить
        </Button>
        <Button className={classes.button} onClick={handleSave}>
          Сохранить
        </Button>
      </Group>
    </Flex>
  );
};

export default EditRowModalContent;
