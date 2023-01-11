import { Slider } from "antd";
import React, { useState } from "react";

const DecimalStep = () => {
  const [inputValue, setInputValue] = useState(0.5);

  const onChange = (value: any) => {
    if (isNaN(value)) {
      return;
    }
    console.log(value);
    setInputValue(value);
  };

  return (
    <Slider
      min={0}
      max={1}
      onChange={onChange}
      value={typeof inputValue === "number" ? inputValue : 0}
      step={0.01}
    />
  );
};

export const Ratiosummary: React.FC = () => (
  <div>
    <DecimalStep />
  </div>
);
