import React from "react";

import styles from "./card2-item.module.less";

interface Card2ItemProps {
  title: string;
  color?: string;
  type?: string;
}

export const Card2Item: React.FC<Card2ItemProps> = ({ title, color, type }) => {
  return (
    <div className={styles.mainContainer} style={{ backgroundColor: color }}>
      <div className={styles.content}>
        <div className={styles.titleCard}>
          {title} <span style={{ fontSize: 40, fontWeight: "bold", marginLeft: -20 }}>Tin</span>
        </div>

        <div className={styles.bodyCard}>{type}</div>
      </div>
    </div>
  );
};
