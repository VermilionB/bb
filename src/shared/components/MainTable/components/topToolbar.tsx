import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Flex, Group, Loader, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import IconDetails from "@public/assets/details.svg?react";
import IconDoubleSum from "@public/assets/double-sum.svg?react";
import IconFilter from "@public/assets/filter.svg?react";
import IconSC360 from "@public/assets/IconSC360.svg?react";
import IconSum from "@public/assets/sum.svg?react";
import menuData from "@public/menuItems.json";
import { syncDataSCBank } from "@shared/api/mutation/bpAPI.ts";
import { DataExportButton } from "@shared/components/DataExportButton/DataExportButton.tsx";
import {
  ClientStatus,
  ParametersPost,
} from "@shared/components/MainTable/MainTable.tsx";
import { MenuItem } from "@shared/components/Menu";
import SvgButton from "@shared/components/SvgWrapper/SvgButton.tsx";
import { usePermissionsStore } from "@shared/store/permissionStore.ts";
import { IconReload } from "@tabler/icons-react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { MRT_GlobalFilterTextInput } from "mantine-react-table";

import classes from "../MainTable.module.scss";

import { CreateCalendarRowModal } from "./TopToolbar/CreateCalendarRowModal";
import { PrefillCalendarModal } from "./TopToolbar/PrefillCalendarModal";

interface TopToolbarProperties {
  refetch: () => void;
  parameters: ParametersPost;
  setOpened: (opened: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  canCreate: boolean;
  updateTable?: boolean;
  setClientStatus: React.Dispatch<React.SetStateAction<ClientStatus>>;
  setShowColumnFilters: React.Dispatch<React.SetStateAction<boolean>>;
  showColumnFilters: boolean;
  isLoading: boolean;
  disabledDataExport?: boolean;
}

export const hasSyncPermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return permissions.includes(`${key}:sync`);
};

export const hasFileUpdatePermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return (
    permissions.includes(`${key}:file-update`) ||
    permissions.includes(`${key}:update-from-a-file`)
  );
};

export const hasCreatePermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return permissions.includes(`${key}:create`);
};

export const hasUpdatePermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return permissions.includes(`${key}:update`);
};

export const hasDeletePermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return permissions.includes(`${key}:delete`);
};

export const hasPrefillPermission = (
  permissions: string[],
  key: string | undefined,
): boolean => {
  return permissions.includes(`${key}:pre-filling`);
};
export const findPermissionKey = (
  items: MenuItem[],
  pathname: string,
): string => {
  for (const item of items) {
    if (item.href === pathname) {
      return item.key;
    }

    if (item.items && Array.isArray(item.items)) {
      const foundKey = findPermissionKey(item.items, pathname);
      if (foundKey) {
        return foundKey;
      }
    }
  }
  return "";
};

const StatusCheckbox: FC<{
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setClientStatus: React.Dispatch<React.SetStateAction<ClientStatus>>;
  link: string | undefined;
  classNameLabel: string;
}> = ({ checked, setChecked, setClientStatus, link, classNameLabel }) => {
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const newChecked = event.currentTarget.checked;
    setChecked(newChecked);
    setClientStatus(newChecked ? "ALL" : "NOT_DELETED");
  };
  return (
    <Checkbox
      classNames={{
        label: classNameLabel,
      }}
      size={"xs"}
      color={"#007458"}
      checked={checked}
      label={`Показать все ${
        link === "/business-partner-accounts" ? "счета" : "банки"
      }, включая закрытые`}
      onChange={handleCheckboxChange}
    />
  );
};

