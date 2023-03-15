import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import classNames from "classnames";
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
  onClick?: (_id: string, tag: ETreeTag) => void;
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
    <Row className={styles.treeTitle} align="middle">
      <Col span={16}>
        <Space className={styles.title}>
          <Paragraph
            ellipsis={{ rows: 1 }}
            className={classNames({
              [styles.paragraph]: true,
              [styles.isOpen]: isOpen,
            })}
            onClick={handleClick}
          >
            {node.title?.toString()}
          </Paragraph>
        </Space>
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
    onClick?.(node._id, node.tag);
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
    const data = pick(node, [
      "title",
      "_id",
      "required_keyword",
      "exclusion_keyword",
      "news_samples",
    ]);

    setValues({
      tag: node.tag,
      action: ETreeAction.UPDATE,
      data,
    });
  }

  function handleDelete() {
    const data = pick(node, [
      "title",
      "_id",
      "required_keyword",
      "exclusion_keyword",
      "news_samples",
    ]);

    setValues({
      tag: node.tag,
      action: ETreeAction.DELETE,
      data: data,
    });
  }
};
