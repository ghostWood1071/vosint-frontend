import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Popover, Space, Typography } from "antd";
import cn from "classnames";
import { useRef, useState } from "react";

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
  const refIsOpen = useRef(null);

  const { setMode, setSelectedIndex, setCurrentHeading } = useHeadingTocDispatchContext();

  function scrollToNode(id: string, currentIndex: number) {
    window.location.hash = id;
    setSelectedKey(id);
    selectedIndex.current = currentIndex;
  }

  const handleAdd = () => {
    setMode("create");
    setSelectedIndex(null);
  };

  return (
    <div className={cn(styles.tableOfContents, "scrollbar table-of-contents")}>
      <Space align="start" className={styles.header}>
        <div className={styles.textHeader}>Mục lục</div>
        <div>
          <PlusCircleFilled onClick={handleAdd} />
        </div>
      </Space>
      <div className={styles.navigationItemList} tabIndex={0} ref={refIsOpen}>
        {headingsData.map(({ id, level, title }, index) => {
          const handleClick = (mode: "create" | "update" | "delete") => () => {
            setMode(mode);
            setCurrentHeading(level);
            setSelectedIndex(index);
          };

          return (
            <div
              key={id}
              className={cn(
                {
                  [styles.navigationItem]: true,
                  [styles.locationIndicatorHighlight]: selectedKey === id,
                },
                navigationItemLevel[level],
              )}
              role="navigation"
              onClick={() => scrollToNode(id, index)}
            >
              <Popover
                placement="right"
                content={
                  <Space>
                    <PlusOutlined
                      onClick={handleClick("create")}
                      className={styles.plus}
                      title={`Thêm tiêu đề bên dưới`}
                    />
                    <EditOutlined
                      onClick={handleClick("update")}
                      className={styles.edit}
                      title={`Chỉnh sửa tiêu đề`}
                    />
                    <DeleteOutlined
                      onClick={handleClick("delete")}
                      className={styles.delete}
                      title={`Xóa tiêu đề`}
                    />
                  </Space>
                }
              >
                <Typography.Text ellipsis>{title}</Typography.Text>
              </Popover>
            </div>
          );
        })}
      </div>
    </div>
  );
}
