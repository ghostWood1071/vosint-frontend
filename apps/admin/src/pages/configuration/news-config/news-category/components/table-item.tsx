import { useNewsState } from "@/components/news/news-state";
import { TreeTitleLinhVuc } from "@/components/news/tree-title/tree-title-linh-vuc";
import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";

import styles from "./table-item.module.less";

interface TableItemProps {
  values: any;
}

export const TableItem: React.FC<TableItemProps> = ({ values }) => {
  const setNewsSelectId = useNewsState((state) => state.setNewsSelectId);

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
      setNewsSelectId(e[0]);
    }
  }

  function renderTreeTitle(node: any) {
    return <TreeTitleLinhVuc {...node} isEditable={true} />;
  }
};
