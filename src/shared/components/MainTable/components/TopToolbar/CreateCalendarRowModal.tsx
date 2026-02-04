import React, { JSX, useEffect, useRef, useState } from "react";
import {
  Button,
  Combobox,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import IconArrows from "@public/assets/IconArrows.svg?react";
import IconCalendar from "@public/assets/IconCalendar.svg?react";
import {
  getCountries,
  useCreateCalendarRow,
} from "@shared/api/mutation/calendarAPI";
import { MainLoader } from "@shared/components/MainLoader/MainLoader.tsx";
import SvgButton from "@shared/components/SvgWrapper/SvgButton.tsx";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import classes from "./CalendarModals.module.scss";

dayjs.extend(customParseFormat);

export const formatDate = (
  inputDate: string,
  outputFormat: "dd.mm.yyyy" | "yyyy-mm-dd",
): string => {
  const date = dayjs(inputDate, ["DD.MM.YY", "DD.MM.YYYY", "YYYY-MM-DD"], true);
  if (!date.isValid()) {
    throw new TypeError("Неверный формат даты.");
  }
  return outputFormat === "dd.mm.yyyy"
    ? date.format("DD.MM.YYYY")
    : date.format("YYYY-MM-DD");
};

const normalizeYear = (input: string): string => {
  const parts = input.split(".");
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    let year = parts[2];

    if (year.length === 2) {
      year = `20${year}`;
    }

    return `${day}.${month}.${year}`;
  }
  return input;
};

const padZero = (number_: number): string =>
  number_.toString().padStart(2, "0");

export const dateParser = (input: string): Date | null => {
  //eslint-disable-next-line unicorn/no-null
  if (!input) return null;

  const normalized = normalizeYear(input);

  const parts = normalized.split(".");
  //eslint-disable-next-line unicorn/no-null
  if (parts.length !== 3) return null;

  const [dayRaw, monthRaw, yearRaw] = parts.map(Number);
  //eslint-disable-next-line unicorn/no-null
  if (!dayRaw || !monthRaw || !yearRaw) return null;

  const maxDay = dayjs(
    `${yearRaw}-${padZero(monthRaw)}`,
    "YYYY-MM",
  ).daysInMonth();

  const day = Math.min(dayRaw, maxDay);

  const dateString = `${padZero(day)}.${padZero(monthRaw)}.${yearRaw}`;

  const parsed = dayjs(dateString, "DD.MM.YYYY", true);
  //eslint-disable-next-line unicorn/no-null
  return parsed.isValid() ? parsed.toDate() : null;
};

