import { IconAddress } from "@/assets/svg";
import React from "react";

import styles from "./list-user.module.less";

interface UserItemProps {
  id: string;
  index: number;
  fullName: string;
  imageUrl: string;
  address: string;
  online: boolean;
  numberOfReadedNews: number;
}

const UserItem: React.FC<UserItemProps> = ({
  id,
  index,
  fullName,
  imageUrl,
  address,
  online,
  numberOfReadedNews,
}) => {
  return (
    <div key={id} className={styles.mainContainerItemUser}>
      <div className={styles.leftContainer}>
        <div className={styles.indexItemUser}>{index + 1}.</div>
        <div className={styles.imageContainer}>
          <img className={styles.imageUser} src={imageUrl} alt="User" />
        </div>
        <div className={styles.fullNameContainer}>
          <div className={styles.fullName}>{fullName}</div>
          <div className={styles.addressContainer}>
            <IconAddress className={styles.iconAddress} />
            <div className={styles.address}>{address}</div>
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.readedNews}>{numberOfReadedNews} tin</div>
        <div
          style={{
            color: online ? "#00A3FF" : "#A6A6A6",
            backgroundColor: online ? "rgba(105, 172, 255, 0.5)" : "#E4E4E4",
          }}
          className={styles.online}
        >
          {online ? "Trực tuyến" : "Ngoại tuyến"}
        </div>
      </div>
    </div>
  );
};

interface ListUserProps {
  mostNewsReader: any[];
  lessNewsReader: any[];
}

export const ListUser: React.FC<ListUserProps> = ({ mostNewsReader, lessNewsReader }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.mostNewsReader}>
        <div className={styles.title1}>Đọc nhiều</div>
        <div className={styles.container1}>
          {mostNewsReader.map((user, index) => {
            return (
              <UserItem
                id={user.id}
                key={index}
                index={index}
                fullName={user.fullName}
                imageUrl={user.image}
                address={user.address}
                online={user.online}
                numberOfReadedNews={user.numberOfReadedNews}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.lessNewsReader}>
        <div className={styles.title2}>Đọc ít</div>
        <div className={styles.container2}>
          {lessNewsReader.map((user, index) => {
            return (
              <UserItem
                id={user.id}
                key={index}
                index={index}
                fullName={user.fullName}
                imageUrl={user.image}
                address={user.address}
                online={user.online}
                numberOfReadedNews={user.numberOfReadedNews}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
