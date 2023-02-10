import { PlusCircleFilled } from "@ant-design/icons";
import { Col, Row, Spin, Tree as TreeAntd } from "antd";
import { DataNode } from "antd/lib/tree";
import React from "react";

import { TreeTitle } from "./tree-title";
import styles from "./tree.module.less";

interface Props {
  treeData: DataNode[];
  title: string;
  isSpinning?: boolean;
  onAdd?: () => void;
  onSelect?: (selectedKeys: React.Key[]) => void;
}

export const Tree: React.FC<Props> = ({ treeData, title, isSpinning, onAdd, onSelect }) => {
  return (
    <Spin spinning={isSpinning}>
      <div className={styles.tree}>
        <Row className={styles.title}>
          <Col span={16} className={styles.text}>
            {title}
          </Col>
          {onAdd && (
            <Col span={8} className={styles.icon}>
              <PlusCircleFilled onClick={onAdd} />
            </Col>
          )}
        </Row>
        <TreeAntd
          className={styles.treeAnt}
          blockNode
          selectable={!onAdd}
          treeData={treeData}
          titleRender={renderTreeTitle}
          onSelect={onSelect}
        />
      </div>
    </Spin>
  );

  function renderTreeTitle(node: any) {
    return <TreeTitle {...node} isEditable={!!onAdd} />;
  }
};
