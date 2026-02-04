import { FC } from "react";

import styles from "./index.module.scss";

interface IChildrenPanel {
  children: React.ReactElement;
  title: string;
  customWidth?: number;
}

export const ChildrenPanel: FC<IChildrenPanel> = ({
  children,
  title,
  customWidth,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.blockHeader} style={{ width: customWidth }}>
        {title}
      </span>
      {children}
    </div>
  );
};
