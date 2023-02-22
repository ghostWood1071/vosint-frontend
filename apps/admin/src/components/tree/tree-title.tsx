import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import { pick } from "lodash";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClickAway } from "react-use";

import styles from "./tree-title.module.less";
import { ETreeAction, ETreeTag, useTreeStore } from "./tree.store";

const { Paragraph } = Typography;

interface Props extends TreeDataNode {
  isEditable?: boolean;
  _id: string;
  title: string;
  onClick?: (_id: string) => void;
  tag: ETreeTag;
}

export const TreeTitle: React.FC<Props> = ({ onClick, children, isEditable, ...node }) => {
  const setValues = useTreeStore((state) => state.setValues);

  // TODO: update translation
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, handleClickAway);

  return (
    <Row className={styles.treeTitle}>
      <Col span={16}>
        <Paragraph ellipsis={{ rows: 1 }} className={styles.paragraph} onClick={handleClick}>
          {node.title?.toString()}
        </Paragraph>
      </Col>
      {isEditable && (
        <Col span={8} className={styles.menu} ref={ref}>
          {isOpen ? (
            <Space>
              <Tooltip title={t(ETreeAction.CREATE) + t(node.tag)}>
                <PlusOutlined onClick={handleAdd} className={styles.add} />
              </Tooltip>
              <Tooltip title={t(ETreeAction.UPDATE) + t(node.tag)}>
                <EditOutlined onClick={handleEdit} className={styles.edit} />
              </Tooltip>
              <Tooltip title={t(ETreeAction.DELETE) + t(node.tag)}>
                <DeleteOutlined onClick={handleDelete} className={styles.delete} />
              </Tooltip>
            </Space>
          ) : (
            <EllipsisOutlined className={styles.ellips} onClick={handleOpen} />
          )}
        </Col>
      )}
    </Row>
  );

  function handleClick() {
    onClick?.(node._id);
  }

  function handleClickAway() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleAdd() {
    setValues({
      tag: node.tag,
      action: ETreeAction.CREATE,
      data: {
        parent_id: node._id,
      },
    });
  }

  function handleEdit() {
    const data = pick(node, ["title", "_id", "required_keyword", "exclusion_keyword"]);

    setValues({
      tag: node.tag,
      action: ETreeAction.UPDATE,
      data,
    });
  }

  function handleDelete() {
    const data = pick(node, ["title", "_id", "required_keyword", "exclusion_keyword"]);

    setValues({
      tag: node.tag,
      action: ETreeAction.DELETE,
      data: data,
    });
  }
};
