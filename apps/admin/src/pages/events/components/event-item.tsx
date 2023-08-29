import { getKeywords } from "@/common/_helper";
import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import NewsEventSummaryModal from "@/pages/news/components/news-event-summary-modal";
import { useQuickReportModalState } from "@/pages/news/components/quick-report-modal/index.state";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import {
  BellOutlined,
  CloseOutlined,
  ControlOutlined,
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

import "./event-detail.less";
import styles from "./event-item.module.less";
import EventKeyword from "./event-keywords";

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
  const setQuickEvent = useQuickReportModalState((state) => state.setEvent);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [typeShow, setTypeShow] = useState<boolean>(true);
  const [typeDetail, setTypeDetail] = useState<any>("content");
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
                  <BellOutlined className={styles.ringIcon} onClick={handleOpenQuickReport} />
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
            <button
              className={`${styles.hideDetailButton} btn__close`}
              onClick={() => setTypeShow(!typeShow)}
            >
              <CloseOutlined title="Đóng chi tiết sự kiện" className={styles.closeIcon} />
            </button>
          </div>
          <div className={`${styles.detailContainer} news__detail`}>
            <div className={styles.detailHeader}>
              <div className={`${styles.title} news__title`}>{item.event_name}</div>

              <div className={`${styles.comtainer3} news__datetime`}>
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
                      <BellOutlined className={styles.ringIcon} onClick={handleOpenQuickReport} />
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
                    {/* <NewsEventSummaryModal item={item} /> */}
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
                <div className={`${styles.container2} news__keywords`}>
                  {item.list_report?.map((element: any, index: any) => {
                    return (
                      <Tag key={index} className={styles.tag}>
                        {element.title}
                      </Tag>
                    );
                  })}
                </div>
              )}

              <div className={`${styles.container2} news__keywords`}>
                <EventKeyword item={item} />
              </div>

              <div
                className={`${styles.detailContent} news__content`}
                onClick={(event) => event.stopPropagation()}
              >
                <div
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: generateHTMLFromJSON(item?.event_content, eventEditor),
                  }}
                />
              </div>
              <div className={styles.listNewsContainer}>
                <div className={styles.titleText}>
                  Nguồn tin ({item.new_list?.length + item.news_added_by_user?.length}):
                </div>
                {item.new_list?.length === 0 && item.news_added_by_user?.length === 0 && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
                )}
                {item.new_list?.map((e: any) => (
                  <div key={e._id} className={styles.titleNews}>
                    <Typography.Link href={e?.["data:url"]} target="_blank" rel="noreferrer">
                      <ShareAltOutlined /> {e?.["data:title"]}
                    </Typography.Link>
                  </div>
                ))}
                {item.news_added_by_user?.map((e: any) => (
                  <div key={e.id} className={styles.titleNews}>
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

  function handleOpenQuickReport() {
    setEventChoosedList([item]);
    setQuickEvent([item]);
  }
};

export const eventHTMLCache: Map<string, string> = new Map();

export function generateHTMLFromJSON(editorStateJSON: string, eventEditor: LexicalEditor): string {
  try {
    const editorState = eventEditor.parseEditorState(editorStateJSON);
    let html = eventHTMLCache.get(editorStateJSON);
    if (html === undefined) {
      html = editorState.read(() => $generateHtmlFromNodes(eventEditor, null));
      eventHTMLCache.set(editorStateJSON, html);
    }
    return html;
  } catch {
    return editorStateJSON;
  }
}

const defaultContent = (text: string) =>
  `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":${text},"type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

function render(plainText: string) {
  return function extractTextFromObject(obj: any): string {
    if (obj.children) {
      for (const child of obj.children) {
        if (child.text) {
          plainText += child.text + " ";
        }
        extractTextFromObject(child);
      }
    }
    return plainText;
  };
}

function returnTextFromRichText(richText: any) {
  let plainText = render("");
  try {
    var obj = JSON.parse(richText);
  } catch {
    obj = JSON.parse(defaultContent(JSON.stringify(richText)));
  }
  return plainText(obj).trim();
}
