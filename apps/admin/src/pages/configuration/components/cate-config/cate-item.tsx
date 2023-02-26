import { UserIcon } from "@/assets/svg";
import React from "react";

import styles from "./cate-item.module.less";

interface CateItemProps {
  item: any;
  onclick: (value: any) => void;
}

export const CateItem: React.FC<CateItemProps> = ({ item, onclick }) => {
  return (
    <div
      className={styles.mainContainer}
      onClick={() => {
        onclick(item);
      }}
    >
      <div className={styles.iconUserContainer}>
        {item.avatar_url ? (
          <img src={item.avatar_url} className={styles.iconUser} alt={item.avatar_url} />
        ) : (
          <UserIcon className={styles.iconUser} />
        )}
      </div>
      <div className={styles.nameCateContainer}>
        <div className={styles.cateName}>{item.name}</div>
      </div>
      <div className={styles.statusContainer}>
        <div
          className={
            item.status.toLowerCase() === "enable" ? styles.enableStatus : styles.disableStatus
          }
        >
          <div className={styles.nameStatus}>
            {item.status === "enable" ? "Kích hoạt" : "Vô hiệu"}
          </div>
        </div>
      </div>
    </div>
  );
};
