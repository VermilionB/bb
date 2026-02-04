import { FC } from "react";
import { Flex } from "@mantine/core";
import { MainTable } from "@shared/components/MainTable/MainTable.tsx";

export const BusinessPartnerPage: FC = () => {
  const link = "";
  return (
    <Flex direction="column" p={0} gap={0} w="100%" h="100%">
      <MainTable link={`/business-partner${link}`} updateTable={true} />
    </Flex>
  );
};
