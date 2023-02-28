import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import React from "react";

import styles from "./proxy-item.module.less";

interface Props {
  item: any;
  handleClickEdit: (value: any) => void;
  handleClickDelete: (value: any) => void;
  setChoosedProxy: (value: any) => void;
}

export const ProxyItem: React.FC<Props> = ({ item, handleClickDelete, handleClickEdit }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>{item.name}</div>
      <div className={styles.titleContainer}>{item.ip_address}</div>
      <div className={styles.titleContainer}>{item.port}</div>
      <div className={styles.titleContainer}>{item.note}</div>
      <div className={styles.functionTitleContainer}>
        <Space className={styles.spaceStyle}>
          <Tooltip title={"Sửa danh mục"}>
            <EditOutlined onClick={() => handleClickEdit(item)} className={styles.edit} />
          </Tooltip>
          <Tooltip title={"Xoá danh mục"}>
            <DeleteOutlined onClick={() => handleClickDelete(item)} className={styles.delete} />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};
