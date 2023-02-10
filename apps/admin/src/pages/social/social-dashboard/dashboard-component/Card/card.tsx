import { DatePicker, Select } from "antd";
import React, { useState } from "react";

import { DonutChart } from "../circle-chart/donut-chart";
import styles from "./card.module.less";

interface CardProps {
  titleSource: string;
  data: any[];
}

export const Card: React.FC<CardProps> = ({ titleSource, data }) => {
  const [typeShow, setTypeShow] = useState("7day");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChangeDate = (date: any, dateString: any) => {
    // setStartDate(date[0]);
    // setEndDate(date[1]);
    console.log(dateString);
  };

  const handleChange = (value: string) => {
    setTypeShow(value);
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.cardTitle}> Tổng số tin </div>
          <div className={styles.sourceTitle}>{titleSource.toUpperCase()}</div>
        </div>
        <div className={styles.selectContainer}>
          <Select
            defaultValue="7 ngày gần nhất"
            bordered={true}
            style={{
              width: 150,
            }}
            onChange={handleChange}
            options={[
              {
                value: "7day",
                label: "7 ngày gần nhất",
              },
              {
                value: "custom",
                label: "Tự chọn ngày",
              },
            ]}
          />
          {typeShow === "custom" ? (
            <DatePicker.RangePicker
              format={"DD/MM/YYYY"}
              onChange={(date, dateString) => {
                handleChangeDate(date, dateString);
              }}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.content}>
        <DonutChart data={data} />
      </div>
    </div>
  );
};
