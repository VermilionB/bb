import React, { FC, JSX, useEffect, useState } from "react";
import { Container, Group, Stack, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import IconCalendar from "@public/assets/calendar.svg";
import {
  BankData,
  getWeekends,
  WeekendDaysResponse,
} from "@shared/api/mutation/calendarAPI.ts";
import { checkApiData } from "@shared/api/query/check.ts";
import { SortCriteria } from "@shared/components/MainTable/MainTable.tsx";
import NewsComponent from "@shared/components/NewsComponent/NewsComponent.tsx";
import { SimpleMainTable } from "@shared/components/SimpleMainTable/SimpleMainTable.tsx";
import { useQuery } from "@tanstack/react-query";
import { MRT_SortingState } from "mantine-react-table";

import styles from "./index.module.scss";

export const IndexPage: FC = () => {
  const colorScheme = useMantineColorScheme();
  const [backgroundState, setBackgroundState] = useState<string>("");
  const [sortingFirst, setSortingFirst] = useState<MRT_SortingState>([]);
  const [sortingSecond, setSortingSecond] = useState<MRT_SortingState>([]);

  const { data } = useQuery({ queryKey: ["check"], queryFn: checkApiData });
  console.log(data);

  const sortCriteriaFirst = getSortCriteria(sortingFirst);
  const sortCriteriaSecond = getSortCriteria(sortingSecond);

  const { data: weekendDaysCurrent } = useQuery<WeekendDaysResponse>({
    queryKey: ["getWeekendsCurrent", sortCriteriaFirst],
    queryFn: () => getWeekends(1, sortCriteriaFirst),
    staleTime: 0,
  });

  const { data: weekendDaysNextDay } = useQuery<WeekendDaysResponse>({
    queryKey: ["getWeekendsNextDay", sortCriteriaSecond],
    queryFn: () => getWeekends(2, sortCriteriaSecond),
    staleTime: 0,
  });

  useEffect(() => {
    setBackgroundState(
      colorScheme.colorScheme === "light"
        ? styles.mainContainerLight
        : styles.mainContainerDark,
    );
  }, [colorScheme.colorScheme]);

  const matches = useMediaQuery("(min-width: 1410px)");

  const firstKeyData = weekendDaysCurrent?.weekendsBusinessPartnersList ?? [];
  const secondKeyData = weekendDaysNextDay?.weekendsBusinessPartnersList ?? [];

  return (
    <Stack>
      <Container fluid className={backgroundState}>
        <Group
          align={"flex-start"}
          justify={"flex-start"}
          w="100%"
          h={"100%"}
          p={20}
        >
          <Stack className={styles.stackContainer} w={"100%"}>
            <Group
              align={"flex-start"}
              justify={"space-between"}
              w={"100%"}
              h={"100%"}
            >
              {matches
                ? renderTables({
                    firstKeyData,
                    secondKeyData,
                    sortingFirst,
                    setSortingFirst,
                    sortingSecond,
                    setSortingSecond,
                    weekendDateFirst: weekendDaysCurrent?.weekendDate ?? "",
                    weekendDateSecond: weekendDaysNextDay?.weekendDate ?? "",
                  })
                : renderMobileTables({
                    firstKeyData,
                    secondKeyData,
                    sortingFirst,
                    setSortingFirst,
                    sortingSecond,
                    setSortingSecond,
                    weekendDateFirst: weekendDaysCurrent?.weekendDate ?? "",
                    weekendDateSecond: weekendDaysNextDay?.weekendDate ?? "",
                  })}
              <NewsComponent />
            </Group>
          </Stack>
        </Group>
      </Container>
    </Stack>
  );
};

const getSortCriteria = (sorting: MRT_SortingState): SortCriteria => {
  const sortCriteria: SortCriteria = {};
  for (const sort of sorting) {
    sortCriteria[sort.id] = sort.desc ? "DESC" : "ASC";
  }
  return sortCriteria;
};

interface TableProperties {
  firstKeyData: BankData[];
  secondKeyData: BankData[];
  sortingFirst: MRT_SortingState;
  setSortingFirst: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  sortingSecond: MRT_SortingState;
  setSortingSecond: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  weekendDateFirst: string;
  weekendDateSecond: string;
}

const renderTables = ({
  firstKeyData,
  secondKeyData,
  sortingFirst,
  setSortingFirst,
  sortingSecond,
  setSortingSecond,
  weekendDateFirst,
  weekendDateSecond,
}: TableProperties): JSX.Element => {
  return (
    <Group align={"flex-start"} justify={"flex-start"}>
      <SimpleMainTable
        headerIcon={IconCalendar}
        headerTitle={`Выходные в банках корреспондентах "${weekendDateFirst}"`}
        width={"25vw"}
        data={firstKeyData}
        sorting={sortingFirst}
        setSorting={setSortingFirst}
        isLoading={!weekendDateFirst}
      />
      <SimpleMainTable
        headerIcon={IconCalendar}
        headerTitle={`Выходные в банках корреспондентах "${weekendDateSecond}"`}
        width={"25vw"}
        data={secondKeyData}
        sorting={sortingSecond}
        setSorting={setSortingSecond}
        isLoading={!weekendDateSecond}
      />
    </Group>
  );
};

const renderMobileTables = ({
  firstKeyData,
  secondKeyData,
  sortingFirst,
  setSortingFirst,
  sortingSecond,
  setSortingSecond,
  weekendDateFirst,
  weekendDateSecond,
}: TableProperties): JSX.Element => {
  return (
    <Stack align={"flex-start"} justify={"flex-start"}>
      <SimpleMainTable
        headerIcon={IconCalendar}
        headerTitle={`Выходные в банках корреспондентах "${weekendDateFirst}"`}
        width={"45vw"}
        data={firstKeyData}
        sorting={sortingFirst}
        setSorting={setSortingFirst}
        isLoading={!weekendDateFirst}
      />
      <SimpleMainTable
        headerIcon={IconCalendar}
        headerTitle={`Выходные в банках корреспондентах "${weekendDateSecond}"`}
        width={"45vw"}
        data={secondKeyData}
        sorting={sortingSecond}
        setSorting={setSortingSecond}
        isLoading={!weekendDateSecond}
      />
    </Stack>
  );
};
