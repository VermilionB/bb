import React, { JSX } from "react";
import { ReactElement } from "react";
import { Card, Group, Modal, Stack } from "@mantine/core";
import { getColumns, getInfo } from "@shared/api/mutation/bpAPI.ts";
import { DataField } from "@shared/components/BusinessPartnerInfoModal/DataField.tsx";
import { translateColumns } from "@shared/components/MainTable/MainTable.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import classes from "../BusinessPartnerInfoModal/BusinessPartnerInfoModal.module.scss";

export interface BusinessPartnerData {
  clientName?: string;
  clientOpenDate?: string;
  clientCloseDate?: string;
  clientShortName?: string;
  clientShortNameLat?: string;
  accOwnerStatus?: string;
  unn?: string;
  inn?: string;
  isResident?: boolean;
  state?: string;
  contractType?: string;
  swiftCode?: string;
  bankBicCode?: string;
  address?: string;
  addressSoato?: string;
  addressState?: string;
  addressPostcode?: string;
  addressRegion?: string;
  addressDistrictName?: string;
  addressUnitaryArea?: string;
  addressSettlementName?: string;
  addressSettlementType?: string;
  addressStreetType?: string;
  addressStreetName?: string;
  addressHouseNum?: string;
  addressBuilding?: string;
  addressApartmentNum?: string;
  swiftRusName?: string;
  swiftName?: string;
  swiftRusAddress?: string;
  swiftAddress?: string;
  clientId?: string;
  registrationNumber?: string;
  foreignClientCode?: string;
}

type BusinessPartnerDataKeys = keyof BusinessPartnerData;

const renderDataFields = (
  data: BusinessPartnerData,
  keys: BusinessPartnerDataKeys[],
  getColumn: (key: string) => { header: string; accessorKey: string },
): ReactElement[] => {
  return keys.map((key) => (
    <DataField
      key={key}
      label={getColumn(key)?.header}
      value={data[getColumn(key)?.accessorKey as BusinessPartnerDataKeys]}
    />
  ));
};

export const BusinessPartnerInfoModal = ({
  clientId,
  opened,
  setOpened,
}: {
  clientId: number | undefined;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const queryClient = useQueryClient();

  const { data: columnsCardData, isError: isColumnError } = useQuery({
    queryKey: ["getColumnsCard", "/business-partner"],
    queryFn: async () => {
      return await getColumns("/business-partner", "CARD");
    },
  });

  const { data: businessPartnerData, isError: isDataError } = useQuery({
    queryKey: ["getBusinessPartnerData", clientId],
    queryFn: async () => {
      if (clientId) {
        return await getInfo("/business-partner", clientId);
      }
      throw new Error("Данные отсутствуют");
    },
    enabled: !!clientId && opened,
    staleTime: 0,
  });

  const columns = translateColumns(columnsCardData);
  const getColumn = (
    accessorKey: string,
  ): { accessorKey: string; header: string } =>
    columns.find((item) => item.accessorKey === accessorKey) ?? {
      header: "",
      accessorKey: "",
    };

  const cardData = [
    ["clientOpenDate", "clientCloseDate"],
    ["clientName", "clientShortName", "clientShortNameLat"],
    ["accOwnerStatus", "unn", "inn", "isResident", "state", "contractType"],
    ["swiftCode", "bankBicCode"],
    ["address", "addressSoato", "addressState", "addressPostcode"],
    [
      "addressRegion",
      "addressDistrictName",
      "addressUnitaryArea",
      "addressSettlementName",
      "addressSettlementType",
      "addressStreetType",
      "addressStreetName",
      "addressHouseNum",
      "addressBuilding",
      "addressApartmentNum",
    ],
    ["swiftRusName", "swiftName"],
    ["swiftRusAddress", "swiftAddress"],
    ["clientId", "registrationNumber", "foreignClientCode"],
  ];

  const handleCloseBPInfoModal = (): void => {
    queryClient.setQueryData(["getBusinessPartnerData", clientId], () => {});
    setOpened(false);
  };

  const hasData =
    businessPartnerData && Object.keys(businessPartnerData).length > 0;
  const hasError = isDataError || isColumnError;

  if (hasError) {
    return <>Error</>;
  }

  if (hasData) {
    return (
      <Modal
        opened={opened}
        onClose={handleCloseBPInfoModal}
        title={businessPartnerData.clientName}
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
                  businessPartnerData,
                  keys as BusinessPartnerDataKeys[],
                  getColumn,
                )}
              </Group>
            </Card>
          ))}
        </Stack>
      </Modal>
    );
  }

  return <></>;
};
