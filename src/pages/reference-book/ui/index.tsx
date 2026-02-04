import { FC } from "react";
import { Flex } from "@mantine/core";
import { MainTable } from "@shared/components/MainTable/MainTable.tsx";
import { useParams } from "@tanstack/react-router";

export const ReferenceBookPage: FC = () => {
  const parameters = useParams({ from: "/reference-book/$slug" });
  const link = parameters.slug.replace("__", "/") || "";
  return (
    <Flex direction="column" p={0} gap={0} w="100%" h="100%">
      <MainTable link={`/reference-book/${link}`} updateTable={true} />
    </Flex>
  );
};
