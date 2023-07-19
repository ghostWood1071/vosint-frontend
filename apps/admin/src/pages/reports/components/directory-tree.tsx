import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import { generateHTMLFromJSON } from "@/pages/events/components/event-item";
import { useLexicalComposerContext } from "@aiacademy/editor";
import { CaretDownOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import cn from "classnames";
import { createEditor } from "lexical";
import moment from "moment";
import { FC, useMemo } from "react";

import styles from "./report-layout.module.less";

interface Props {
  data: any;
  id: any;
}

const Tree = (props: any) => {
  const { data } = props;
  const renderTree = (nodes: any) => {
    return (
      <Space direction={"vertical"} style={{ paddingLeft: 20 }}>
        {nodes?.map((node: any) => (
          <div key={node._id}>
            {node.title}
            {node.children && node.children.length > 0 && renderTree(node.children)}
          </div>
        ))}
      </Space>
    );
  };

  return <div className={styles.font_standart}>{renderTree(data)}</div>;
};

export const DirectoryTree: FC<Props> = ({ data, id }) => {
  const [editor] = useLexicalComposerContext();
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    return createEditor({
      namespace: eventEditorConfig?.namespace,
      nodes: eventEditorConfig?.nodes,
      onError: (error) => eventEditorConfig?.onError(error, editor),
      theme: eventEditorConfig?.theme,
    });
  }, [editor, eventEditorConfig]);

  if (eventEditor === null) return null;

  // Tạo một hàm đệ quy để xử lý việc tạo cây
  const generateTree = (items: any, parentId: any, level = 0): Array<any> => {
    const parent = items.find((item: any) => item._id === id); // Tìm đối tượng cha có _id bằng 1
    if (parentId === null) {
      return [
        {
          key: parent?._id,
          level: 0,
          title: <div style={{ fontWeight: "bold" }}>{parent?.title}</div>,
          children: generateTree(items, parent?._id, 1),
        },
      ];
    }
    return items
      .filter((item: any) => item.parent_id === parentId || item._id === null)
      .map((item: any, index: any) => {
        const { _id, title, time, content, list_news } = item;
        const children = generateTree(items, _id, level + 1); // Đệ quy để tạo cây con
        let titleElement = (
          <div>
            <div
              className={cn({
                [styles.italicBold]: level === 1,
                [styles.italic]: level === 2,
              })}
            >
              {time ? `${index + 1}, Ngày ${moment(time).format("DD/MM/YYYY")}, ` : ``}
              {title}
            </div>
            {content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: generateHTMLFromJSON(content, eventEditor),
                }}
              />
            )}
            {list_news && (
              <div>
                <CaretDownOutlined /> Nguồn tin
              </div>
            )}
            <Space style={{ paddingLeft: 20 }}>
              {list_news?.map((itemNews: any) => {
                return (
                  <a href={itemNews.url} target="_blank" rel="noreferrer">
                    - {itemNews.title}
                  </a>
                );
              })}
            </Space>
          </div>
        );
        return {
          key: _id,
          level: level,
          title: titleElement,
          children: children.length > 0 ? children : null,
        };
      });
  };

  const treeData = generateTree(data, null);

  return (
    <div>
      <Tree data={treeData} />
    </div>
  );
};
