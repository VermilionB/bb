import { FC, JSX } from "react";
import { Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import CopyIcon from "@public/assets/copy-icon.svg";
import DateIcon from "@public/assets/date-icon.svg";

import styles from "./index.module.scss";

interface IPaymentDocumentInput {
  width: number;
  title?: JSX.Element;
  type: "date" | "copy" | "select" | "text" | "dropdown";
  icon: boolean;
}

const handleCopy = (event: React.MouseEvent<HTMLImageElement>): void => {
  const input = event.currentTarget.previousElementSibling as HTMLInputElement;
  if (input) {
    input.select();
    document.execCommand("copy");
  }
};

export const PaymentDocumentInput: FC<IPaymentDocumentInput> = ({
  width,
  title,
  type,
  icon,
}) => {
  const renderInput = (): JSX.Element => {
    switch (type) {
      case "date": {
        return (
          <div style={{ position: "relative" }}>
            <DateInput
              valueFormat="DD.MM.YYYY"
              placeholder="Введите дату"
              w={width}
              variant={"unstyled"}
              className={styles.input}
            />
            {icon && <img src={DateIcon} className={styles.icon} alt={""} />}
          </div>
        );
      }
      case "copy": {
        return (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className={styles.input}
              style={{ width: width }}
            />
            {icon && (
              <img
                src={CopyIcon}
                className={styles.icon}
                alt={""}
                onClick={handleCopy}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        );
      }
      case "select": {
        return (
          <div style={{ position: "relative" }}>
            <select className={styles.input} style={{ width: width }}></select>
            {icon && <img src={CopyIcon} className={styles.icon} alt={""} />}
          </div>
        );
      }
      case "text": {
        return (
          <div style={{ position: "relative" }}>
            <textarea
              className={styles.textInput}
              style={{ width: width }}
              disabled={true}
              value={
                "Три миллиона девятнадцать тысяч восемьсот шесть российских рублей, 00 копеек"
              }
            />
            {icon && <img src={CopyIcon} className={styles.icon} alt={""} />}
          </div>
        );
      }
      case "dropdown": {
        return (
          <>
            <Select
              placeholder="Выберите значение"
              data={["React", "Angular", "Vue", "Svelte"]}
              w={width}
            />
          </>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <div className={styles.inputBlock}>
      <span>{title}</span>
      <div className={styles.inputWithIconWrapper}>{renderInput()}</div>
    </div>
  );
};