const SyncButton: FC<{
  link: string | undefined;
  isSmallScreen: boolean | undefined;
  permissions: string[];
  permissionKey: string;
  mutation: UseMutationResult<unknown, unknown, string, unknown>;
  t: (key: string) => string;
}> = ({ link, isSmallScreen, permissions, permissionKey, mutation, t }) => {
  const renderSyncButtonLabel = (): string | ReactElement => {
    if (mutation.isPending) {
      return <Loader color="#fff" size={15} />;
    }
    if (isSmallScreen) {
      return <SvgButton SvgIcon={IconSC360} fillColor={"#fff"} />;
    }
    switch (link) {
      case "/business-partner": {
        return t("top-toolbar:top-toolbar.sync-clients");
      }
      case "/business-partner-accounts": {
        return t("top-toolbar:top-toolbar.sync-accounts");
      }
      default: {
        return "";
      }
    }
  };

  return (
    <Tooltip
      label={`Обновление ${link === "/business-partner" ? "клиентов" : "счетов"} из SC-Bank.360.Corporate`}
      withArrow
    >
      <Button
        disabled={
          !hasSyncPermission(permissions, permissionKey) || mutation.isPending
        }
        className={classes.button}
        h={30}
        w={isSmallScreen ? 30 : "auto"}
        px={isSmallScreen ? "0" : "16"}
        color="#007458"
        size="sm"
        style={{
          fontSize: "12px",
          minWidth: isSmallScreen ? 30 : 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        radius="xs"
        onClick={() => mutation.mutate(link!)}
      >
        {renderSyncButtonLabel()}
      </Button>
    </Tooltip>
  );
};

const CreatePrefillGroup: FC<{
  link: string | undefined;
  permissions: string[];
  permissionKey: string;
  t: (key: string) => string;
  onCreate: () => void;
  onPreFill: () => void;
}> = ({ link, permissions, permissionKey, t, onCreate, onPreFill }) => {
  if (
    !link ||
    link === "/business-partner" ||
    link === "/business-partner-accounts" ||
    (link.includes("reference-book") && link !== "/reference-book/calendar")
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <Group gap={8}>
      <Tooltip label="Предзаполнение" withArrow>
        <Button
          disabled={!hasPrefillPermission(permissions, permissionKey)}
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
          onClick={onPreFill}
        >
          {t("top-toolbar:top-toolbar.pre-filling")}
        </Button>
      </Tooltip>
      <Tooltip label="Добавить" withArrow>
        <Button
          disabled={!hasCreatePermission(permissions, permissionKey)}
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
          onClick={onCreate}
        >
          {t("top-toolbar:top-toolbar.create-new-row")}
        </Button>
      </Tooltip>
    </Group>
  );
};

const TopToolbar: FC<TopToolbarProperties> = ({
  refetch,
  parameters,
  setOpened,
  table,
  updateTable,
  setClientStatus,
  setShowColumnFilters,
  showColumnFilters,
  isLoading,
  disabledDataExport,
}) => {
  const { permissions } = usePermissionsStore();
  const location = useLocation();
  const [t] = useTranslation(["top-toolbar"]);
  const [checked, setChecked] = useState(parameters.status === "ALL");
  const [openedCalendarRowCreateModal, setOpenedCalendarRowCreateModal] =
    useState(false);
  const [openedCalendarPrefillModal, setOpenedCalendarPrefillModal] =
    useState(false);
  const { link } = parameters;
  const isSmallScreen = useMediaQuery(
    link === "/reference-book/calendar"
      ? "(max-width: 1100px)"
      : "(max-width: 1341px)",
  );
  const menuItems = menuData as MenuItem[];

  const permissionKey = findPermissionKey(menuItems, location.pathname);

  useEffect(() => {
    setChecked(parameters.status === "ALL");
  }, [parameters.status]);

  const mutation = useMutation<unknown, unknown, string>({
    mutationFn: async (_link: string) => {
      return await syncDataSCBank(_link);
    },
    onSuccess: () => {
      refetch();
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notifications.show({
        title: "Ошибка",
        message: error.message || "Произошла ошибка при синхронизации данных",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  const create = (): void => {
    setOpenedCalendarRowCreateModal(true);
  };

  const preFill = (): void => {
    setOpenedCalendarPrefillModal(true);
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <Flex
        direction={"row"}
        gap={"md"}
        py={8}
        px={16}
        justify={"space-between"}
      >
        <Group gap="8px">
          <Tooltip label="Обновить" withArrow>
            <Button
              w={30}
              h={30}
              p={0}
              radius="xs"
              color="#007458"
              onClick={refetch}
            >
              <IconReload width={20} height={20} />
            </Button>
          </Tooltip>

          {updateTable && (
            <>
              {link === "/business-partner" ||
              link === "/business-partner-accounts" ? (
                <SyncButton
                  link={link}
                  isSmallScreen={isSmallScreen}
                  permissions={permissions}
                  permissionKey={permissionKey}
                  mutation={mutation}
                  t={t}
                />
              ) : (
                <Tooltip label="Обновить из файла" withArrow>
                  <Button
                    disabled={
                      !hasFileUpdatePermission(permissions, permissionKey)
                    }
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
                    onClick={() => setOpened(true)}
                  >
                    {t("top-toolbar:top-toolbar.update-table")}
                  </Button>
                </Tooltip>
              )}
            </>
          )}

          <CreatePrefillGroup
            link={link}
            permissions={permissions}
            permissionKey={permissionKey}
            t={t}
            onCreate={create}
            onPreFill={preFill}
          />
          {link.includes("/reference-book/") &&
            link !== "/reference-book/calendar" && (
              <Button
                // disabled={!hasCreatePermission(permissions, permissionKey)}
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
                onClick={() => table.setCreatingRow(true)}
              >
                {t("top-toolbar:top-toolbar.create-new-row-common")}
              </Button>
            )}

          {(link === "/business-partner" ||
            link === "/business-partner-accounts") && (
            <StatusCheckbox
              checked={checked}
              setChecked={setChecked}
              setClientStatus={setClientStatus}
              link={link}
              classNameLabel={classes.checkboxLabel}
            />
          )}
        </Group>

        <Flex gap={"5"} direction={"row"} align={"center"}>
          <Button
            w={30}
            h={30}
            p={5}
            radius="xs"
            color="#007458"
            disabled
            className={classes.button}
          >
            <IconDetails />
          </Button>
          <Button
            w={30}
            h={30}
            p={5}
            radius="xs"
            color="#007458"
            disabled
            className={classes.button}
          >
            <IconDoubleSum />
          </Button>
          <Button
            w={30}
            h={30}
            p={5}
            radius="xs"
            color="#007458"
            disabled
            className={classes.button}
          >
            <IconSum />
          </Button>
          <DataExportButton
            w={30}
            h={30}
            p={5}
            radius={"xs"}
            color={"#007458"}
            parameters={parameters}
            disabled={disabledDataExport}
          />
          <Tooltip label="Фильтр" withArrow>
            <Button
              w={30}
              h={30}
              p={5}
              className={classes.button}
              radius="xs"
              color="#007458"
              onClick={() => setShowColumnFilters(!showColumnFilters)}
            >
              <IconFilter />
            </Button>
          </Tooltip>
          <MRT_GlobalFilterTextInput
            placeholder={"Поиск по таблице"}
            size={"xs"}
            w={"240px"}
            table={table}
          />
        </Flex>
      </Flex>

      {link === "/reference-book/calendar" && (
        <>
          <CreateCalendarRowModal
            opened={openedCalendarRowCreateModal}
            setOpened={setOpenedCalendarRowCreateModal}
            refetch={refetch}
          />
          <PrefillCalendarModal
            opened={openedCalendarPrefillModal}
            setOpened={setOpenedCalendarPrefillModal}
            refetch={refetch}
          />
        </>
      )}
    </>
  );
};

export default TopToolbar;
