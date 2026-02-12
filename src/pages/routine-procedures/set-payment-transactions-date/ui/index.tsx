import React, { FC, useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  MultiSelect,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { getSortCriteria } from "@pages/index/ui";
import IconCalendar from "@public/assets/IconCalendar.svg?react";
import IconDelete from "@public/assets/IconDelete.svg?react";
import { getColumns } from "@shared/api/mutation/bpAPI.ts";
import {
  CorrectionalRecordsDayResponse,
  getCorrectionalRecordsDay,
} from "@shared/api/mutation/routineProceduresAPI.ts";
import { ChildrenPanel } from "@shared/components/ChildrenPanel";
import { formatDate } from "@shared/components/MainTable/components/TopToolbar/CreateCalendarRowModal.tsx";
import {
  ColumnParameters,
  translateColumns,
} from "@shared/components/MainTable/MainTable.tsx";
import {
  getCustomIcons,
  getProcessedColumns,
  useLocalization,
} from "@shared/components/SimpleMainTable/SimpleMainTable.tsx";
import SvgButton from "@shared/components/SvgWrapper/SvgButton.tsx";
import { useQuery } from "@tanstack/react-query";
import i18n from "i18next";
import {
  MantineReactTable,
  MRT_Localization,
  MRT_SortingState,
  MRT_TableInstance,
  useMantineReactTable,
} from "mantine-react-table";

import classes from "./index.module.scss";

const useTableInstance = ({
  columns,
  data,
  sorting,
  setSorting,
  localization,
  isLoading,
}: {
  columns: ColumnParameters[];
  data: CorrectionalRecordsDayResponse[];
  sorting: MRT_SortingState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  localization: MRT_Localization;
  isLoading: boolean;
}): MRT_TableInstance<CorrectionalRecordsDayResponse> =>
  useMantineReactTable({
    icons: getCustomIcons,
    columns,
    data,
    enableEditing: true,
    renderRowActions: ({ row }) => (
      <>
        <Flex justify={"center"} align={"center"} gap={8}>
          <Tooltip label={"Удалить запись"} withArrow>
            <ActionIcon
              // disabled={!hasDeletePermission(permissions, permissionKey)}
              variant="transparent"
              color={"dimmed"}
              onClick={() => console.log(row.original)}
            >
              <SvgButton SvgIcon={IconDelete} fillColor="#999999" />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </>
    ),
    state: { sorting, isLoading },
    initialState: { density: "xs" },
    mantineTableBodyCellProps: { p: "4px 10px" },
    mantineLoadingOverlayProps: {
      loaderProps: { color: "#006040", type: "bars" },
    },
    mantineTableContainerProps: {
      style: { height: "30vh", overflowY: "auto" },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
        size: 48,
      },
    },
    localization,
    enableColumnResizing: true,
    enableFullScreenToggle: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableDensityToggle: false,
    enableStickyHeader: true,
    enableRowSelection: false,
    enableBatchRowSelection: false,
    enablePagination: false,
    enableColumnActions: false,
    mantineTableProps: { striped: "even", withColumnBorders: true },
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    isMultiSortEvent: () => true,
  });

