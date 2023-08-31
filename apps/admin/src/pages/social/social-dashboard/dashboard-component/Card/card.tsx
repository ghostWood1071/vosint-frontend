import { DatePicker, Modal, Select } from "antd";
import React, { useState } from "react";

import { DonutChart } from "../circle-chart/donut-chart";
import styles from "./card.module.less";

interface CardProps {
  titleSource: string;
  data: any[];
}

export const Card: React.FC<CardProps> = ({ titleSource, data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState({ value: "7day", label: "7 ngày gần nhất" });
  const [filterDate, setFilterDate] = useState("");

  function handleChange(value: any) {
    if (value === "custom") {
      setIsVisible(true);
    } else {
      setSelectedValue({ value: "7day", label: "7 ngày gần nhất" });
    }
  }

  function handleChangeTime(dates: any, dateStrings: any) {
    setFilterDate(dateStrings);
  }

  function handleSetDate() {
    setIsVisible(false);
    if (filterDate !== "") {
      setSelectedValue({
        value: "okla",
        label: filterDate[0] + " - " + filterDate[1],
      });
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>{titleSource.toUpperCase()}</div>
        <div className={styles.selectContainer}>
          <Select
            value={selectedValue}
            bordered={true}
            style={{
              width: "auto",
            }}
            onChange={handleChange}
            options={[
              {
                value: "7day",
                label: "7 ngày gần nhất",
                visible: false,
              },
              {
                value: "custom",
                label: "Tự chọn ngày",
              },
            ]}
          />
          <Modal
            title="Chọn ngày để lọc"
            open={isVisible}
            bodyStyle={{
              height: 360,
            }}
            width={600}
            onOk={handleSetDate}
            onCancel={() => setIsVisible(false)}
            closable={false}
            maskClosable={false}
          >
            <DatePicker.RangePicker
              inputReadOnly
              format={"DD/MM/YYYY"}
              onChange={handleChangeTime}
            />
          </Modal>
        </div>
      </div>
      <div className={styles.content}>
        <DonutChart data={data} />
      </div>
    </div>
  );
};
