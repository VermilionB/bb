import { FC } from "react";
import { Flex } from "@mantine/core";
import { MainTable } from "@shared/components/MainTable/MainTable.tsx";

export const CalendarPage: FC = () => {
  console.log("test");
  return (
    <Flex direction="column" p={0} gap={0} w="100%" h="100%">
      <MainTable
        link={`/reference-book/calendar`}
        updateTable={true}
        disabledDataExport={true}
      />
    </Flex>
  );
};
