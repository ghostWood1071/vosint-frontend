import React from "react";
import styles from "./swiper-item.module.less";

interface SwiperItemProps {
  index: number;
  imageUrl: string;
  title: string;
}

export const SwiperItem: React.FC<SwiperItemProps> = ({ index, imageUrl, title }) => {
  return (
    <div key={index} className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={imageUrl} alt="okla" />
      </div>
      <div className={styles.titleContainer}>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};
