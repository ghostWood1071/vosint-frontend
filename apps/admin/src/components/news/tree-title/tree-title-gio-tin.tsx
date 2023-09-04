import { DeleteOutlined, EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Space, TreeDataNode, Typography } from "antd";
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
  type?: ETreeTag;
}

export function TreeTitleGioTin({ onClick, children, isEditable, ...node }: Props): JSX.Element {
  const setNews = useNewsState((state) => state.setNews);
  const setNewsSelectId = useNewsState((state) => state.setNewsSelectId);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, handleClickAway);

  return (
    <Row className={`${styles.treeTitle} tree-title-gio-tin`} onClick={handleClick} align="middle">
      <Col span={isEditable ? 16 : 24}>
        <Space className={`${styles.title} title-report`}>
          <Typography.Paragraph
            ellipsis={{ rows: 1 }}
            className={classNames({
              [styles.paragraph]: true,
              [styles.isOpen]: isOpen,
            })}
          >
            <div className={`${styles.titleNode} title-node-report`}>{node.title?.toString()}</div>
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
                title={`Thêm ${MTreeTag[node.tag]} con`}
              />
              <EditOutlined
                onClick={handleUpdate}
                className={styles.edit}
                title={`Cập nhật ${MTreeTag[node.tag]} con`}
              />
              <DeleteOutlined
                onClick={handleDelete}
                className={styles.delete}
                title={`Xoá ${MTreeTag[node.tag]}`}
              />
            </Space>
          ) : (
            <EllipsisOutlined
              className={styles.ellips}
              onClick={(event) => {
                event.stopPropagation();
                handleOpen();
              }}
            />
          )}
        </Col>
      )}
    </Row>
  );

  function handleClick() {
    onClick?.(node._id, node.type ?? node.tag);
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
    setNewsSelectId(node._id);
  }

  function handleUpdate() {
    setNews({
      tag: node.tag,
      action: ETreeAction.UPDATE,
      data: {
        _id: node._id,
      },
    });
    setNewsSelectId(node._id);
  }

  function handleDelete() {
    // Modal.confirm({
    //   title: `Bạn có chắc muốn xoá "${data?.title}" không?`,
    //   icon: <ExclamationCircleOutlined />,
    //   okText: "Xoá",
    //   cancelText: "Huỷ",
    //   onOk: handleFormFinish,
    //   onCancel: handleCancel,
    // });
    setNews({
      tag: node.tag,
      action: ETreeAction.DELETE,
      data: {
        _id: node._id,
        title: node.title,
      },
    });
    setNewsSelectId(node._id);
  }
}
