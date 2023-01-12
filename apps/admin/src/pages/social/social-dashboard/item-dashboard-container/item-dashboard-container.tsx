import React from "react";
import styles from "./item-dashboard-container.module.less";

interface ItemDashboardContainerProps {
  titleItem: string;
  chart: any;
  rightComponent?: any;
}

export const ItemDashboardContainer: React.FC<ItemDashboardContainerProps> = ({
  titleItem,
  chart,
  rightComponent,
}) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>{titleItem.toUpperCase()}</div>
        <div className={styles.rightHeader}>{rightComponent}</div>
      </div>
      <div className={styles.chart}>{chart}</div>
    </div>
  );
};
