import React, { PropsWithChildren } from "react";
import { Popover, Text } from "@mantine/core";

interface ICellProperties {
  onDoubleClick?: () => void;
}

const PopoverCell: React.FC<PropsWithChildren<ICellProperties>> = ({
  children,
}) => {
  return (
    <Popover
      width={"auto"}
      position="bottom-start"
      withArrow
      shadow="md"
      styles={{
        dropdown: {
          maxWidth: "30%",
          zIndex: "0",
        },
      }}
    >
      <Popover.Target>
        <Text truncate="end" size="sm">
          {children}
        </Text>
      </Popover.Target>
      <Popover.Dropdown style={{ wordWrap: "break-word" }}>
        <Text size="xs">{children}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PopoverCell;
