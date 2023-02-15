import { useNewsletterStore } from "@/pages/news/news.store";
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

  onSelect?: (selectedKeys: React.Key[]) => void;
  onClick?: (_id: string) => void;
  type: any;
  isEditable?: boolean;
}

export const Tree: React.FC<Props> = ({
  type,
  treeData,
  title,
  isSpinning,
  isEditable = false,
  onClick,
  onSelect,
}) => {
  const { setNewsletter, setOpen } = useNewsletterStore((state) => ({
    setNewsletter: state.setNewsletter,
    setOpen: state.setOpen,
  }));
  return (
    <Spin spinning={isSpinning}>
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
          selectable={!isEditable}
          treeData={treeData}
          titleRender={(node: any) => (
            <TreeTitle {...node} isEditable={isEditable} type={type} onClick={onClick} />
          )}
          onSelect={onSelect}
        />
      </div>
    </Spin>
  );

  function handleAdd() {
    setOpen("create");
    setNewsletter({
      topic: type,
    });
  }
};
