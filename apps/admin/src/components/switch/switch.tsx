import React from "react";
import { Switch as SwitchRC, SwitchProps } from "antd";
import classNames from "classnames";
import "./switch.less";

interface Props extends SwitchProps {
  isSquare?: boolean;
  isColorful?: boolean;
}

export const SwitchCustom: React.FC<Props> = ({ isSquare, isColorful, ...props }) => {
  return (
    <SwitchRC
      className={classNames(
        "switch-custom",
        isSquare && "switch-square",
        isColorful && "switch-colorful",
      )}
      {...props}
    />
  );
};
