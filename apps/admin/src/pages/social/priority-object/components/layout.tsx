import { UserIcon } from "@/assets/svg";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Input, List, Modal } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useMutationPriorityObject } from "../../social.loader";
import { AddObjectModal } from "./add-object";
import styles from "./layout.module.less";

interface LayoutProps {
  items: any[];
  typeName: string;
  choosedPriorityObject: any;
  setChoosedPriorityObject: (value: any) => void;
}

interface ItemProps {
  item: any;
  handleClickDelete: (value: any) => void;
  handleChooseObject: (value: any) => void;
  choosedPriorityObject: any;
  typeName: string;
}

export const Layout: React.FC<LayoutProps> = ({
  items,
  typeName,
  choosedPriorityObject,
  setChoosedPriorityObject,
}) => {
  let [, setSearchParams] = useSearchParams();
  const [typeModal, setTypeModal] = useState<any>("add");
  const [isOpenModal, setIsOpenModal] = useState<any>(false);
  const { mutate, isLoading: isPriorityObjectLoading } = useMutationPriorityObject();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.searchBox}>
        <div className={styles.search}>
          <Input.Search
            className={styles.searchStyle}
            placeholder="Tìm kiếm"
            onSearch={handleSearch}
          />
        </div>
        <div className={styles.addObjectButton}>
          <PlusCircleOutlined
            onClick={handleClickAdd}
            title={`Thêm ${typeName}`}
            className={styles.add}
          />
        </div>
      </div>
      <div className={styles.content}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={items}
          renderItem={(item) => (
            <Item
              typeName={typeName}
              item={item}
              handleClickDelete={handleClickDelete}
              handleChooseObject={handleChooseObject}
              choosedPriorityObject={choosedPriorityObject}
            />
          )}
        />
      </div>
      {isOpenModal ? (
        <AddObjectModal
          type={typeModal}
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          functionAdd={functionAdd}
          confirmLoading={isPriorityObjectLoading}
          nameType={typeName}
        />
      ) : null}
    </div>
  );

  function handleSearch(value: string) {
    setSearchParams({
      text: value.trim(),
    });
  }

  function handleClickAdd() {
    setTypeModal("add");
    setIsOpenModal(true);
  }

  function handleClickDelete(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá " + typeName + " này?",
      okText: "Xoá",
      cancelText: "Thoát",
      onOk: () => {
        functionDelete({ id: value._id });
      },
    });
  }

  function handleChooseObject(value: any) {
    setChoosedPriorityObject(value);
  }

  function functionAdd(value: any) {
    mutate({ ...value, action: "add" });
  }

  function functionDelete(value: any) {
    setChoosedPriorityObject(null);
    mutate({ ...value, action: "delete" });
  }
};

const Item: React.FC<ItemProps> = ({
  item,
  handleChooseObject,
  handleClickDelete,
  choosedPriorityObject,
  typeName,
}) => {
  return (
    <div
      className={
        choosedPriorityObject?._id === item?._id && choosedPriorityObject?.social_type !== undefined
          ? styles.itemContainerChoosed
          : styles.itemContainer
      }
      onClick={() => handleChooseObject(item)}
    >
      <div className={styles.container1}>
        {item.avatar_url ? (
          <Avatar src={item.avatar_url} className={styles.icon} alt={item.avatar_url} />
        ) : (
          <UserIcon className={styles.icon} />
        )}
        <div className={styles.fullName}>{item.social_name}</div>
      </div>
      <div className={styles.container2}>
        {/* <DelIcon
          onClick={(event) => {
            event.stopPropagation();
            handleClickDelete(item);
          }}
        /> */}
        <DeleteOutlined
          title={`Xoá ${typeName}`}
          onClick={(event) => {
            event.stopPropagation();
            handleClickDelete(item);
          }}
          className={styles.delete}
        />
      </div>
    </div>
  );
};
