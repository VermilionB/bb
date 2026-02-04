import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/notifications/styles.css";

import { theme } from "../../../theme.ts";

interface ThemeManagerProperties {
  children: React.ReactNode;
}

export function ThemeManager({
  children,
}: ThemeManagerProperties): React.ReactNode {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
