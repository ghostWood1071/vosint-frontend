import { useNewsletterStore } from "@/pages/news/news.store";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClickAway } from "react-use";

import styles from "./tree-title.module.less";

const { Paragraph } = Typography;

interface Props extends TreeDataNode {
  isEditable?: boolean;
  _id: string;
  title: string;
  tags: string[];
  type: any;
  onClick?: (_id: string) => void;
}

export const TreeTitle: React.FC<Props> = (node) => {
  const { setNewsletter, setOpen } = useNewsletterStore((state) => ({
    setNewsletter: state.setNewsletter,
    setOpen: state.setOpen,
  }));
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
      {node.isEditable && (
        <Col span={8} className={styles.menu} ref={ref}>
          {isOpen ? (
            <Space>
              <Tooltip title={t("add_basket")}>
                <PlusOutlined onClick={handleAdd} className={styles.add} />
              </Tooltip>
              <Tooltip title={t("update_basket")}>
                <EditOutlined onClick={handleEdit} className={styles.edit} />
              </Tooltip>
              <Tooltip title={t("delete_basket")}>
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
    node?.onClick?.(node._id);
  }

  function handleClickAway() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleAdd() {
    setOpen("create");
    setNewsletter({
      parent_id: node._id,
      topic: node.type,
    });
  }

  function handleEdit() {
    setOpen("update");
    setNewsletter({
      _id: node._id,
      title: node.title,
      topic: node.type,
    });
  }

  function handleDelete() {
    setOpen("delete");
    setNewsletter({
      _id: node._id,
      title: node.title,
      tags: node.tags,
      topic: node.type,
    });
  }
};
