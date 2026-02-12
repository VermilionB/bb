import React, { JSX, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import IconDelete from "@public/assets/IconDelete.svg?react";
import IconEdit from "@public/assets/IconEdit.svg?react";
import menuData from "@public/menuItems.json";
import { IContentItem } from "@shared/api/mutation/fetchTableData.ts";
import {
  findPermissionKey,
  hasDeletePermission,
  hasUpdatePermission,
} from "@shared/components/MainTable/components/topToolbar.tsx";
import { MenuItem } from "@shared/components/Menu";
import SvgButton from "@shared/components/SvgWrapper/SvgButton";
import { usePermissionsStore } from "@shared/store/permissionStore.ts";
import { useLocation } from "@tanstack/react-router";
import { MRT_RowData, MRT_TableInstance } from "mantine-react-table";

interface RowActionsProperties {
  table: MRT_TableInstance<IContentItem>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  setRow: (row: MRT_RowData) => void;
  refetch: () => void;
  link: string;
  setOpenedEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRow: React.Dispatch<React.SetStateAction<MRT_RowData | undefined>>;
}

const RowActions = ({
  table,
  row,
  setRow,
  setOpenedEditModal,
  setOpenedDeleteModal,
  setCurrentRow,
}: RowActionsProperties): JSX.Element => {
  const { t } = useTranslation(["row-actions"]);
  const { permissions } = usePermissionsStore();
  const location = useLocation();
  const menuItems = menuData as MenuItem[];
  const permissionKey = findPermissionKey(menuItems, location.pathname);

  useEffect(() => {
    setRow(row);
  }, [row, setRow]);

  const handleEditClick = (): void => {
    setCurrentRow(row);
    table.setEditingRow(row);
    setOpenedEditModal(true);
  };

  const handleDeleteClick = (): void => {
    setCurrentRow(row);
    setOpenedDeleteModal(true);
  };

  return (
    <>
      <Flex justify={"center"} align={"center"} gap={8}>
        <Tooltip label={t("row-actions:row-actions.edit")} withArrow>
          <ActionIcon
            disabled={!hasUpdatePermission(permissions, permissionKey)}
            variant="transparent"
            color={"dimmed"}
            onClick={handleEditClick}
          >
            <SvgButton SvgIcon={IconEdit} fillColor="#999999" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={`${t("row-actions:row-actions.delete")}`} withArrow>
          <ActionIcon
            disabled={!hasDeletePermission(permissions, permissionKey)}
            variant="transparent"
            color={"dimmed"}
            onClick={handleDeleteClick}
          >
            <SvgButton SvgIcon={IconDelete} fillColor="#999999" />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </>
  );
};

export default RowActions;
