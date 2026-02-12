import React, { JSX, useState } from "react";
import { ReactElement } from "react";
import { Button, Card, Group, Modal, Stack } from "@mantine/core";
import { getColumns, getInfo } from "@shared/api/mutation/bpAPI.ts";
import { BusinessPartnerInfoModal } from "@shared/components/BusinessPartnerInfoModal/BusinessPartnerInfoModal.tsx";
import { DataField } from "@shared/components/BusinessPartnerInfoModal/DataField.tsx";
import { translateColumns } from "@shared/components/MainTable/MainTable.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MRT_RowData } from "mantine-react-table";

import classes from "../BusinessPartnerAccountsInfoModal/BusinessPartnerAccountsInfoModal.module.scss";

export interface BusinessPartnerAccountsData {
  ibanAccountNumber: string;
  accountCurrency: string;
  accountDistinguisher: string;
  accountInternalId: string;
  accountName: string;
  accountStatus: number;
  accountFinancialConditions: string;
  accountOpenDate: string;
  accountCloseDate: string;
  clientId: number;
  currentBalance: number;
  equivalentBalance: number;
  userName: string;
  restrictions: string;
  id: number;
}

type BusinessPartnerAccountsDataKeys = keyof BusinessPartnerAccountsData;

const renderDataFields = (
  data: BusinessPartnerAccountsData,
  keys: BusinessPartnerAccountsDataKeys[],
  getColumn: (key: string) => { header: string; accessorKey: string },
): ReactElement[] => {
  return keys.map((key) => {
    const value =
      data[getColumn(key)?.accessorKey as BusinessPartnerAccountsDataKeys];
    let style = {};

    if (
      key === ("equivalentBalance" as BusinessPartnerAccountsDataKeys) ||
      key === ("currentBalance" as BusinessPartnerAccountsDataKeys)
    ) {
      if (Number(value) < 0) {
        style = { color: "#A81E3C" };
      } else if (Number(value) > 0) {
        style = { color: "#006040" };
      }
    }

    return (
      <DataField
        key={key}
        label={getColumn(key)?.header}
        value={value}
        style={style}
      />
    );
  });
};

export const BusinessPartnerAccountsInfoModal = ({
  accountInternalId,
  opened,
  setOpened,
  setCurrentRow,
}: {
  accountInternalId: number | undefined;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentRow: React.Dispatch<React.SetStateAction<MRT_RowData | undefined>>;
}): JSX.Element => {
  const queryClient = useQueryClient();

  const { data: columnsCardData } = useQuery({
    queryKey: ["getColumnsCard", "/business-partner-accounts"],
    queryFn: async () => {
      return await getColumns("/business-partner-accounts", "CARD");
    },
  });

  const { data: businessPartnerAccountsData } = useQuery({
    queryKey: ["getBusinessPartnerAccountsData", accountInternalId],
    queryFn: async () => {
      if (accountInternalId) {
        return await getInfo("/business-partner-accounts", accountInternalId);
      }
      throw new Error("Данные отсутствуют");
    },
    enabled: !!accountInternalId && opened,
    staleTime: 0,
  });

  const columnsTranslated = columnsCardData ?? [];
  const columns = translateColumns(columnsTranslated);
  const getColumn = (
    accessorKey: string,
  ): { accessorKey: string; header: string } =>
    columns.find((item) => item.accessorKey === accessorKey) ?? {
      header: "",
      accessorKey: "",
    };

  const [openedBPInfoModal, setOpenedBPInfoModal] = useState(false);

  const cardData = [
    ["ibanAccountNumber", "accountName", "accountCurrency"],
    [
      "currentBalance",
      "equivalentBalance",
      "clientId",
      "accountFinancialConditions",
      "restrictions",
    ],
    [
      "accountOpenDate",
      "accountCloseDate",
      "userName",
      "accountStatus",
      "accountInternalId",
      "accountDistinguisher",
    ],
  ];

  const handleCloseBPAInfoModal = (): void => {
    queryClient.setQueryData(
      ["getBusinessPartnerAccountsData", accountInternalId],
      () => {},
    );
    setOpened(false);
    setOpenedBPInfoModal(false);
    setCurrentRow(undefined);
  };
  return businessPartnerAccountsData &&
    Object.keys(businessPartnerAccountsData).length > 0 ? (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseBPAInfoModal}
        title={`Счет: ${businessPartnerAccountsData.ibanAccountNumber}`}
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
        size={"80%"}
      >
        <Stack gap={16} p={"16px"}>
          {cardData.map((keys, index) => (
            <Card
              key={index}
              w="100%"
              p={4}
              style={{ borderBottom: "1px solid #EBEDF0" }}
            >
              <Group gap={16}>
                {renderDataFields(
                  businessPartnerAccountsData,
                  keys as BusinessPartnerAccountsDataKeys[],
                  getColumn,
                )}
              </Group>
            </Card>
          ))}
        </Stack>
        <Group gap={8} px={"16px"} py={"8px"}>
          <Button className={classes.button} disabled>
            Финансовые условия
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              if (businessPartnerAccountsData) {
                setOpenedBPInfoModal(!openedBPInfoModal);
              }
            }}
          >
            Деловой партнер
          </Button>
          <Button className={classes.button} disabled>
            Выписка по счету
          </Button>
          <Button className={classes.button} disabled>
            Ограничения по ЛС
          </Button>
          <Button className={classes.button} disabled>
            Прочее
          </Button>
        </Group>
      </Modal>
      <BusinessPartnerInfoModal
        clientId={businessPartnerAccountsData.clientId}
        opened={openedBPInfoModal}
        setOpened={setOpenedBPInfoModal}
      />
    </>
  ) : (
    <></>
  );
};
