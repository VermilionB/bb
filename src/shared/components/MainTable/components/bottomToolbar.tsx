import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Flex, Group, Select, Text } from "@mantine/core";

interface BottomToolbarProperties {
  size: number;
  setSize: (size: number) => void;
  totalFetched: number;
  totalDBRowCount: number;
}

const BottomToolbar: FC<BottomToolbarProperties> = ({
  size,
  setSize,
  totalFetched,
  totalDBRowCount,
}) => {
  const { t } = useTranslation(["bottom-toolbar"]);

  const handleSizeChange = (value: string | null): void => {
    const newSize = Number(value);
    setSize(newSize);
  };

  return (
    <Flex align="center" justify={"space-between"} w={"100%"}>
      <Text>
        Fetched {totalFetched} of {totalDBRowCount} total rows.
      </Text>
      <Group>
        <Text>{t("bottom-toolbar:bottom-toolbar.rows-count")}</Text>
        <Select
          w={80}
          placeholder={size.toString()}
          data={["10", "20", "50", "100"]}
          defaultValue="20"
          allowDeselect={false}
          value={size.toString()}
          onChange={(event) => handleSizeChange(event)}
        />
      </Group>
    </Flex>
  );
};

export default BottomToolbar;
