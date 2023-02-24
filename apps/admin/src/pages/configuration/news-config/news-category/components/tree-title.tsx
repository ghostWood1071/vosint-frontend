import { ETreeAction, ETreeTag, useTreeStore } from "@/components/tree/tree.store";
import { DeleteOutlined, EditOutlined, FolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import { pick } from "lodash";
import React from "react";

import styles from "./tree-title.module.less";

const { Paragraph } = Typography;

interface Props extends TreeDataNode {
  isEditable?: boolean;
  _id: string;
  title: string;
  onClick?: (_id: string) => void;
  tag: ETreeTag;
}

export const TreeTitle: React.FC<Props> = (node) => {
  const setValues = useTreeStore((state) => state.setValues);

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

      <Col span={8} className={styles.menu}>
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
