import { Slider } from "antd";
import React from "react";

interface Props {
  onAfterChange?: (value: number) => void;
  defaultValue?: number;
}

export const RatioSummary: React.FC<Props> = ({ onAfterChange, defaultValue = 0 }) => {
  return (
    <Slider min={0} max={1} step={0.2} defaultValue={defaultValue} onAfterChange={onAfterChange} />
  );
};
