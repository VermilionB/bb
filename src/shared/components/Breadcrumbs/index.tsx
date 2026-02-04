import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Anchor,
  Breadcrumbs,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocation } from "@tanstack/react-router";

import classes from "./Breadcrumbs.module.scss";

const MyBreadcrumbs = (): React.ReactElement => {
  const location = useLocation();
  const colorScheme = useMantineColorScheme();
  const { t } = useTranslation(["bread-crumbs"]);
  const filteredSegments = useMemo(() => {
    const pathSegments = location.pathname
      .replace("__", "/")
      .split("/")
      .filter(Boolean);
    return pathSegments.filter((segment) => segment !== "nsi");
  }, [location.pathname]);
  const [items, setItems] = useState<{ title: string; href: string }[]>([]);

  useEffect(() => {
    const newItems = filteredSegments.map((segment, index) => {
      const href = `/${filteredSegments.slice(0, index + 1).join("/")}`;
      const title =
        t(`bread-crumbs:bread-crumbs.${segment}`) || segment.replace("-", " ");
      return { title, href };
    });
    setItems(newItems);
  }, [filteredSegments, t]);
  return (
    <Breadcrumbs
      className={classes.wrapper}
      separator=">"
      separatorMargin="5px"
      style={{
        borderBottom: `1px solid ${colorScheme.colorScheme === "dark" ? "#444444" : "#DFDFDF"}`,
      }}
    >
      <Anchor
        size="sm"
        c={colorScheme.colorScheme === "dark" ? "#8B8B8B" : "#333333"}
        className={classes.breadCrumbLink}
      >
        {t("bread-crumbs:bread-crumbs.main-page")}
      </Anchor>
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <span key={index}>
            <Text size="14px">
              {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
            </Text>
          </span>
        ) : (
          <Anchor
            size="sm"
            className={classes.breadCrumbLink}
            c={colorScheme.colorScheme === "dark" ? "#8B8B8B" : "#333333"}
            key={index}
          >
            {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
          </Anchor>
        ),
      )}
    </Breadcrumbs>
  );
};

export default MyBreadcrumbs;
