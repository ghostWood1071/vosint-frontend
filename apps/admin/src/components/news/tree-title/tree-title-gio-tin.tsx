import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space, Tooltip, TreeDataNode, Typography } from "antd";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

import { ETreeAction, ETreeTag, MTreeTag, useNewsState } from "../news-state";
import styles from "./tree-title-gio-tin.module.less";

interface Props extends TreeDataNode {
  isEditable?: boolean;
  _id: string;
  title: string;
  onClick?: (_id: string, tag: ETreeTag) => void;
  tag: ETreeTag;
}

export function TreeTitleGioTin({ onClick, children, isEditable, ...node }: Props): JSX.Element {
  const setNews = useNewsState((state) => state.setNews);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, handleClickAway);

  return (
    <Row className={styles.treeTitle} align="middle">
      <Col span={16}>
        <Space className={styles.title}>
          <Typography.Paragraph
            ellipsis={{ rows: 1 }}
            className={classNames({
              [styles.paragraph]: true,
              [styles.isOpen]: isOpen,
            })}
            onClick={handleClick}
          >
            {node.title?.toString()}
          </Typography.Paragraph>
        </Space>
      </Col>
      {isEditable && (
        <Col span={8} className={styles.menu} ref={ref}>
          {isOpen ? (
            <Space>
              <PlusOutlined
                onClick={handleCreate}
                className={styles.add}
                title={`Thêm ${MTreeTag[node.tag]}`}
              />
              <EditOutlined
                onClick={handleUpdate}
                className={styles.edit}
                title={`Sửa ${MTreeTag[node.tag]}`}
              />
              <DeleteOutlined
                onClick={handleDelete}
                className={styles.delete}
                title={`Xoá ${MTreeTag[node.tag]}`}
              />
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
