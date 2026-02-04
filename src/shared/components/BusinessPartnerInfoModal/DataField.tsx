import React, { FC } from "react";
import { Stack, Text } from "@mantine/core";

interface IDataField {
  label: string;
  value: number | string | boolean | undefined;
  style?: React.CSSProperties;
}

export const DataField: FC<IDataField> = ({ label, value, style }) => (
  <Stack gap={"2px"}>
    <Text c={"#999999"} size="12px">
      {label}
    </Text>
    <Text
      c={style?.color}
      size="14px"
      style={value === null ? { visibility: "hidden" } : {}}
    >
      {value === null ? "null" : value}
    </Text>
  </Stack>
);
