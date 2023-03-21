import { DeleteOutlined, EditOutlined, FolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";

import { ETreeAction, ETreeTag, useNewsState } from "../news-state";
import styles from "./tree-title-linh-vuc.module.less";

interface Props extends TreeDataNode {
  isEditable?: boolean;
  _id: string;
  title: string;
  onClick?: (_id: string) => void;
  tag: ETreeTag;
}

export function TreeTitleLinhVuc(node: Props): JSX.Element {
  const setNews = useNewsState((state) => state.setNews);

  return (
    <Row className={styles.treeTitle}>
      <Col span={2}>
        <FolderOutlined />
      </Col>
      <Col span={13}>
        <Typography.Paragraph ellipsis={{ rows: 1 }} className={styles.paragraph}>
          {node.title?.toString()}
        </Typography.Paragraph>
      </Col>

      <Col span={8} className={styles.menu}>
        <Space>
          <Tooltip title={"Thêm danh mục"}>
            <PlusOutlined onClick={handleCreate} className={styles.add} />
          </Tooltip>
          <Tooltip title={"Cập nhật danh mục"}>
            <EditOutlined onClick={handleUpdate} className={styles.edit} />
          </Tooltip>
          <Tooltip title={"Xoá danh mục"}>
            <DeleteOutlined onClick={handleDelete} className={styles.delete} />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );

  function handleCreate() {
    setNews({
      tag: node.tag,
      action: ETreeAction.CREATE,
      data: {
        parent_id: node._id,
      },
    });
  }

  function handleUpdate() {
    setNews({
      tag: node.tag,
      action: ETreeAction.UPDATE,
      data: {
        _id: node._id,
      },
    });
  }

  function handleDelete() {
    setNews({
      tag: node.tag,
      action: ETreeAction.DELETE,
      data: {
        _id: node._id,
        title: node.title,
      },
    });
  }
}
