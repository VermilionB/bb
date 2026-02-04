import { FC } from "react";
import {
  Container,
  Group,
  Image,
  Text,
  useMantineColorScheme,
} from "@mantine/core";

import Logo404 from "../../../../public/assets/404.svg";

import styles from "./index.module.scss";
export const NotFoundPage: FC = () => {
  const colorScheme = useMantineColorScheme();
  return (
    <Container
      className={
        colorScheme.colorScheme === "light"
          ? styles.mainContainerLight
          : styles.mainContainerDark
      }
      fluid
    >
      <Group>
        <Image src={Logo404} w={328} />
        <Group justify={"space-between"} w={300} h={150}>
          <Text style={{ fontSize: "24px", lineHeight: "100%" }} fw={700}>
            Нам очень жаль, что-то пошло не так...
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "100%" }} fw={400}>
            Страница, которую вы запрашиваете, не существует. Возможно, она
            устарела, была удалена, или был введен неверный адрес в адресной
            строке
          </Text>
        </Group>
      </Group>
    </Container>
  );
};
