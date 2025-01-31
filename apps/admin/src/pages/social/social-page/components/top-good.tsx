import React from "react";

import styles from "./top-good.module.less";

interface TopGoodProps {
  title: string;
  data: any[];
  numberOfAllUser: number;
  titleNumber: string;
}

interface DetailObjectProps {
  type: string;
  index: number;
  fullName: string;
}

const DetailUser: React.FC<DetailObjectProps> = ({ type, index, fullName }) => {
  return (
    <div key={index} className={styles.containerItem}>
      <div className={styles.typeUser}>
        {type === "top1" ? (
          <img className={styles.iconLevel} src="/images/gold_medal.png" alt="gold" />
        ) : type === "top2" ? (
          <img className={styles.iconLevel} src="/images/silver_medal.png" alt="gold" />
        ) : type === "top3" ? (
          <img className={styles.iconLevel} src="/images/bronze_medal.png" alt="gold" />
        ) : (
          ""
        )}
      </div>
      <div
        className={
          type === "top1" || type === "top2" || type === "top3" ? styles.nameTop : styles.nameNoTop
        }
      >
        {index + 1}. {fullName}
      </div>
    </div>
  );
};

export const TopGood: React.FC<TopGoodProps> = ({ title, data, numberOfAllUser, titleNumber }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.title}>{title.toUpperCase()}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.leftBody}>
          <div className={styles.leftUserContainer}>
            {data.slice(0, 5).map((item, index) => {
              return (
                <DetailUser key={item.id} type={item.type} index={index} fullName={item.fullName} />
              );
            })}
          </div>
          <div className={styles.rightUserContainer}>
            {data.slice(5, 10).map((item, index) => {
              return (
                <DetailUser
                  key={item.id}
                  type={item.type}
                  index={index + 5}
                  fullName={item.fullName}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.rightBody}>
          <div className={styles.titleNumberUser}>{titleNumber.toUpperCase()}</div>
          <div className={styles.numberUser}>{numberOfAllUser}</div>
        </div>
      </div>
    </div>
  );
};
