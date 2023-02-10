import React from "react";

import styles from "./card1-item.module.less";

interface Card1ItemProps {
  title: string;
  color?: string;
  type?: string;
}

export const Card1Item: React.FC<Card1ItemProps> = ({ title, color, type }) => {
  return (
    <div className={styles.mainContainer} style={{ backgroundColor: color }}>
      <div className={styles.content}>
        <div className={styles.titleCard}>{title}</div>

        <div className={styles.bodyCard}>
          có số lượng tin <br /> <span style={{ fontWeight: "bold" }}>{type?.toUpperCase()}</span>{" "}
          nhất
        </div>
      </div>
    </div>
  );
};
