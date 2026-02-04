import { FC } from "react";
import { Group, Image, Tooltip } from "@mantine/core";
import IconInfo from "@public/assets/info.svg";

import classes from "./DocumentationButton.module.scss";

const DocumentationButton: FC = () => {
  return (
    <Tooltip label="Справка (F1)" withArrow>
      <Group justify="center" w={52} className={classes.documentationButton}>
        <Image src={IconInfo} w={22} />
      </Group>
    </Tooltip>
  );
};

export default DocumentationButton;
