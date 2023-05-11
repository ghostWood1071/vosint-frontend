import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Col, Row, Space, Typography } from "antd";
import cn from "classnames";
import { useRef, useState } from "react";
import { MouseEventHandler } from "react";
import { useClickAway } from "react-use";

import { useHeadingTocDispatchContext } from "./heading-toc.context";
import styles from "./heading-toc.module.less";
import { HeadingsData } from "./headings";

interface Props {
  headingsData: HeadingsData[];
}

export const navigationItemLevel: Record<number, string> = {
  1: styles.navigationItemLevel1,
  2: styles.navigationItemLevel2,
  3: styles.navigationItemLevel3,
  4: styles.navigationItemLevel4,
  5: styles.navigationItemLevel5,
};

export function HeadingToc({ headingsData }: Props): JSX.Element {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectedIndex = useRef(0);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const refIsOpen = useRef(null);

  const { setMode, setSelectedIndex } = useHeadingTocDispatchContext();

  function scrollToNode(id: string, currentIndex: number) {
    window.location.hash = id;
    setSelectedKey(id);
    selectedIndex.current = currentIndex;
  }

  const handleClickAway = () => {
    setIsOpen(null);
  };

  useClickAway(refIsOpen, handleClickAway);

  const handleCreate = () => {
    setMode("create");
  };

  const handleUpdate = () => {
    setMode("update");
  };

  const handleDelete = () => {
    setMode("delete");
  };

  const handleAdd = () => {
    setMode("create");
    setSelectedIndex(null);
  };

  return (
    <div className={cn(styles.tableOfContents, "scrollbar table-of-contents")}>
      <Row align="middle" justify="space-between">
        <div className={styles.header}>Outline</div>
        <div className={styles.icon}>
          <PlusCircleFilled onClick={handleAdd} />
        </div>
      </Row>
      <div className={styles.navigationItemList} tabIndex={0} ref={refIsOpen}>
        {headingsData.map(({ id, level, title }, index) => {
          const handleOpen: MouseEventHandler<HTMLSpanElement> = (e) => {
            e.stopPropagation();
            setIsOpen(id);
            setSelectedIndex(index);
          };

          return (
            <Row
              key={id}
              justify={"space-between"}
              className={cn({
                [styles.navigationItem]: true,
                [styles.locationIndicatorHighlight]: selectedKey === id,
              })}
              role="navigation"
              onClick={() => scrollToNode(id, index)}
              gutter={[8, 8]}
            >
              {/* <div className={cn(styles.navigationItemContent, navigationItemLevel[level])}>
                {title}
              </div> */}
              <Col span={19}>
                <Typography.Text ellipsis>{title}</Typography.Text>
              </Col>
              <Col span={5} className={styles.right}>
                {isOpen === id ? (
                  <Space>
                    <PlusOutlined
                      onClick={handleCreate}
                      className={styles.plus}
                      title={`Thêm tiêu đề bên dưới`}
                    />
                    <EditOutlined
                      onClick={handleUpdate}
                      className={styles.edit}
                      title={`Chỉnh sửa tiêu đề`}
                    />
                    <DeleteOutlined
                      onClick={handleDelete}
                      className={styles.delete}
                      title={`Xóa tiêu đề`}
                    />
                  </Space>
                ) : (
                  <EllipsisOutlined className={styles.ellips} onClick={handleOpen} />
                )}
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
