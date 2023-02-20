import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";

import styles from "./table-item.module.less";
import { TreeTitle } from "./tree-title";

interface TableItemProps {
  values: any;
}

export const TableItem: React.FC<TableItemProps> = ({ values }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.treeContainer}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          className={styles.treeAnt}
          blockNode
          titleRender={renderTreeTitle}
          onSelect={handleSelect}
          treeData={[values]}
        />
      </div>
      <div className={styles.detailContainer}>
        <div className={styles.requiredKeyContainer}>
          <div className={styles.requiredKeyTitle}>
            bắt buộc:
            <span> {values.required_keyword?.[0]}, ...</span>
          </div>
          <div className={styles.requiredKeyTitle}>
            loại trừ:
            <span> {values.exclusion_keyword}, ...</span>
          </div>
        </div>
      </div>
    </div>
  );

  function handleSelect() {}

  function renderTreeTitle(node: any) {
    return <TreeTitle {...node} isEditable={true} />;
  }
};
