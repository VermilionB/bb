import {
  FC,
  JSX,
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Flex, Text, useMantineColorScheme } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { MRT_Localization_BY } from "@public/locales/MRT_Localization_BY.ts";
import { MRT_Localization_RU_Custom } from "@public/locales/MRT_Localization_RU_Custom";
import { getColumns } from "@shared/api/mutation/bpAPI.ts";
import {
  ITableDataResponse,
  postApiData,
} from "@shared/api/mutation/fetchTableData.ts";
import { BusinessPartnerAccountsInfoModal } from "@shared/components/BusinessPartnerAccountsInfoModal/BusinessPartnerAccountsInfoModal.tsx";
import { BusinessPartnerInfoModal } from "@shared/components/BusinessPartnerInfoModal/BusinessPartnerInfoModal.tsx";
import CreateRowModalContent from "@shared/components/MainTable/components/CreateRowModalContent.tsx";
import EditRowModalContent from "@shared/components/MainTable/components/EditRowModalContent.tsx";
import PopoverCell from "@shared/components/MainTable/components/PopoverCell.tsx";
import RowActions from "@shared/components/MainTable/components/rowActions.tsx";
import { CalendarDeleteModal } from "@shared/components/MainTable/components/RowActions/CalendarDeleteModal.tsx";
import { CalendarEditModal } from "@shared/components/MainTable/components/RowActions/CalendarEditModal.tsx";
import { DeleteConfirmModal } from "@shared/components/MainTable/components/RowActions/DeleteConfirmModal.tsx";
import TopToolbar from "@shared/components/MainTable/components/topToolbar.tsx";
import { getCustomIcons } from "@shared/components/SimpleMainTable/SimpleMainTable.tsx";
import UpdateTableModal from "@shared/components/UpdateTableModal/UpdateTableModal.tsx";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_ColumnFiltersState,
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";

import modalStyles from "./components/TopToolbar/CalendarModals.module.scss";
import classes from "./MainTable.module.scss";
type OnChangeFunction<T> = (updaterOrValue: T | ((old: T) => T)) => void;

interface MainTableProperties {
  updateTable: boolean;
  link: string;
  disabledDataExport?: boolean;
}

export interface SortCriteria {
  [key: string]: "ASC" | "DESC";
}
export interface FilterCriteria {
  [key: string]: string | number;
}

export interface ParametersPost {
  link: string;
  page: number;
  size: number;
  searchText: string;
  sortCriteria: SortCriteria;
  searchCriteria: FilterCriteria;
  status: ClientStatus | string;
}

interface InfiniteTableDataResponse {
  pages: ITableDataResponse[];
  pageParams: number[];
}

export interface ColumnParameters {
  header: string;
  accessorKey: string;
}

export type ClientStatus = "ALL" | "OPEN" | "CLOSED";
export const translateColumns = (
  tableColumnsTranslated: Record<string, string> | undefined,
): ColumnParameters[] => {
  const columns = tableColumnsTranslated || {};

  return Object.keys(columns)
    .map((column) => {
      if (column === "weekendId") {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }
      return {
        accessorKey: column,
        header: columns[`${column}`] || column,
      };
    })
    .filter(
      (
        column,
      ): column is {
        header: string;
        accessorKey: string;
      } => column !== null,
    );
};