export const CreateCalendarRowModal = ({
  opened,
  setOpened,
  refetch,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}): JSX.Element => {
  const handleCloseCalendarCreateModal = (): void => {
    setOpened(false);
    resetForm();
  };

  const resetForm = (): void => {
    setCountryId("");
    setCountryName("");
    setWeekendDate(currentDate);
    setCaption("");
    setErrors({ countryId: "", weekendDate: "", caption: "" });
  };

  const { mutate } = useCreateCalendarRow();
  const currentDate = formatDate(new Date().toLocaleDateString(), "yyyy-mm-dd");

  const [countryName, setCountryName] = useState("");
  const [countryId, setCountryId] = useState<string>("");
  const [weekendDate, setWeekendDate] = useState<string | null>(currentDate);
  const [caption, setCaption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    countryId: string;
    weekendDate: string;
    caption: string;
  }>({
    countryId: "",
    weekendDate: "",
    caption: "",
  });
  const calendarReference = useRef<HTMLInputElement>(null);
  const countryReference = useRef<HTMLInputElement>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCountries"],
    queryFn: async () => {
      return await getCountries();
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (data && countryName && isSubmitting) {
      const country = data.find(
        (item) => item.shortName.toLowerCase() === countryName.toLowerCase(),
      );
      if (country) {
        setCountryId(country.code.toString());
        setErrors((previous) => ({ ...previous, countryId: "" }));
      } else {
        setCountryId("");
        setErrors((previous) => ({
          ...previous,
          countryId: "Пожалуйста, выберите валидную страну.",
        }));
      }
    }
  }, [countryName, data, isSubmitting]);

  if (isLoading) {
    return <MainLoader />;
  }

  if (isError) {
    return <div>Ошибка загрузки данных</div>;
  }

  const filteredItems = data?.filter((item) => {
    return item.shortName
      .toLowerCase()
      .includes(countryName.toLowerCase().trim());
  });

  const options = Array.isArray(filteredItems)
    ? filteredItems.map((item) => ({
        value: item.code.toString(),
        label: item.shortName,
      }))
    : [];

  const submitForm = async (): Promise<void> => {
    setIsSubmitting(true);
    let hasError = false;
    const newErrors = { countryId: "", weekendDate: "", caption: "" };

    const country = data?.find(
      (item) => item.shortName.toLowerCase() === countryName.toLowerCase(),
    );

    if (!countryName.trim()) {
      newErrors.countryId = "Поле не может быть пустым";
      hasError = true;
    } else if (country) {
      setCountryId(country.code.toString());
    } else {
      newErrors.countryId = "Пожалуйста, выберите валидную страну";
      hasError = true;
    }

    if (!weekendDate) {
      newErrors.weekendDate = "Поле не может быть пустым";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    if (weekendDate) {
      mutate(
        {
          countryId: Number(countryId),
          weekendDate: formatDate(weekendDate, "dd.mm.yyyy"),
          note: caption,
        },
        {
          onSuccess: (_data) => {
            resetForm();
            setOpened(false);
            refetch();
            notifications.show({
              title: "Успешно",
              message: `Новая запись добавлена в Календарь выходных дней`,
              color: "green",
              autoClose: 5000,
            });
            setIsSubmitting(false);
            return _data;
          },
          onError: (createError) => {
            console.log(createError);
            setIsSubmitting(false);
          },
        },
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseCalendarCreateModal}
      title={"Добавить запись"}
      overlayProps={{
        backgroundOpacity: 0.55,
      }}
      centered
      classNames={{
        content: classes.content,
        body: classes.mantineModalBody,
        header: classes.header,
        title: classes.title,
        close: classes.close,
      }}
      size={"xs"}
    >
      <Stack gap={16} p={"16px"}>
        <Flex direction="column" gap={"4px"}>
          <Text fw={400} size={"14px"} lh={"100%"}>
            Страна
          </Text>
          <Combobox
            onOptionSubmit={(option) => {
              const selectedOption = options.find(
                (opt) => opt.value === option,
              );
              if (selectedOption) {
                setCountryName(selectedOption.label);
                setCountryId(selectedOption.value);
                setErrors((previous) => ({ ...previous, countryId: "" }));
              }
              combobox.closeDropdown();
            }}
            store={combobox}
            offset={0}
          >
            <Combobox.Target>
              <TextInput
                ref={countryReference}
                classNames={{
                  wrapper: classes.searchInput,
                  input: classes.searchInput,
                }}
                rightSection={
                  <SvgButton
                    SvgIcon={IconArrows}
                    fillColor={"#999999"}
                    onClick={() => {
                      countryReference.current?.focus();
                    }}
                  />
                }
                radius={"2px"}
                placeholder={"Выберите страну"}
                value={countryName}
                onChange={(event) => {
                  setCountryName(event.currentTarget.value);
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  setErrors((previous) => ({ ...previous, countryId: "" }));
                }}
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                error={errors.countryId}
              />
            </Combobox.Target>

            <Combobox.Dropdown style={{ borderRadius: 0 }}>
              <Combobox.Options>
                <ScrollArea.Autosize mah={200} type="scroll">
                  {options.length === 0 ? (
                    <Combobox.Empty style={{ textAlign: "start" }}>
                      Сожалеем, поиск не дал результатов
                    </Combobox.Empty>
                  ) : (
                    options.map((option) => (
                      <Combobox.Option
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </Combobox.Option>
                    ))
                  )}
                </ScrollArea.Autosize>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Flex>
        <Flex direction="column" gap={"4px"}>
          <Text fw={400} size={"14px"} lh={"100%"}>
            Дата календаря
          </Text>
          <DateInput
            ref={calendarReference}
            rightSection={
              <SvgButton
                SvgIcon={IconCalendar}
                fillColor={"#999999"}
                onClick={() => {
                  calendarReference.current?.focus();
                }}
              />
            }
            value={
              //eslint-disable-next-line unicorn/no-null
              weekendDate ? dayjs(weekendDate, "YYYY-MM-DD").toDate() : null
            }
            onChange={(value) => {
              if (value) {
                const formattedDate = dayjs(value).format("YYYY-MM-DD");
                setWeekendDate(formattedDate);
              } else {
                //eslint-disable-next-line unicorn/no-null
                setWeekendDate(null);
              }
              setErrors((previous) => ({ ...previous, weekendDate: "" }));
            }}
            valueFormat="DD.MM.YYYY"
            placeholder="Введите дату"
            error={errors.weekendDate}
            clearable
            dateParser={dateParser}
            onKeyDown={(event) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Home",
                "End",
              ];
              if (
                !allowedKeys.includes(event.key) &&
                !/[0-9.]/.test(event.key)
              ) {
                event.preventDefault();
              }
            }}
          />
        </Flex>
        <Flex direction="column" gap={"4px"}>
          <Text fw={400} size={"14px"} lh={"100%"}>
            Примечание
          </Text>
          <TextInput
            placeholder={"Текст примечания"}
            value={caption}
            onChange={(event) => {
              setCaption(event.currentTarget.value);
            }}
          />
        </Flex>
      </Stack>
      <Group w={"100%"} justify="flex-end" gap={8} px={"16px"} py={"8px"}>
        <Button
          className={classes.button}
          onClick={handleCloseCalendarCreateModal}
        >
          Отменить
        </Button>
        <Button className={classes.button} onClick={submitForm}>
          Сохранить
        </Button>
      </Group>
    </Modal>
  );
};
