import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";

import styles from "./table-item.module.less";
import { TreeTitle } from "./tree-title";

interface TableItemProps {
  treeData: any;
  detailData: any;
}

export const TableItem: React.FC<TableItemProps> = ({ treeData, detailData }) => {
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.treeContainer}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          className={styles.treeAnt}
          blockNode
          titleRender={renderTreeTitle}
          onSelect={onSelect}
          treeData={treeData}
        />
      </div>
      <div className={styles.detailContainer}>
        <div className={styles.requiredKeyContainer}>
          <div className={styles.requiredKeyTitle}>tu khoa bat buoc:</div>
          <div>{detailData.required_value_key[0]}</div>
        </div>
        <div className={styles.removedValueContainer}>
          <div className={styles.removedKeyTitle}>tu khoa loai tru</div>
        </div>
      </div>
    </div>
  );

  function renderTreeTitle(node: any) {
    return <TreeTitle {...node} isEditable={true} />;
  }
};
