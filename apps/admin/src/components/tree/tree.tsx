import { PlusCircleFilled } from "@ant-design/icons";
import { Col, Row, Tree as TreeAntd } from "antd";
import type { DataNode } from "antd/lib/tree";
import React from "react";

import { ETreeAction, ETreeTag, MTreeTag, useNewsState } from "../news/news-state";
import { TreeTitleGioTin } from "../news/tree-title/tree-title-gio-tin";
import styles from "./tree.module.less";

interface Props {
  treeData: DataNode[];
  title: string;
  isSpinning?: boolean;
  selectedKeys?: React.Key[];

  isEditable?: boolean;
  tag: ETreeTag;

  onSelect?: (selectedKeys: React.Key[]) => void;
  onClickTitle?: (_id: string, tag: ETreeTag) => void;
}

export const Tree: React.FC<Props> = ({
  treeData,
  title,
  tag,
  isEditable = false,
  selectedKeys,
  onClickTitle,
}) => {
  const setNews = useNewsState((state) => state.setNews);
  const setNewsSelectId = useNewsState((state) => state.setNewsSelectId);

  return (
    <div className={styles.tree}>
      <Row className={styles.title}>
        <Col span={16} className={styles.text}>
          {title}
        </Col>
        {isEditable && (
          <Col span={8} className={styles.icon}>
            <PlusCircleFilled onClick={handleAdd} title={`Thêm ${MTreeTag[tag]} con`} />
          </Col>
        )}
      </Row>
      <TreeAntd
        className={styles.treeAnt}
        blockNode
        treeData={treeData}
        titleRender={(node: any) => (
          <TreeTitleGioTin {...node} isEditable={isEditable} onClick={onClickTitle} tag={tag} />
        )}
        selectedKeys={selectedKeys}
        onSelect={handleSelect}
      />
    </div>
  );

  function handleSelect(selectedKeys: React.Key[]) {
    if (selectedKeys[0] !== undefined) {
      setNewsSelectId(selectedKeys[0]);
    }
  }

  function handleAdd() {
    setNews({
      tag,
      action: ETreeAction.CREATE,
      data: null,
    });
  }
};
