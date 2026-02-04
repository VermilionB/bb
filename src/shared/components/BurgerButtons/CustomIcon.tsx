import React, { useEffect, useState } from "react";

interface IconProperties {
  active?: boolean;
  colorScheme: string;
  path: string;
}

const CustomIcon = ({
  active,
  colorScheme,
  path,
}: IconProperties): React.ReactElement => {
  const [iconColorState, setIconColorState] = useState<string>("");

  let pathColor;

  if (active) {
    pathColor = "#FFFFFF";
  } else if (colorScheme === "dark") {
    pathColor = "#FFFFFF";
  } else {
    pathColor = "#333333";
  }

  useEffect(() => {
    setIconColorState(pathColor);
  }, [active, colorScheme, pathColor]);

  return (
    <svg
      width="52"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill={iconColorState} />
    </svg>
  );
};

export default CustomIcon;
