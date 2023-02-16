import { DeleteOutlined, EditOutlined, FolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Input, Modal, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import React, { useRef } from "react";

import styles from "./tree-title.module.less";

const { Paragraph } = Typography;

interface Props extends TreeDataNode {
  isEditable?: boolean;
}

export const TreeTitle: React.FC<Props> = (node) => {
  const ref = useRef(null);
  console.log(node);
  return (
    <Row className={styles.treeTitle}>
      <Col span={2}>
        <FolderOutlined />
      </Col>
      <Col span={13}>
        <Paragraph ellipsis={{ rows: 1 }} className={styles.paragraph}>
          {node.title?.toString()}
        </Paragraph>
      </Col>

      <Col span={8} className={styles.menu} ref={ref}>
        <Space>
          <Tooltip title={"Thêm danh mục"}>
            <PlusOutlined onClick={handleAdd} className={styles.add} />
          </Tooltip>
          <Tooltip title={"Cập nhật danh mục"}>
            <EditOutlined onClick={handleEdit} className={styles.edit} />
          </Tooltip>
          <Tooltip title={"Xoá danh mục"}>
            <DeleteOutlined onClick={handleDelete} className={styles.delete} />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );

  function handleAdd() {
    Modal.confirm({
      title: "Thêm danh mục",
      content: <Input placeholder="Tên danh mục" />,
      getContainer: "#modal-mount",
      okText: "Thêm",
      cancelText: "Huỷ",
      onOk: function () {},
    });
  }

  function handleEdit() {
    Modal.confirm({
      title: "Cập nhật danh mục",
      content: <Input placeholder="Tên danh mục" defaultValue={node.title?.toString()} />,
      getContainer: "#modal-mount",
      okText: "Sửa",
      cancelText: "Huỷ",
      onOk: function () {},
    });
  }

  function handleDelete() {
    Modal.warning({
      title: "Xoá danh mục",
      content: node.title?.toString(),
      getContainer: "#modal-mount",
      onOk: function () {},
    });
  }
};
