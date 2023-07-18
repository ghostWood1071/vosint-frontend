import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import { generateHTMLFromJSON } from "@/pages/events/components/event-item";
import { useLexicalComposerContext } from "@aiacademy/editor";
import { CaretDownOutlined } from "@ant-design/icons";
import { createEditor } from "lexical";
import { useMemo } from "react";

import styles from "./report-layout.module.less";

interface Props {
  data: any;
  id: any;
}
const Tree = (props: any) => {
  const { data } = props;
  const renderTree = (nodes: any) => {
    return (
      <ul style={{ listStyle: "none" }}>
        {nodes?.map((node: any) => (
          <li key={node._id}>
            {node.title}
            {node.children && node.children.length > 0 && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return <div className={styles.font_standart}>{renderTree(data)}</div>;
};

export const DirectoryTree: React.FC<Props> = ({ data, id }) => {
  const [editor] = useLexicalComposerContext();
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig?.namespace,
      nodes: eventEditorConfig?.nodes,
      onError: (error) => eventEditorConfig?.onError(error, editor),
      theme: eventEditorConfig?.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  if (eventEditor === null) return null;

  // Tạo một hàm đệ quy để xử lý việc tạo cây
  const generateTree = (items: any, parentId: any, level = 0): Array<any> => {
    const parent = items.find((item: any) => item._id === id); // Tìm đối tượng cha có _id bằng 1
    if (parentId === null) {
      return [
        {
          key: parent?._id,
          level: 0,
          title: <b>{parent?.title}</b>,
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
            {time ? (
              <div>
                {index + 1}. Ngày {time}, {title}
              </div>
            ) : (
              <div>{title}</div>
            )}
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
            {list_news?.map((itemNews: any) => {
              return (
                <li>
                  <a href={itemNews.url} target="_blank" rel="noreferrer">
                    - {itemNews.title}
                  </a>
                </li>
              );
            })}
          </div>
        );
        if (level === 1) {
          titleElement = <i className={styles["italicBold"]}>{titleElement}</i>; // Node con của node cha, nghiêng đậm
        } else if (level === 2) {
          titleElement = <i className={styles.italic}>{titleElement}</i>; // Node con của node con của node cha, nghiêng
        }
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
