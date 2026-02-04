import { FC } from "react";
import {
  Accordion,
  Card,
  Container,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import IconNews from "@public/assets/news.svg";
import classes from "@shared/components/NewsComponent/NewsComponent.module.scss";
const newsData = [
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
  {
    date: "2025-04-09 10:00",
    title: "Технические работы",
    description: "Система будет недоступна с 10:00 до 12:00.",
  },
  {
    date: "2025-04-10 14:00",
    title: "Обновление системы",
    description: "Внедрение новых функций и улучшений.",
  },
];

const NewsComponent: FC = () => {
  const colorScheme = useMantineColorScheme();
  return (
    <Accordion
      chevronPosition="right"
      variant="contained"
      defaultValue={"table"}
      classNames={{ content: classes.content, chevron: classes.chevron }}
    >
      <Accordion.Item value={"table"} w={350}>
        <Accordion.Control
          bg={colorScheme.colorScheme === "light" ? "#999999" : "#777778"}
          style={{ borderRadius: "0" }}
        >
          <Container p={0} mr={"sm"}>
            <Group align={"center"}>
              <Image w={20} h={20} src={IconNews} />
              <Text
                c={colorScheme.colorScheme === "light" ? "#FFFFFF" : "#CCCCCC"}
              >
                Информация
              </Text>
            </Group>
          </Container>
        </Accordion.Control>
        <Accordion.Panel
          style={{
            background:
              colorScheme.colorScheme === "light" ? "white" : "#2e2e2e",
          }}
        >
          <ScrollArea className={classes.scrollArea}>
            <Stack gap={0} style={{ background: "white" }}>
              {newsData.map((item, index) => (
                <Card key={index} p={5} style={{ borderRadius: "0" }}>
                  <Text size="sm" c="dimmed">
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                  <Text fw={700} size="md">
                    {item.title}
                  </Text>
                  <Text size="sm">{item.description}</Text>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default NewsComponent;
