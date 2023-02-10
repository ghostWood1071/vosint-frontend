import { Progress } from "antd";
import React from "react";

import styles from "./user-online.module.less";

interface UserOnlineProps {
  numberOfUserOnline: number;
  numberOfAllUser: number;
}

export const UserOnline: React.FC<UserOnlineProps> = ({ numberOfAllUser, numberOfUserOnline }) => {
  const percentOnline = (numberOfUserOnline * 100) / numberOfAllUser;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>Số người đang online</div>
      <div className={styles.content}>
        <div className={styles.progressComponent}>
          <Progress
            trailColor={"rgba(0, 90, 176, 0.1)"}
            strokeWidth={30}
            showInfo={false}
            strokeColor={"#005AB0"}
            percent={percentOnline}
          />
        </div>
        <div className={styles.noteField}>
          <div className={styles.note1}>
            <div className={styles.circleNote1} />
            <div className={styles.textNote1}>Số người đang online ({numberOfUserOnline})</div>
          </div>
          <div className={styles.note2}>
            <div className={styles.circleNote2} />
            <div className={styles.textNote2}>Tổng số người dùng ({numberOfAllUser})</div>
          </div>
        </div>
      </div>
    </div>
  );
};