// eslint-disable-next-line complexity
export const MainTable: FC<MainTableProperties> = ({
  updateTable,
  link,
  disabledDataExport,
}) => {
  const size = 30;
  const tableContainerReference = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceReference = useRef<MRT_RowVirtualizer>(null);
  const [showColumnFilters, setShowColumnFilters] = useState<boolean>(false);
  const [localization, setLocalization] = useState(MRT_Localization_RU_Custom);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [filters, setFilters] = useState<MRT_ColumnFiltersState>([]);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [openedBPInfoModal, setOpenedBPInfoModal] = useState(false);
  const [openedBPAInfoModal, setOpenedBPAInfoModal] = useState(false);
  const [openedEditModal, setOpenedEditModal] = useState<boolean>(false);
  const [openedDeleteModal, setOpenedDeleteModal] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [clientStatus, setClientStatus] = useState<ClientStatus>("OPEN");
  const { i18n } = useTranslation();
  const colorScheme = useMantineColorScheme();
  const [error, setError] = useState<string | undefined>();
  const [clientId, setClientId] = useState<number | undefined>();
  const [currentRow, setCurrentRow] = useState<MRT_RowData>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sortCriteria: SortCriteria = {};
  for (const sort of sorting) {
    const formattedColumn = sort.id;
    // .replace(/([a-z])([A-Z])/g, "$1_$2")
    // .toUpperCase();
    sortCriteria[`${formattedColumn}`] = sort.desc ? "DESC" : "ASC";
  }

  const debouncedGlobalFilter = useDebouncedCallback((value: string) => {
    if (value !== globalFilter) {
      setGlobalFilter(value);
    }
  }, 400);

  const handleGlobalFilterChange = (value: string): void => {
    setGlobalFilter(value);
    debouncedGlobalFilter(value);
  };

  const debouncedColumnFilters = useDebouncedCallback((value) => {
    setFilters(value);
  }, 400);

  const handleColumnFilterChange: OnChangeFunction<MRT_ColumnFiltersState> = (
    updaterOrValue,
  ) => {
    if (typeof updaterOrValue === "function") {
      const newFilters = updaterOrValue(filters);
      debouncedColumnFilters(newFilters);
    } else {
      debouncedColumnFilters(updaterOrValue);
    }
  };

  const columnSearchCriteria: FilterCriteria = {};
  for (const filter of filters) {
    if (typeof filter.value === "string" || typeof filter.value === "number") {
      columnSearchCriteria[filter.id] = filter.value;
    }
  }

  useEffect(() => {
    const handleLanguageChange = (lng: string): void => {
      setLocalization(
        lng === "by" ? MRT_Localization_BY : MRT_Localization_RU_Custom,
      );
    };

    handleLanguageChange(i18n.language);

    i18n.on("languageChanged", handleLanguageChange);

    return (): void => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const parametersPost: ParametersPost = {
    link: link,
    page: 0,
    size: size,
    searchText: globalFilter ?? "",
    sortCriteria: sortCriteria,
    searchCriteria: columnSearchCriteria,
    status: link.includes("/reference-book") ? "NOT_DELETED" : clientStatus,
  };
  const { data, refetch, fetchNextPage, isRefetching, isLoading } =
    useInfiniteQuery<ITableDataResponse>({
      queryKey: ["apiData", parametersPost],
      queryFn: async ({ pageParam: pageParameter = 0 }) => {
        setError(undefined);
        return await postApiData({
          ...parametersPost,
          page: Number(pageParameter),
        });
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.content.length > 0 ? allPages.length : undefined;
      },
      initialPageParam: 0,
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  const queryClient = useQueryClient();
  const handleRefetch = async (): Promise<void> => {
    setIsLoadingMore(true);
    const queryData = queryClient.getQueryData(["apiData", parametersPost]) as  // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { data: any }
      | undefined;
    const existingData = queryData?.data;

    await refetch();

    if (existingData && existingData.pages.length > 0) {
      queryClient.setQueryData(
        ["apiData", parametersPost],
        (content: InfiniteTableDataResponse) => ({
          pages: content.pages.slice(0, 1),
          pageParams: content.pageParams.slice(0, 1),
        }),
      );
    }

    if (tableContainerReference.current) {
      tableContainerReference.current.scrollTo(0, 0);
    }
    setIsLoadingMore(false);
  };

  const { data: columnsTableData, isLoading: isLoadingColumns } = useQuery({
    queryKey: ["getColumnsTable", link],
    queryFn: async () => {
      return await getColumns(link, "TABLE");
    },
  });

  const cellValues = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.page?.totalElements ?? 0;
  const totalFetched = cellValues.length;
  const fetchMoreOnBottomReached = useCallback(
    // eslint-disable-next-line consistent-return
    (containerReferenceElement?: HTMLDivElement | null) => {
      if (containerReferenceElement && !isLoadingMore) {
        const { scrollHeight, scrollTop, clientHeight } =
          containerReferenceElement;
        if (
          scrollHeight - scrollTop - clientHeight < 200 &&
          !isRefetching &&
          totalFetched < totalDBRowCount
        ) {
          setIsLoadingMore(true);
          return fetchNextPage()
            .then((_data) => {
              return _data;
            })
            .catch((_error) => {
              console.error("Error fetching next page:", _error);
              throw _error;
            })
            .finally(() => {
              setIsLoadingMore(false);
            });
        }
      }
    },
    [isLoadingMore, isRefetching, totalFetched, totalDBRowCount, fetchNextPage],
  );

  useEffect(() => {
    if (rowVirtualizerInstanceReference.current) {
      try {
        rowVirtualizerInstanceReference.current.scrollToIndex(0);
      } catch (error_) {
        console.error(error_);
      }
    }
  }, [sorting, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerReference.current);
  }, [fetchMoreOnBottomReached]);
  const columnsWithAccessorKey = translateColumns(columnsTableData);

  const processedColumns =
    columnsWithAccessorKey.length > 0
      ? columnsWithAccessorKey.map((column) => {
          return {
            ...column,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Cell: ({ cell }: { cell: any }): JSX.Element => {
              const cellValue = cell.getValue();
              if (column.accessorKey === "status") {
                switch (cellValue) {
                  case "IN_PROCESSING": {
                    return (
                      <div className={classes.statusCell}>
                        {/*<Loader size="sm" />*/}
                        <Text c={"yellow"}>В обработке</Text>
                      </div>
                    );
                  }
                  case "ERROR": {
                    return (
                      <div className={classes.statusCell}>
                        {/*<IconSquareX color={"red"} />*/}
                        <Text c={"red"}>Ошибка</Text>
                      </div>
                    );
                  }
                  case "SUCCESS": {
                    return (
                      <div className={classes.statusCell}>
                        {/*<IconRosetteDiscountCheckFilled color={"green"} />*/}
                        <Text c={"green"}>Успешно</Text>
                      </div>
                    );
                  }
                  case "CANCELLED": {
                    return (
                      <div className={classes.statusCell}>
                        {/*<IconRosetteDiscountCheckFilled color={"green"} />*/}
                        <Text c={"gray"}>Отменено</Text>
                      </div>
                    );
                  }
                  case "PENDING": {
                    return (
                      <div className={classes.statusCell}>
                        {/*<IconRosetteDiscountCheckFilled color={"green"} />*/}
                        <Text c={"orange"}>В ожидании</Text>
                      </div>
                    );
                  }
                  // No default
                }
              }
              if (
                column.accessorKey === "currentBalance" ||
                column.accessorKey === "equivalentBalance"
              ) {
                let textColor;
                if (cellValue > 0) {
                  textColor = "#006040";
                } else if (cellValue < 0) {
                  textColor = "#A81E3C";
                } else {
                  textColor = undefined;
                }
                return (
                  <div className={classes.cell}>
                    <Text ta={"end"} truncate="end" size="sm" c={textColor}>
                      {cellValue}
                    </Text>
                  </div>
                );
              }

              return (
                <div className={classes.cell}>
                  <PopoverCell>{cellValue}</PopoverCell>
                </div>
              );
            },
            size: column.header?.length > 12 ? 270 : 180,
            sortDescFirst: true,
          };
        })
      : [];

  const table = useMantineReactTable({
    onGlobalFilterChange: handleGlobalFilterChange,
    renderEditRowModalContent: ({ row }) => (
      <EditRowModalContent
        row={row}
        editModalOpened={openedEditModal}
        setEditRowModalOpened={setOpenedEditModal}
        canEdit={true}
        table={table}
        link={link}
        refetch={refetch}
      />
    ),
    // eslint-disable-next-line @typescript-eslint/no-shadow
    renderCreateRowModalContent: ({ table, row }) => (
      <CreateRowModalContent
        table={table}
        row={row}
        processedColumns={processedColumns}
        createRowModalOpened={createModalOpened}
        setCreateRowModalOpened={setCreateModalOpened}
        link={link}
        refetch={refetch}
      />
    ),

    renderRowActions: ({ row }) => (
      <RowActions
        table={table}
        row={row}
        setRow={setCurrentRow}
        refetch={refetch}
        link={link}
        setOpenedDeleteModal={setOpenedDeleteModal}
        setOpenedEditModal={setOpenedEditModal}
        setCurrentRow={setCurrentRow}
      />
    ),
    renderTopToolbar: () => (
      <TopToolbar
        showColumnFilters={showColumnFilters}
        setShowColumnFilters={setShowColumnFilters}
        parameters={parametersPost}
        refetch={handleRefetch}
        canCreate={true}
        setOpened={setOpenedUpdateModal}
        table={table}
        updateTable={updateTable}
        setClientStatus={setClientStatus}
        isLoading={isLoadingColumns}
        disabledDataExport={disabledDataExport}
      />
    ),
    onCreatingRowSave: async ({ exitCreatingMode }) => {
      exitCreatingMode();
    },
    mantineTableBodyRowProps: ({ row }) => {
      const isCurrentRow = currentRow?.id === row.id;

      let baseStyle: { cursor?: string; background?: string } = {};
      switch (link) {
        case "/business-partner": {
          baseStyle = {
            cursor: "pointer",
          };
          break;
        }
        case "/business-partner-accounts": {
          baseStyle = {
            background: row.original.accountStatus === 50 ? "#E89999" : "",
            cursor: "pointer",
          };
          break;
        }
        default: {
          baseStyle = {};
        }
      }

      return {
        onClick: async (): Promise<void> => {
          if (link === "/business-partner") {
            setClientId(row.original.clientId);
            setOpenedBPInfoModal(true);
          } else if (link === "/business-partner-accounts") {
            setClientId(row.original.accountInternalId);
            setCurrentRow(row);
            setOpenedBPAInfoModal(true);
          }
        },
        style: {
          ...baseStyle,
          backgroundColor:
            isCurrentRow && link === "/business-partner-accounts"
              ? "gray"
              : baseStyle.background || "",
        },
      };
    },

    icons: getCustomIcons,
    enableFilters: true,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
        size: 80,
      },
    },
    manualFiltering: true,
    editDisplayMode: "modal",
    enableRowVirtualization: true,
    rowVirtualizerOptions: {
      overscan: 30,
      estimateSize: () => 100,
    },
    enableEditing: link.includes("/reference-book/"),
    columns: processedColumns,
    data: cellValues,
    state: {
      globalFilter,
      isLoading: isLoading,
      sorting,
      showColumnFilters: showColumnFilters,
    },
    initialState: {
      density: "xs",
      showGlobalFilter: true,
      showColumnFilters: false,
    },
    mantineTableBodyCellProps: {
      h: "35px",
      p: "4px 10px",
    },
    mantineLoadingOverlayProps: {
      loaderProps: { color: "#006040", type: "bars" },
    },
    mantineBottomToolbarProps: {
      style: {
        alignItems: "center",
        minHeight: 0,
      },
    },
    mantineTableContainerProps: {
      ref: tableContainerReference,
      onScroll: (event: UIEvent<HTMLDivElement>) => {
        fetchMoreOnBottomReached(event.target as HTMLDivElement);
      },
      style: {
        height: "calc(100vh - 130px)",
        overflowY: "auto",
        borderTop: `1px solid ${colorScheme.colorScheme === "dark" ? "#444444" : "#DFDFDF"}`,
      },
    },
    mantineEditRowModalProps: {
      title: "Редактирование записи",
      classNames: {
        content: modalStyles.content,
        body: modalStyles.mantineModalBody,
        header: modalStyles.header,
        title: modalStyles.title,
        close: modalStyles.close,
      },
      overlayProps: { backgroundOpacity: 0.55 },
      centered: true,
      withCloseButton: true,
      closeOnClickOutside: true,
    },
    mantineCreateRowModalProps: {
      title: "Добавить запись",
      classNames: {
        content: modalStyles.content,
        body: modalStyles.mantineModalBody,
        header: modalStyles.header,
        title: modalStyles.title,
        close: modalStyles.close,
      },
      overlayProps: { backgroundOpacity: 0.55 },
      centered: true,
      withCloseButton: true,
    },
    localization: localization,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableStickyHeader: true,
    enableRowSelection: false,
    enableMultiRowSelection: false,
    enableBatchRowSelection: false,
    enablePagination: false,
    enableColumnResizing: true,
    enableColumnVirtualization: false,
    enableColumnActions: false,
    mantineTableProps: {
      striped: "even",
      withColumnBorders: true,
    },
    mantineEditTextInputProps: {
      variant: "filled",
      radius: "md",
      size: "md",
      type: "text",
    },
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFilterChange,
    isMultiSortEvent: () => true,
  });

  if (error) {
    return (
      <Flex
        direction={"column"}
        p={0}
        m={0}
        h={"100%"}
        w={"100%"}
        align="center"
        justify="center"
      >
        {error}
      </Flex>
    );
  }

  return (
    <Flex direction={"column"} p={0} m={0} h={"100%"} w={"100%"}>
      <MantineReactTable table={table} />
      {updateTable && (
        <UpdateTableModal
          link={link}
          opened={openedUpdateModal}
          close={() => setOpenedUpdateModal(false)}
        />
      )}
      {link === "/business-partner" && clientId && (
        <BusinessPartnerInfoModal
          clientId={clientId}
          opened={openedBPInfoModal}
          setOpened={setOpenedBPInfoModal}
        />
      )}
      {link === "/business-partner-accounts" && clientId && (
        <BusinessPartnerAccountsInfoModal
          accountInternalId={clientId}
          opened={openedBPAInfoModal}
          setOpened={setOpenedBPAInfoModal}
          setCurrentRow={setCurrentRow}
        />
      )}
      {link === "/reference-book/calendar" && currentRow && (
        <>
          <CalendarEditModal
            row={currentRow}
            opened={openedEditModal}
            setOpened={setOpenedEditModal}
            refetch={refetch}
          />
          <CalendarDeleteModal
            row={currentRow}
            opened={openedDeleteModal}
            setOpened={setOpenedDeleteModal}
            refetch={refetch}
          />
        </>
      )}
      {link.includes("/reference-book/") &&
        link !== "/reference-book/calendar" && (
          <DeleteConfirmModal
            row={currentRow}
            opened={openedDeleteModal}
            setOpened={setOpenedDeleteModal}
            refetch={refetch}
            link={link}
          />
        )}
    </Flex>
  );
};
