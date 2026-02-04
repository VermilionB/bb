import React, { FC, HTMLAttributes, SVGProps } from "react";

import classes from "./SvgWrapper.module.scss";

interface SvgButtonProperties extends HTMLAttributes<HTMLDivElement> {
  SvgIcon: React.FC<SVGProps<SVGSVGElement>> | undefined;
  fillColor: string;
}

const SvgButton: FC<SvgButtonProperties> = ({
  SvgIcon,
  fillColor,
  style,
  children,
  ...properties
}) => {
  return (
    <div className={classes.parent} style={style} {...properties}>
      {SvgIcon && ( // Check if SvgIcon is not null
        <SvgIcon className={classes.svgIcon} style={{ color: fillColor }} />
      )}
      {children}
    </div>
  );
};

export default SvgButton;
