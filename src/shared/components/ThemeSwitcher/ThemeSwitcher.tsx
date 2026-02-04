import {
  Group,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

import classes from "./ThemeSwitcher.module.scss";

const ThemeSwitcher: React.FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Tooltip label="Тема" withArrow>
      <Group
        justify="center"
        w={52}
        h="52px"
        className={classes.themeSwitcher}
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === "dark" ? (
          <IconSun className={classes.icon} stroke={1.5} color="#FFFFFF" />
        ) : (
          <IconMoon className={classes.icon} stroke={1.5} color="#FFFFFF" />
        )}
      </Group>
    </Tooltip>
  );
};

export default ThemeSwitcher;