export const RPSetPaymentTransactionsDatePage: FC = () => {
  const colorScheme = useMantineColorScheme();
  const currentDate = formatDate(new Date().toLocaleDateString(), "yyyy-mm-dd");
  const [performers, setPerformers] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery("(max-width: 1280px)");
  const [currentPaymentTransactionDate, setCurrentPaymentTransactionDate] =
    useState<string | null>(currentDate);
  const [newPaymentTransactionDate, setNewPaymentTransactionDate] = useState<
    string | null
  >(currentDate);
  const [makeCorrectionDate, setMakeCorrectionDate] = useState<string | null>(
    currentDate,
  );
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  useEffect(() => {
    setCurrentPaymentTransactionDate(currentDate);
  }, [currentDate]);

  const [errors, setErrors] = useState<{
    countryId: string;
    newPaymentTransactionDate: string;
    makeCorrectionDate: string;
    caption: string;
  }>({
    countryId: "",
    newPaymentTransactionDate: "",
    makeCorrectionDate: "",
    caption: "",
  });
  const commonBorderStyle = `1px solid ${colorScheme.colorScheme === "dark" ? "#444444" : "#DFDFDF"}`;
  let borderTopStyle = "none";
  if (isSmallScreen) {
    borderTopStyle = commonBorderStyle;
  }
  const sortCriteria = getSortCriteria(sorting);

  const { data: correctionalRecordsDayData } =
    useQuery<CorrectionalRecordsDayResponse>({
      queryKey: ["getCorrectionalRecordsDay", sortCriteria],
      queryFn: () => getCorrectionalRecordsDay(),
      staleTime: 0,
    });

  const localization = useLocalization(i18n);
  const { data: columnsTableData } = useQuery({
    queryKey: ["getColumnsTable"],
    queryFn: async () => {
      return await getColumns("/reference-book/calendar", "MAIN_TABLE");
    },
  });
  const columnsWithAccessorKey = translateColumns(columnsTableData);
  const processedColumns = getProcessedColumns(columnsWithAccessorKey);

  const rulesForNotesCorrection = useTableInstance({
    columns: processedColumns,
    data: correctionalRecordsDayData ?? [],
    sorting,
    setSorting,
    localization,
    isLoading: !correctionalRecordsDayData,
  });

  const handlePerformersChange = (values: string[]): void => {
    if (values.includes("all")) {
      setPerformers(performersData.map((item) => item.value));
    } else if (performers.includes("all") && !values.includes("all")) {
      setPerformers([]);
    } else {
      setPerformers(values.filter((v) => v !== "all"));
    }
  };

  const performersData = [
    { value: "all", label: "Для всех исполнителей" },
    { value: "petrov", label: "Петров Петр Петрович" },
    { value: "ivanov", label: "Иванов Иван Иванович" },
    { value: "sidorov", label: "Сидоров Владимир Григорьевич" },
    { value: "pushkin", label: "Пушкин Александр Сергеевич" },
    { value: "tyutchev", label: "Тютчев Федор Иванович" },
  ];

  return (
    <Flex
      direction={isSmallScreen ? "column" : "row"}
      p={0}
      gap={0}
      w="100%"
      h="100%"
      style={{ overflow: "auto" }}
    >
      <Flex
        direction={"column"}
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: isSmallScreen ? "100%" : "50%",
        }}
      >
        <Flex
          px={16}
          py={8}
          style={{
            borderBottom: commonBorderStyle,
          }}
        >
          <Button
            className={classes.button}
            h={30}
            w={"auto"}
            px={"16"}
            color="#007458"
            size="sm"
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            radius="xs"
            onClick={() => console.log("save")}
          >
            Установить
          </Button>
        </Flex>
        <Flex p={16} w={"100%"}>
          <ChildrenPanel
            title={"Даты проводки платежных операций"}
            customWidth={303}
          >
            <>
              <Flex direction="column" gap={"4px"} mt={"8px"}>
                <Text fw={400} size={"14px"} lh={"100%"}>
                  Текущая дата проводки платежных операций
                </Text>
                <DateInput
                  rightSection={
                    <SvgButton SvgIcon={IconCalendar} fillColor={"#999999"} />
                  }
                  valueFormat="DD.MM.YYYY"
                  value={currentPaymentTransactionDate}
                  disabled
                />
              </Flex>
              <Flex direction="column" gap={"4px"} mt={"8px"}>
                <Text fw={400} size={"14px"} lh={"100%"}>
                  Новая дата проводки платежных операций
                </Text>
                <DateInput
                  rightSection={
                    <SvgButton SvgIcon={IconCalendar} fillColor={"#999999"} />
                  }
                  value={newPaymentTransactionDate}
                  onChange={(value) => {
                    setNewPaymentTransactionDate(value);
                    setErrors((previous) => ({
                      ...previous,
                      newPaymentTransactionDate: "",
                    }));
                  }}
                  valueFormat="DD.MM.YYYY"
                  placeholder="Введите дату"
                  error={errors.newPaymentTransactionDate}
                  onKeyDown={(event) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      "Home",
                      "End",
                    ];
                    if (
                      !allowedKeys.includes(event.key) &&
                      !/[0-9.]/.test(event.key)
                    ) {
                      event.preventDefault();
                    }
                  }}
                  clearable
                />
              </Flex>
            </>
          </ChildrenPanel>
        </Flex>
      </Flex>
      <Flex
        direction={"column"}
        style={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: isSmallScreen ? "100%" : "50%",
          borderLeft: isSmallScreen ? undefined : commonBorderStyle,
        }}
      >
        <Flex
          px={16}
          py={8}
          style={{
            borderBottom: commonBorderStyle,
            borderTop: borderTopStyle,
          }}
        >
          <Button
            className={classes.button}
            h={30}
            w={"auto"}
            px={"16"}
            color="#007458"
            size="sm"
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            radius="xs"
            onClick={() => console.log("save")}
          >
            Открыть доступ
          </Button>
        </Flex>
        <Flex p={16} w={"100%"} direction={"column"} gap={"16px"}>
          <ChildrenPanel
            title={"Осуществление исправительных записей"}
            customWidth={538}
          >
            <>
              <Flex direction="column" gap={"4px"} mt={"8px"}>
                <Text fw={400} size={"14px"} lh={"100%"}>
                  Дата проводки для осуществления исправительных записей
                </Text>
                <DateInput
                  rightSection={
                    <SvgButton SvgIcon={IconCalendar} fillColor={"#999999"} />
                  }
                  value={makeCorrectionDate}
                  onChange={(value) => {
                    setMakeCorrectionDate(value);
                    setErrors((previous) => ({
                      ...previous,
                      makeCorrectionDate: "",
                    }));
                  }}
                  valueFormat="DD.MM.YYYY"
                  placeholder="Введите дату"
                  error={errors.makeCorrectionDate}
                  onKeyDown={(event) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                      "Home",
                      "End",
                    ];
                    if (
                      !allowedKeys.includes(event.key) &&
                      !/[0-9.]/.test(event.key)
                    ) {
                      event.preventDefault();
                    }
                  }}
                  clearable
                />
              </Flex>
              <Flex direction="column" gap={"4px"} mt={"8px"}>
                <Text fw={400} size={"14px"} lh={"100%"}>
                  Выбор исполнителей для осуществления исправительных записей
                </Text>
                <MultiSelect
                  placeholder={"Выберите исполнителей"}
                  data={performersData}
                  value={performers}
                  onChange={handlePerformersChange}
                  clearable
                />
              </Flex>
            </>
          </ChildrenPanel>
          <ChildrenPanel
            title={"Выданные права на исправление записей"}
            customWidth={538}
          >
            <Box mt={"8px"}>
              <MantineReactTable table={rulesForNotesCorrection} />
            </Box>
          </ChildrenPanel>
        </Flex>
      </Flex>
    </Flex>
  );
};
