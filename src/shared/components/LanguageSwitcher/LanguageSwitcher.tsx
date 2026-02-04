import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Group, Menu, Text } from "@mantine/core";

import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcherButton: FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
  };
  return (
    <Menu shadow="md" width={72} offset={0}>
      <Menu.Target>
        <Group justify="center" w={72} className={styles.switcher}>
          <Text
            fw={700}
            c="#ffffff"
            style={{ textAlign: "center", lineHeight: "52px" }}
          >
            {i18n.language === "by" ? "BY" : "RU"}
          </Text>
        </Group>
      </Menu.Target>

      <Menu.Dropdown
        p={0}
        style={{ boxShadow: "0px 6px 35px 6px rgba(48, 48, 48, 0.2)" }}
      >
        <Menu.Item onClick={() => changeLanguage("by")}>BY</Menu.Item>
        <Menu.Item onClick={() => changeLanguage("ru")}>RU</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default LanguageSwitcherButton;
