import React from "react";
import { Flex } from "@mantine/core";

interface NavButtonProperties {
  w: number | string;
  className?: string;
  children: React.ReactNode;
}

const NavButton = ({
  children,
  className,
  ...rest
}: NavButtonProperties): React.ReactElement => {
  return (
    <Flex align="center" className={className} {...rest}>
      {children}
    </Flex>
  );
};

export default NavButton;
