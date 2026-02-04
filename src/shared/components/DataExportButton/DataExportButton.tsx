import { JSX } from "react";
import { Button, Combobox, Tooltip, useCombobox } from "@mantine/core";
import IconExport from "@public/assets/export.svg?react";
import { exportData } from "@shared/api/mutation/dataExportAPI.ts";
import { ParametersPost } from "@shared/components/MainTable/MainTable.tsx";

import styles from "../MainTable/MainTable.module.scss";
const exports = ["Excel", "Word", "PDF"];

interface DataExportButtonProperties {
  w: number;
  h: number;
  p: number;
  radius: string;
  color: string;
  parameters: ParametersPost;
  disabled?: boolean;
}

export const DataExportButton = ({
  w,
  h,
  p,
  radius,
  color,
  parameters,
  disabled,
}: DataExportButtonProperties): JSX.Element => {
  const { link } = parameters;
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });

  // eslint-disable-next-line consistent-return
  const exportDataInFormat = async (format: string): Promise<void> => {
    if (link) {
      console.log(format);
      return await exportData(parameters, link, format);
    }
  };

  const options = exports.map((item) => (
    <Combobox.Option
      value={item}
      key={item}
      disabled={item === "Word" || item === "PDF"}
      onClick={() => exportDataInFormat(item)}
    >
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      offset={0}
      store={combobox}
      width={65}
      position="bottom-start"
      withArrow
      onOptionSubmit={() => {
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Tooltip label="Выгрузка данных" withArrow>
          <Button
            w={w}
            h={h}
            p={p}
            radius={radius}
            color={color}
            onClick={() => combobox.toggleDropdown()}
            disabled={disabled}
            className={styles.button}
          >
            <IconExport />
          </Button>
        </Tooltip>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
