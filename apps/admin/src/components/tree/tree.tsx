import { PlusCircleFilled } from "@ant-design/icons";
import { Col, Row, Tree as TreeAntd } from "antd";
import type { DataNode } from "antd/lib/tree";
import React from "react";

import { TreeTitle } from "./tree-title";
import styles from "./tree.module.less";
import { ETreeAction, ETreeTag, useTreeStore } from "./tree.store";

interface Props {
  treeData: DataNode[];
  title: string;
  isSpinning?: boolean;
  selectedKeys?: string[];

  isEditable?: boolean;
  tag: ETreeTag;

  onSelect?: (selectedKeys: React.Key[]) => void;
  onClickTitle?: (_id: string) => void;
}

export const Tree: React.FC<Props> = ({
  treeData,
  title,
  tag,
  isEditable = false,
  selectedKeys,
  onClickTitle,
  onSelect,
}) => {
  const setValues = useTreeStore((state) => state.setValues);

  return (
    <div className={styles.tree}>
      <Row className={styles.title}>
        <Col span={16} className={styles.text}>
          {title}
        </Col>
        {isEditable && (
          <Col span={8} className={styles.icon}>
            <PlusCircleFilled onClick={handleAdd} />
          </Col>
        )}
      </Row>
      <TreeAntd
        className={styles.treeAnt}
        blockNode
        treeData={treeData}
        titleRender={(node: any) => (
          <TreeTitle {...node} isEditable={isEditable} onClick={onClickTitle} tag={tag} />
        )}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
      />
    </div>
  );

  function handleAdd() {
    setValues({
      tag,
      action: ETreeAction.CREATE,
      data: null,
    });
  }
};
