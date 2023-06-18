import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import {
  BellOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Checkbox, Empty, Space, Tag, Tooltip, Typography } from "antd";
import { LexicalEditor, createEditor } from "lexical";
import React, { useEffect, useMemo, useRef, useState } from "react";

import styles from "./event-item.module.less";

interface Props {
  item: any;
  onClickDelete: (value: any) => void;
  onClickEdit: (value: any) => void;
  onClickReport: (value: any) => void;
  lengthDataSource: number;
  eventChoosedList: any[];
  setEventChoosedList: (value: any) => void;
}

export const EventItem: React.FC<Props> = ({
  item,
  onClickDelete,
  onClickEdit,
  lengthDataSource,
  eventChoosedList,
  setEventChoosedList,
  onClickReport,
}) => {
  const [checkbox, setCheckbox] = useState<boolean>(false);

  const [typeShow, setTypeShow] = useState<boolean>(true);
  const Ref = useRef<any>();

  useEffect(() => {
    const a = eventChoosedList.findIndex((e) => e._id === item._id);
    if (a !== -1) {
      setCheckbox(true);
    } else {
      setCheckbox(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventChoosedList]);

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
  return (
    <div className={styles.mainContainer} key={item._id}>
      {typeShow ? (
        <div className={styles.newsLine}>
          <div ref={Ref} className={styles.header} onClick={(event) => event.stopPropagation()}>
            <div className={styles.checkboxContainer}>
              <Checkbox
                checked={checkbox}
                onClick={(event) => {
                  event.stopPropagation();
                  onChangeCheckbox();
                }}
              />
            </div>
            <div className={styles.time}>{convertTimeToShowInUI(item.date_created)}</div>

            <div
              className={
                item.system_created
                  ? styles.titleCreatedBySystemContainer
                  : styles.contentHeaderContainer
              }
              onClick={() => {
                setTypeShow(!typeShow);
                Ref?.current?.scrollIntoView();
              }}
            >
              <div className={styles.contentHeader}>
                {item.event_name}.{" "}
                <span className={styles.detailContentHeader}>
                  {returnTextFromRichText(item.event_content)}
                </span>
              </div>
            </div>
            <div className={styles.allButtonContainer}>
              <Space>
                <Tooltip
                  arrowPointAtCenter={true}
                  title="Thêm sự kiện vào báo cáo"
                  placement="topRight"
                >
                  <FileTextOutlined onClick={handleOpenReport} className={styles.reportIcon} />
                </Tooltip>
                <Tooltip
                  arrowPointAtCenter={true}
                  placement="topRight"
                  title={"Thêm sự kiện vào báo cáo nhanh"}
                >
                  <BellOutlined
                    className={styles.ringIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  />
                </Tooltip>

                <Tooltip placement="topRight" arrowPointAtCenter={true} title="Sửa sự kiện">
                  <EditOutlined
                    className={styles.edit}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClickEdit(item);
                    }}
                  />
                </Tooltip>
                {item.system_created ? null : (
                  <Tooltip title={"Xoá sự kiện"} placement="topRight" arrowPointAtCenter={true}>
                    <DeleteOutlined
                      className={styles.delete}
                      onClick={(event) => {
                        event.stopPropagation();
                        onClickDelete(item);
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          </div>
        </div>
      ) : (
        <div ref={Ref} className={styles.content}>
          <div
            onClick={() => {
              Ref?.current?.scrollIntoView();
            }}
            className={styles.scrollContainer}
          >
            <button className={styles.hideDetailButton} onClick={() => setTypeShow(!typeShow)}>
              <CloseOutlined title="Đóng chi tiết sự kiện" className={styles.closeIcon} />
            </button>
          </div>
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div className={styles.title}>{item.event_name}</div>

              <div className={styles.comtainer3}>
                <div className={styles.leftContainer3}>
                  <div className={styles.time}>{convertTimeToShowInUI(item.date_created)}</div>
                </div>
                <div className={styles.rightContainer3}>
                  <Space>
                    <Tooltip
                      arrowPointAtCenter={true}
                      title="Thêm sự kiện vào báo cáo"
                      placement="topRight"
                    >
                      <FileTextOutlined onClick={handleOpenReport} className={styles.reportIcon} />
                    </Tooltip>
                    <Tooltip title={"Thêm sự kiện vào báo cáo nhanh"}>
                      <BellOutlined
                        className={styles.ringIcon}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    </Tooltip>

                    <Tooltip placement="topRight" arrowPointAtCenter={true} title="Sửa sự kiện">
                      <EditOutlined
                        className={styles.edit}
                        onClick={(event) => {
                          event.stopPropagation();
                          onClickEdit(item);
                        }}
                      />
                    </Tooltip>
                    {item.system_created ? null : (
                      <Tooltip title={"Xoá sự kiện"} placement="topRight" arrowPointAtCenter={true}>
                        <DeleteOutlined
                          className={styles.delete}
                          onClick={(event) => {
                            event.stopPropagation();
                            onClickDelete(item);
                          }}
                        />
                      </Tooltip>
                    )}
                  </Space>
                </div>
              </div>
              <div className={styles.container1}>
                {item.chu_the?.length > 0 ? (
                  <div className={styles.khachtheContainer}>
                    Chủ thể: <span>{item.chu_the}</span>
                  </div>
                ) : null}
                {item.khach_the?.length > 0 ? (
                  <div className={styles.khachtheContainer}>
                    Khách thể: <span>{item.khach_the}</span>
                  </div>
                ) : null}
              </div>

              {item.list_report?.[0] !== undefined && (
                <div className={styles.container2}>
                  {item.list_report?.map((element: any, index: any) => {
                    return (
                      <Tag key={index} className={styles.tag}>
                        {element.title}
                      </Tag>
                    );
                  })}
                </div>
              )}

              <div className={styles.detailContent} onClick={(event) => event.stopPropagation()}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateHTMLFromJSON(item?.event_content, eventEditor),
                  }}
                />
              </div>
              <div className={styles.listNewsContainer}>
                <div className={styles.titleText}>Danh sách các tin:</div>
                {item.new_list?.length === 0 && item.news_added_by_user?.length === 0 && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
                )}
                {item.new_list?.map((e: any) => (
                  <div className={styles.titleNews}>
                    <Typography.Link href={e?.["data:url"]} target="_blank" rel="noreferrer">
                      <ShareAltOutlined /> {e?.["data:title"]}
                    </Typography.Link>
                  </div>
                ))}
                {item.news_added_by_user?.map((e: any) => (
                  <div className={styles.titleNews}>
                    <Typography.Link href={e?.["link"]} target="_blank" rel="noreferrer">
                      <ShareAltOutlined /> {e?.title}
                    </Typography.Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  function onChangeCheckbox() {
    if (checkbox === false) {
      setEventChoosedList([...eventChoosedList, item]);
    } else {
      setEventChoosedList([...eventChoosedList].filter((e) => e._id !== item._id));
    }
  }

  function handleOpenReport() {
    setEventChoosedList([item]);
    onClickReport([item]);
  }
};

export const eventHTMLCache: Map<string, string> = new Map();

function generateHTMLFromJSON(editorStateJSON: string, eventEditor: LexicalEditor): string {
  const editorState = eventEditor.parseEditorState(editorStateJSON);
  let html = eventHTMLCache.get(editorStateJSON);
  if (html === undefined) {
    html = editorState.read(() => $generateHtmlFromNodes(eventEditor, null));
    eventHTMLCache.set(editorStateJSON, html);
  }
  return html;
}

function returnTextFromRichText(richText: any) {
  const obj = JSON.parse(richText);
  let plainText = "";

  function extractTextFromObject(obj: any) {
    if (obj.children) {
      for (const child of obj.children) {
        if (child.text) {
          plainText += child.text + " ";
        }
        extractTextFromObject(child);
      }
    }
  }

  extractTextFromObject(obj.root);
  return plainText.trim();
}
