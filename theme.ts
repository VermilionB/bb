"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Roboto, sans-serif",
  primaryColor: "teal",
  components: {
    Modal: {
      styles: {
        root: {
          width: "100vw",
        },
      },
    },
  },
});
