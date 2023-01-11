import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Typography, TreeDataNode, Space, Tooltip, Modal, Input } from "antd";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClickAway } from "react-use";
import styles from "./tree-title.module.less";

const { Paragraph } = Typography;

interface Props extends TreeDataNode {
  isEditable?: boolean;
}

export const TreeTitle: React.FC<Props> = (node) => {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, handleClickAway);

  return (
    <Row className={styles.treeTitle}>
      <Col span={16}>
        <Paragraph ellipsis={{ rows: 1 }} className={styles.paragraph}>
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

  function handleClickAway() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleAdd() {
    Modal.confirm({
      title: t("add_basket"),
      content: <Input placeholder="Tên giỏ tin" />,
      getContainer: "#modal-mount",
      okText: "Thêm",
      cancelText: "Huỷ",
      onOk: function () {},
    });
  }

  function handleEdit() {
    Modal.confirm({
      title: t("update_basket"),
      content: <Input placeholder="Tên giỏ tin" defaultValue={node.title?.toString()} />,
      getContainer: "#modal-mount",
      okText: "Sửa",
      cancelText: "Huỷ",
      onOk: function () {},
    });
  }

  function handleDelete() {
    Modal.warning({
      title: t("confirm_delete_news_basket"),
      content: node.title?.toString(),
      getContainer: "#modal-mount",
      onOk: function () {},
    });
  }
};
