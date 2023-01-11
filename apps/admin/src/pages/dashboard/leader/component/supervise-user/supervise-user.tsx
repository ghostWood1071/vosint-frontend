import React from "react";
import styles from "./supervise-user.module.less";
import { UserOnline } from "./component/user-online";
import { IconTopUser } from "@/assets/svg";
import { ListUser } from "./component/list-user";

interface SuperviseProps {
  mostNewsReader: any[];
  lessNewsReader: any[];
  numberOfUserOnline: number;
  numberOfAllUser: number;
}

export const SuperviseUser: React.FC<SuperviseProps> = ({
  mostNewsReader,
  lessNewsReader,
  numberOfUserOnline,
  numberOfAllUser,
}) => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Giám sát người dùng</div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.content1}>
          <UserOnline numberOfUserOnline={numberOfUserOnline} numberOfAllUser={numberOfAllUser} />
        </div>
        <div className={styles.content2}>
          <div className={styles.headerContent2}>
            <IconTopUser className={styles.iconTopUser} />
            <div className={styles.textTopUser}>Top người dùng</div>
          </div>
          <div className={styles.bodyContent2}>
            <ListUser mostNewsReader={mostNewsReader} lessNewsReader={lessNewsReader} />
          </div>
        </div>
      </div>
    </div>
  );
};
