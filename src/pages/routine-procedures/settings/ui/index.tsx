/* eslint-disable unicorn/no-null */
import { FC, useState } from "react";
import {
  Button,
  Flex,
  Group,
  ScrollArea,
  Select,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import IconArrowLeft from "@public/assets/IconArrowLeft.svg?react";
import IconArrowRight from "@public/assets/IconArrowRight.svg?react";
import { ChildrenPanel } from "@shared/components/ChildrenPanel";
import SvgButton from "@shared/components/SvgWrapper/SvgButton.tsx";

import classes from "./index.module.scss";

const controlsData = [
  {
    value: 1,
    name: "Установление курсов валют НБ РБ на дату открываемого дня",
  },
  {
    value: 2,
    name: "Наличие проведенной переоценки",
  },
  {
    value: 3,
    name: "Выполнение процедур начисления и уплаты комиссии и процентов по корреспондентским счетам",
  },
  {
    value: 4,
    name: "Корректность остатков на счетах",
  },
  {
    value: 5,
    name: "Прочие контроли завершения процессов текущего дня",
  },
  {
    value: 6,
    name: "Прочие контроли завершения процессов текущего дня1",
  },
  {
    value: 7,
    name: "Прочие контроли завершения процессов текущего дня2",
  },
  {
    value: 8,
    name: "Прочие контроли завершения процессов текущего дня3",
  },
];

export const RPSettingsPage: FC = () => {
  const colorScheme = useMantineColorScheme();

  const [leftControls, setLeftControls] = useState(controlsData);
  const [rightControls, setRightControls] = useState<typeof controlsData>([]);

  const [selectedLeftControl, setSelectedLeftControl] = useState<number | null>(
    null,
  );
  const [selectedRightControl, setSelectedRightControl] = useState<
    number | null
  >(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(
    "setPaymentTransactionDate",
  );

  const moveToRight = (): void => {
    if (selectedLeftControl === null) return;
    const itemToMove = leftControls.find(
      (c) => c.value === selectedLeftControl,
    );
    if (!itemToMove) return;

    setLeftControls(
      leftControls.filter((c) => c.value !== selectedLeftControl),
    );
    setRightControls([...rightControls, itemToMove]);
    setSelectedLeftControl(null);
  };

  const moveToLeft = (): void => {
    if (selectedRightControl === null) return;
    const itemToMove = rightControls.find(
      (c) => c.value === selectedRightControl,
    );
    if (!itemToMove) return;

    setRightControls(
      rightControls.filter((c) => c.value !== selectedRightControl),
    );
    setLeftControls([...leftControls, itemToMove]);
    setSelectedRightControl(null);
  };

  return (
    <Flex direction="column" p={0} gap={0} w="100%" h="100%">
      <Flex
        direction={"row"}
        px={16}
        py={8}
        style={{
          borderBottom: `1px solid ${colorScheme.colorScheme === "dark" ? "#444444" : "#DFDFDF"}`,
        }}
      >
        <Flex w={"100%"} align={"center"}>
          <Group w={"100%"} gap={8}>
            <Select
              w={"450px"}
              size={"xs"}
              classNames={{
                wrapper: classes.selectWrapper,
                root: classes.selectWrapper,
                input: classes.selectWrapper,
                option: classes.optionItem,
              }}
              h={30}
              data={[
                {
                  value: "setPaymentTransactionDate",
                  label: "Установка даты проводки платежных операций",
                },
                {
                  value: "reassessment",
                  label: "Переоценка",
                },
                {
                  value: "transferLOROPercents",
                  label: "Перечисление начисленных процентов на счета ЛОРО",
                },
                {
                  value: "enumerationNOSTRO",
                  label:
                    "Перечисление/Возврат пассивного остатка по счетам НОСТРО",
                },
                {
                  value: "creatingCKFile",
                  label:
                    "Формирование приложений к выпискам по счетам:- CK-файл",
                },
              ]}
              value={selectedOption}
              onChange={setSelectedOption}
              defaultValue={"setPaymentTransactionDate"}
            />
            <Button
              disabled={!selectedOption}
              className={classes.button}
              h={30}
              w={"auto"}
              px={"16"}
              color="#007458"
              size="sm"
              style={{
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              radius="xs"
              onClick={() => console.log("save")}
            >
              Сохранить настройки
            </Button>
          </Group>
        </Flex>
      </Flex>

      <Flex w={"100%"} direction={"row"} px={16} align={"center"} gap={16}>
        <ChildrenPanel title={"Выбранные контроли"} customWidth={442}>
          <Flex mt={8} direction={"column"} h={176}>
            <ScrollArea h={176}>
              {leftControls.map((item) => (
                <Flex
                  key={item.value}
                  px={16}
                  py={8}
                  mih={32}
                  align={"center"}
                  className={`${
                    selectedLeftControl === item.value
                      ? classes.selectedControl
                      : classes.controlItem
                  }`}
                  onClick={() => {
                    setSelectedLeftControl(item.value);
                    setSelectedRightControl(null);
                  }}
                >
                  <Text fz={"14px"} lh={"14px"}>
                    {item.name}
                  </Text>
                </Flex>
              ))}
            </ScrollArea>
          </Flex>
        </ChildrenPanel>

        <Group gap={8} style={{ marginTop: 8 }}>
          <Button
            w={30}
            h={30}
            p={5}
            radius="xs"
            color="#007458"
            disabled={selectedRightControl === null}
            className={classes.button}
            onClick={moveToLeft}
          >
            <SvgButton SvgIcon={IconArrowLeft} fillColor={"#FFFFFF"} />
          </Button>
          <Button
            w={30}
            h={30}
            p={5}
            radius="xs"
            color="#007458"
            disabled={selectedLeftControl === null}
            className={classes.button}
            onClick={moveToRight}
          >
            <SvgButton SvgIcon={IconArrowRight} fillColor={"#FFFFFF"} />
          </Button>
        </Group>

        <ChildrenPanel title={"Все контроли"} customWidth={442}>
          <Flex mt={8} direction={"column"} h={176}>
            <ScrollArea h={176}>
              {rightControls.map((item) => (
                <Flex
                  key={item.value}
                  px={16}
                  py={8}
                  mih={32}
                  align={"center"}
                  className={`${
                    selectedRightControl === item.value
                      ? classes.selectedControl
                      : classes.controlItem
                  }`}
                  onClick={() => {
                    setSelectedRightControl(item.value);
                    setSelectedLeftControl(null);
                  }}
                >
                  <Text fz={"14px"} lh={"14px"}>
                    {item.name}
                  </Text>
                </Flex>
              ))}
            </ScrollArea>
          </Flex>
        </ChildrenPanel>
      </Flex>
    </Flex>
  );
};
