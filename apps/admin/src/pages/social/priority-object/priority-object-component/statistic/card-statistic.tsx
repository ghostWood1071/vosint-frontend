import { DatePicker, Modal, Select } from "antd";
import React, { useState } from "react";
import styles from "./card-statistic.module.less";

interface CardStatisticProps {
  title: string;
  number: number;
  color: string;
}

export const CardStatistic: React.FC<CardStatisticProps> = ({ title, number, color }) => {
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
    console.log(dateStrings);
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
    <div className={styles.mainContainer} style={{ backgroundColor: color }}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.title}>{title.toUpperCase()}</div>
        </div>
        <div className={styles.rightHeader}>
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
            centered
            open={isVisible}
            bodyStyle={{
              height: 360,
            }}
            width={600}
            onOk={handleSetDate}
            onCancel={() => setIsVisible(false)}
          >
            <DatePicker.RangePicker format={"DD/MM/YYYY"} onChange={handleChangeTime} />
          </Modal>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.number}>{number}</div>
      </div>
    </div>
  );
};
