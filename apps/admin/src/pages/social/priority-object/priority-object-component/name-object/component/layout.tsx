import { AddIcon, UserIcon } from "@/assets/svg";
import { Input, List } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./layout.module.less";

interface LayoutProps {
  title: string;
  items: any[];
  onChooseItem: (item: any) => void;
  itemChoosed: any;
}

interface ItemProps {
  id: string;
  idChoosed: string;
  fullName: string;
  setSearchParams: () => void;
}

const Item: React.FC<ItemProps> = ({ id, idChoosed, fullName, setSearchParams }) => {
  return (
    <div
      className={idChoosed !== id ? styles.itemContainer : styles.itemContainerChoosed}
      onClick={handleNavigate}
    >
      <div className={styles.container1}>
        <UserIcon className={styles.icon} />
        <div className={styles.fullName}>{fullName}</div>
      </div>
      <div className={styles.container2}>
        <button
          className={styles.removeButton}
          onClick={(event) => {
            event.stopPropagation();
            alert("remove priority");
          }}
        >
          <img className={styles.removeIcon} src="/remove-icon.png" alt="remove" />
        </button>
      </div>
    </div>
  );

  function handleNavigate() {
    setSearchParams();
  }
};

export const Layout: React.FC<LayoutProps> = ({ title, items, onChooseItem, itemChoosed }) => {
  let [, setSearchParams] = useSearchParams();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>{title.toUpperCase()}</div>
      <div className={styles.searchBox}>
        <div className={styles.search}>
          <Input.Search className={styles.searchStyle} placeholder="Từ khóa" />
        </div>
        <div className={styles.addObjectButton}>
          <AddIcon />
        </div>
      </div>
      <div className={styles.content}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            size: "small",
          }}
          dataSource={items}
          renderItem={(item) => (
            <Item
              id={item.id}
              idChoosed={itemChoosed.id}
              fullName={item.name}
              setSearchParams={() => {
                setSearchParams({ id: item.id });
                onChooseItem(item);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
