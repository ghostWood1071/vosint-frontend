import React from "react";

import { Card1Item } from "./card-component/card1-item";
import { Card2Item } from "./card-component/card2-item";
import styles from "./card.module.less";

interface CardProps {}

export const Card: React.FC<CardProps> = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardContainer}>
        <Card1Item title="Welax" type="Nhỏ" color="#02D3A1" />
      </div>
      <div className={styles.cardContainer}>
        <Card1Item title="Beat.vn" type="Lớn" color="#FF43D6" />
      </div>
      <div className={styles.cardContainer}>
        <Card2Item title="120" type="trong 24h gần nhất" color="#00A3FF" />
      </div>
      <div className={styles.cardContainer}>
        <Card2Item title="15" type="Số lượng tin đã đọc" color="#FF4C00" />
      </div>
    </div>
  );
};
