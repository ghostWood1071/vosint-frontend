import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./table-item.module.less";
import { TreeTitle } from "./tree-title";

interface TableItemProps {
  values: any;
}

export const TableItem: React.FC<TableItemProps> = ({ values }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className={styles.mainContainer}>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        className={styles.treeAnt}
        blockNode
        titleRender={renderTreeTitle}
        onSelect={handleSelect}
        treeData={values}
      />
    </div>
  );

  function handleSelect(e: any) {
    if (e.length > 0) {
      searchParams.set("newsletter_id", e[0]);
      setSearchParams(searchParams);
    }
  }

  function renderTreeTitle(node: any) {
    return <TreeTitle {...node} isEditable={true} />;
  }
};
