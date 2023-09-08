import { EventNodes, EventPlugin } from "@/components/editor/plugins/event-plugin";
import {
  EventEditorConfig,
  EventProvider,
} from "@/components/editor/plugins/event-plugin/event-context";
import { EventFilterNode } from "@/components/editor/plugins/event-plugin/event-filter-node";
import { EventNode } from "@/components/editor/plugins/event-plugin/event-node";
import ImportantButton from "@/components/important-button/important-button";
import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { ContentEditable, EditorNodes, editorTheme } from "@aiacademy/editor";
import "@aiacademy/editor/style.css";
import {
  AreaChartOutlined,
  BellTwoTone,
  CaretDownFilled,
  CaretUpFilled,
  CloseOutlined,
  ControlOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LineOutlined,
  LinkOutlined,
  LoadingOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  StarTwoTone,
  TranslationOutlined,
} from "@ant-design/icons";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { Checkbox, Modal, Skeleton, Space, Tag, Tooltip, Typography, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { MindmapModal } from "./mindmap-modal";
import { NewDetailSummary } from "./news-detail/components";
import "./table-news.less";
import styles from "./table-news.module.less";
import defaultThumbnail from"@/assets/img/default-thumbnail.jpg";

interface Props {
  item: any;
  type?: string;
  onDelete?: (id: string, tag?: ETreeTag) => void;
  onAdd?: (id: string, tag: ETreeTag) => void;
  lengthDataSource: number;
  typeTranslate: string;
  userId?: string;
  setSeen: (value: boolean, data: any) => void;
  handleUpdateCache: (value: string, func: Function) => void;
}

export const NewsTableItem: React.FC<Props> = ({
  item,
  type,
  onDelete,
  onAdd,
  lengthDataSource,
  typeTranslate,
  userId,
  setSeen,
  handleUpdateCache,
}) => {
  let { newsletterId, tag } = useParams();
  const { pathname } = useLocation();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const setOpenSelection = useNewsSelection((state) => state.setOpen);
  const [typeShow, setTypeShow] = useState<boolean>(true);

  const checkSeen = item.list_user_read ? item.list_user_read?.findIndex((e: string) => e === userId) : -1;

  const [typeDetail, setTypeDetail] = useState<any>("content");
  const [isVisibleModalMindmap, setIsVisibleModalMindmap] = useState<boolean>(false);
  const [isTranslation, setIsTranslation] = useState<boolean>(false);
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const Ref = useRef<any>();

  const initialConfig: InitialConfigType = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-report?");
    },
    theme: editorTheme,
    nodes: [...EditorNodes, EventNode, EventFilterNode],
  };

  const eventConfig: EventEditorConfig = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-event?");
    },
    theme: editorTheme,
    nodes: [...EventNodes],
  };

  useEffect(() => {
    const a = newsSelection.findIndex((e) => e._id === item._id);
    if (a !== -1) {
      setCheckbox(true);
    } else {
      setCheckbox(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsSelection, lengthDataSource]);


  return (
    <>
      {typeShow ? (
        <tr ref={Ref} className={styles.header}>
          <td width={120}>
            <Space>
              {/* <div className={styles.statusContainer}>
                <button
                  className={styles.seenButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSeen(checkSeen === -1, item._id);
                  }}
                >
                  <div className={checkSeen !== -1 ? styles.seen : styles.notSeen} />
                </button>
              </div> */}
              <Checkbox
                checked={checkbox}
                onClick={(event) => {
                  event.stopPropagation();
                  onChangeCheckbox();
                }}
              />

              {tag != "gio_tin" && (
                <Tooltip title="Thêm vào giỏ tin">
                  <ShoppingCartOutlined
                    onClick={(event) => {
                      event.stopPropagation();
                      onChangeCheckbox();
                      handleClickShop();
                    }}
                    className={styles.taskIcon}
                  />
                </Tooltip>
              )}

              <Tooltip  
              // title={item.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}>
              title="Xoá khỏi tin quan trọng">
                <ImportantButton item={item} handleClickImportant={handleClickImportant} />
              </Tooltip>
              <Tooltip 
                title={item.isStar ? "Xoá khỏi tin được đánh dấu" : "Thêm vào tin được đánh dấu"}
              >
                <StarTwoTone
                  twoToneColor={item.isStar ? "#FFCA10" : "#A6A6A6"}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClickStar();
                  }}
                  className={styles.taskIcon}
                />
              </Tooltip>
              {item["data:class_sacthai"] === "1" ? (
                <Tooltip title="Tích cực">
                  <CaretUpFilled className={styles.goodIcon} />
                </Tooltip>
              ) : item["data:class_sacthai"] === "2" ? (
                <Tooltip title="Tiêu cực">
                  <CaretDownFilled className={styles.badIcon} />
                </Tooltip>
              ) : (
                <Tooltip title="Trung tính">
                  <LineOutlined className={styles.normalIcon} />
                </Tooltip>
              )}
            </Space>
          </td>
          <td className={styles.sourceNameContainer}>
            <Tooltip title={item["source_name"].length >= 14 ? item["source_name"] : null}>
              {/* <div
                className={checkSeen !== -1 ? styles.seenSourceNameHeader : styles.sourceNameHeader}
                // className={item.is_read ? styles.seenSourceNameHeader : styles.sourceNameHeader}
                // style={{ color: item.is_read ? "#c0c0c0" : "black" }}
              >
                {item["source_name"]}
              </div> */}
              <div style={{ marginRight: "10px" }}>
                <img src={item["source_favicon"] || defaultThumbnail} title={item["source_name"]} className="source-icon" alt="" />
                {/* <img src={"https://dantri.com.vn/favicon.ico"} title={item["source_name"]} className="source-icon" alt="" /> */}
              </div>
            </Tooltip>
          </td>
          <td
            className={styles.titleHeaderContainer}
            onClick={() => {
              setTypeShow(!typeShow);

              if (checkSeen === -1) 
                setSeen(true, [item._id]);
              
              Ref?.current?.scrollIntoView();
            }}
          >
            <div className={checkSeen !== -1 ? styles.seenContentHeader : styles.contentHeader}>
              {item.source_language !== "vi" && typeTranslate === "nuoc-ngoai"
                ? item["data:title_translate"]
                : item["data:title"]}
              .{" "}
              <span className={styles.detailContentHeader}>
                {item.source_language !== "vi" && typeTranslate === "nuoc-ngoai"
                  ? item["data:content_translate"]
                  : item["data:content"]}
              </span>
            </div>
          </td>
          <td className={styles.col4}>
            <div className={styles.allNumberHeader}>
              <div className={styles.link}>
                <Tooltip
                  placement="topRight"
                  arrowPointAtCenter={true}
                  overlayInnerStyle={{ marginBottom: -15 }}
                  title={item["data:url"]}
                  overlayClassName={styles.tooltipLink}
                >
                  <Typography.Link href={item["data:url"]} target="_blank" rel="noreferrer">
                    <LinkOutlined style={{ color: "blue" }} />
                  </Typography.Link>
                </Tooltip>
              </div>
              <div className={styles.time}>
                {item.pub_date
                  ? convertTimeToShowInUI(item.pub_date)
                  : convertTimeToShowInUI(item.created_at)}
              </div>
            </div>
          </td>
          {type === "edit" ? (
            <td className={styles.edit}>
              <Tooltip title="Xoá tin khỏi giỏ" placement="topRight">
                <DeleteOutlined style={{ color: "#ff1207" }} onClick={handleRemove} />
              </Tooltip>
            </td>
          ) : null}
        </tr>
      ) : (
        <tr ref={Ref}>
          <td colSpan={type === "edit" ? 5 : 4}>
            <div className={`${styles.content}`}>
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
                  <CloseOutlined title="Đóng chi tiết tin" className={styles.closeIcon} />
                </button>
              </div>
              <div className={`${styles.detailContainer} news__detail`}>
                <div className={styles.detailHeader}>
                  <div className={styles.title} style={{ marginBottom: "50px" }}>
                    <span style={{ marginRight: 10 }} className="news__title">
                      {item["data:class_sacthai"] === "1" ? (
                        <Tooltip title="Tích cực">
                          <CaretUpFilled className={styles.goodIcon} />
                        </Tooltip>
                      ) : item["data:class_sacthai"] === "2" ? (
                        <Tooltip title="Tiêu cực">
                          <CaretDownFilled className={styles.badIcon} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Trung tính">
                          <LineOutlined className={styles.normalIcon} />
                        </Tooltip>
                      )}
                    </span>
                    {isTranslation && item["data:title_translate"]?.length > 1
                      ? item["data:title_translate"]
                      : item["data:title"]}
                  </div>
                  <div className={`${styles.container1} news__datetime`}>
                    {item["data:author"] ? (
                      <div className={styles.source}>{item["data:author"]}</div>
                    ) : null}
                    <div className={styles.time}>{item["data:time"]}</div>
                  </div>
                  <div className={`${styles.container2} news__keywords`}>
                    {item.keywords
                      ? item.keywords.map((element: any, index: any) => {
                          return (
                            <Tag key={index} className={styles.tag}>
                              {element}
                            </Tag>
                          );
                        })
                      : null}
                  </div>
                  <div className={`${styles.comtainer3} menu__tools`}>
                    <div className={styles.leftContainer3}>
                      <Space>
                        <Tooltip title="Thêm vào giỏ tin">
                          <ShoppingCartOutlined
                            className={styles.iconContent}
                            onClick={(event) => {
                              event.stopPropagation();
                              onChangeCheckbox();
                              handleClickShop();
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title={
                            item.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"
                          }
                        >
                          <ImportantButton
                            item={item}
                            handleClickImportant={handleClickImportant}
                            style={{ backgroundSize: "20px", top: "1px", left: "-2px" }}
                          />
                        </Tooltip>
                        <Tooltip
                          title={
                            item.isStar
                              ? "Xoá khỏi tin được đánh dấu"
                              : "Thêm vào tin được đánh dấu"
                          }
                        >
                          <StarTwoTone
                            className={styles.iconContent}
                            twoToneColor={item.isStar ? "#FFCA10" : "#A6A6A6"}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClickStar();
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          placement="topLeft"
                          arrowPointAtCenter={true}
                          overlayInnerStyle={{ marginBottom: -10 }}
                          title={item["data:url"]}
                          overlayClassName={styles.tooltipLink}
                        >
                          <Typography.Link href={item["data:url"]} target="_blank" rel="noreferrer">
                            <LinkOutlined style={{ color: "blue" }} />
                          </Typography.Link>
                        </Tooltip>
                      </Space>
                    </div>
                    <div className={styles.rightContainer3}>
                      <Space>
                        <Tooltip title="Dịch nội dung">
                          {isGettingData ? (
                            <LoadingOutlined className={styles.loadingIcon} />
                          ) : (
                            <TranslationOutlined
                              className={
                                isTranslation
                                  ? styles.choosedIconFilterContent
                                  : styles.iconFilterContent
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                if (item.source_language !== "vi") {
                                  handleClickTranslation();
                                } else {
                                  message.info("Nội dung đã ở dạng tiếng việt!");
                                }
                              }}
                            />
                          )}
                        </Tooltip>
                        <Tooltip title="Nội dung">
                          <ProfileOutlined
                            className={
                              typeDetail === "content"
                                ? styles.choosedIconFilterContent
                                : styles.iconFilterContent
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              setTypeDetail("content");
                            }}
                          />
                        </Tooltip>
                        <Tooltip title={"Tóm tắt"}>
                          <ControlOutlined
                            className={
                              typeDetail === "summary"
                                ? styles.choosedIconFilterContent
                                : styles.iconFilterContent
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              setTypeDetail("summary");
                            }}
                          />
                        </Tooltip>
                        <Tooltip title={"Mind map "} placement="topRight" arrowPointAtCenter>
                          <AreaChartOutlined
                            className={styles.iconFilterContent}
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsVisibleModalMindmap(true);
                            }}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                  {typeDetail === "content" ? (
                    isTranslation ? (
                      isGettingData ? (
                        <Skeleton className={styles.skeleton} active />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: item["data:content_translate"] }}
                          className={styles.detailContent}
                          onClick={(event) => event.stopPropagation()}
                        />
                      )
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: item["data:html"] }}
                        className={`${styles.detailContent} news__content`}
                        onClick={(event) => event.stopPropagation()}
                      />
                    )
                  ) : (
                    <div className={`${styles.detailContent}`}>
                      <NewDetailSummary content={item["data:content"]} title={item["data:title"]} />
                    </div>
                  )}
                  {isVisibleModalMindmap ? (
                    <LexicalComposer initialConfig={initialConfig}>
                      <EventProvider>
                        <EventPlugin eventEditorConfig={eventConfig}>
                          <HistoryPlugin />
                          <RichTextPlugin
                            contentEditable={<ContentEditable />}
                            placeholder={null}
                            ErrorBoundary={LexicalErrorBoundary}
                          />
                          <TabIndentationPlugin />
                        </EventPlugin>

                        <MindmapModal
                          isVisible={isVisibleModalMindmap}
                          item={item}
                          setHideModal={setIsVisibleModalMindmap}
                          isTranslation={isTranslation}
                          handleClickTranslation={handleClickTranslation}
                          isGettingData={isGettingData}
                        />
                      </EventProvider>
                    </LexicalComposer>
                  ) : null}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  function handleClickTranslation() {
    setIsGettingData(true);
    if (!isTranslation && item["data:content_translate"].length < 1) {
      handleUpdateCache(item._id, () => setIsGettingData(false));
    } else {
      setIsGettingData(false);
    }
    setIsTranslation(!isTranslation);
  }

  function onChangeCheckbox() {
    if (checkbox === false) {
      setNewsSelection([...newsSelection, item]);
    } else {
      setNewsSelection([...newsSelection].filter((e) => e._id !== item._id));
    }

    setCheckbox(!checkbox);
  }

  function handleRemove() {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá bản tin này?",
      icon: <ExclamationCircleOutlined />,
      content: `${item["data:title"]}`,
      okText: "Xoá",
      cancelText: "Thoát",
      onOk() {
        return onDelete?.(item._id);
      },
      onCancel() {},
    });
  }

  function handleClickShop() {
    setNewsSelection([item]);
    setOpenSelection(true);
  }

  function handleClickImportant() {
    item.isBell
      ? onDelete?.(item._id, ETreeTag.QUAN_TRONG)
      : onAdd?.(item._id, ETreeTag.QUAN_TRONG);
  }

  function handleClickStar() {
    item.isStar ? onDelete?.(item._id, ETreeTag.DANH_DAU) : onAdd?.(item._id, ETreeTag.DANH_DAU);
  }
};
