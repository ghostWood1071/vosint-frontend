// import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
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
  ProfileOutlined,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { Checkbox, Modal, Space, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import { MindmapModal } from "./mindmap-modal";
import { NewDetailSummary } from "./news-detail/components";
import styles from "./news-item.module.less";

interface Props {
  item: any;
  type?: "edit";
  onDelete?: (id: string, tag?: ETreeTag) => void;
  onAdd?: (id: string, tag: ETreeTag) => void;
  lengthDataSource: number;
  setIndeterminate: (value: any) => void;
}

export const NewsItem: React.FC<Props> = ({
  item,
  type,
  onDelete,
  onAdd,
  lengthDataSource,
  setIndeterminate,
}) => {
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const setOpenSelection = useNewsSelection((state) => state.setOpen);

  const [typeShow, setTypeShow] = useState<boolean>(true);
  const [seen, setSeen] = useState<boolean>(false);
  const [typeDetail, setTypeDetail] = useState<any>("content");
  const [isVisibleModalMindmap, setIsVisibleModalMindmap] = useState<boolean>(false);
  const Ref = useRef<any>();

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
    <div className={styles.mainContainer} key={item.id}>
      {typeShow ? (
        <div className={styles.newsLine}>
          <div
            ref={Ref}
            className={type === "edit" ? styles.headerEdit : styles.header}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.statusContainer}>
              <button
                className={styles.seenButton}
                onClick={(event) => {
                  event.stopPropagation();
                  setSeen(!seen);
                }}
              >
                <div className={seen ? styles.seen : styles.notSeen} />
              </button>
            </div>
            <div className={styles.checkboxContainer}>
              <Checkbox
                checked={checkbox}
                onClick={(event) => {
                  event.stopPropagation();
                  onChangeCheckbox();
                }}
              />
            </div>
            <div className={styles.optionContainer}>
              <Space>
                <Tooltip title="Thêm vào giỏ tin">
                  <ShoppingCartOutlined
                    onClick={(event) => {
                      event.stopPropagation();
                      onChangeCheckbox();
                      handleClickShop();
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title={item.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}
                >
                  <BellTwoTone
                    twoToneColor={item.isBell ? "#00A94E" : "#A6A6A6"}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClickBell();
                    }}
                  />
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
                  />
                </Tooltip>
              </Space>
            </div>
            <div className={styles.typePostContainer}>
              {item["data:class_sacthai"] === "1" ? (
                <Tooltip title="Tích cực">
                  <CaretUpFilled className={styles.goodIcon} />
                </Tooltip>
              ) : item["data:class_sacthai"] === "-1" ? (
                <Tooltip title="Tiêu cực">
                  <CaretDownFilled className={styles.badIcon} />
                </Tooltip>
              ) : (
                <Tooltip title="Trung tính">
                  <LineOutlined className={styles.normalIcon} />
                </Tooltip>
              )}
            </div>
            <div
              className={styles.contentHeaderContainer}
              onClick={() => {
                setTypeShow(!typeShow);
                Ref?.current?.scrollIntoView();
                setSeen(true);
              }}
            >
              <div className={seen ? styles.seenContentHeader : styles.contentHeader}>
                {item["data:title"]}.{" "}
                <span className={styles.detailContentHeader}>{item["data:content"]}</span>
              </div>
            </div>
            <div className={styles.allNumberHeader}>
              <div className={styles.link}>
                <Tooltip title={"Link"}>
                  <Typography.Link href={item["data:url"]} target="_blank" rel="noreferrer">
                    <LinkOutlined style={{ color: "blue" }} />
                  </Typography.Link>
                </Tooltip>
              </div>
              <div className={styles.time}>
                {(new Date(item.pub_date).getDate() < 10
                  ? "0" + new Date(item.pub_date).getDate()
                  : new Date(item.pub_date).getDate()) +
                  "-" +
                  (new Date(item.pub_date).getMonth() < 9
                    ? "0" + (new Date(item.pub_date).getMonth() + 1)
                    : new Date(item.pub_date).getMonth() + 1) +
                  "-" +
                  new Date(item.pub_date).getFullYear()}
              </div>
            </div>
          </div>
          {type === "edit" ? (
            <div className={styles.edit}>
              <Tooltip title="Xoá tin khỏi giỏ" placement="topRight">
                <DeleteOutlined style={{ color: "#ff1207" }} onClick={handleRemove} />
              </Tooltip>
            </div>
          ) : null}
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
              <CloseOutlined className={styles.closeIcon} />
            </button>
          </div>
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div className={styles.title}>
                <span style={{ marginRight: 10 }}>
                  {item["data:class_sacthai"] === "1" ? (
                    <Tooltip title="Tích cực">
                      <CaretUpFilled className={styles.goodIcon} />
                    </Tooltip>
                  ) : item["data:class_sacthai"] === "-1" ? (
                    <Tooltip title="Tiêu cực">
                      <CaretDownFilled className={styles.badIcon} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Trung tính">
                      <LineOutlined className={styles.normalIcon} />
                    </Tooltip>
                  )}
                </span>
                {item["data:title"]}
              </div>
              <div className={styles.container1}>
                {item["data:author"] ? (
                  <div className={styles.source}>{item["data:author"]}</div>
                ) : null}
                <div className={styles.time}>{item["data:time"]}</div>
              </div>
              <div className={styles.container2}>
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
              <div className={styles.comtainer3}>
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
                      title={item.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}
                    >
                      <BellTwoTone
                        className={styles.iconContent}
                        twoToneColor={item.isBell ? "#00A94E" : "#A6A6A6"}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClickBell();
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      title={
                        item.isStar ? "Xoá khỏi tin được đánh dấu" : "Thêm vào tin được đánh dấu"
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
                    <Tooltip title={"Link"}>
                      <Typography.Link href={item["data:url"]} target="_blank" rel="noreferrer">
                        <LinkOutlined className={styles.iconContent} />
                      </Typography.Link>
                    </Tooltip>
                  </Space>
                </div>
                <div className={styles.rightContainer3}>
                  <Space>
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
                    <Tooltip title={"Mind map "}>
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
                <div
                  dangerouslySetInnerHTML={{ __html: item["data:html"] }}
                  className={styles.detailContent}
                  onClick={(event) => event.stopPropagation()}
                />
              ) : (
                <div className={styles.detailContent}>
                  <NewDetailSummary content={item["data:content"]} title={item["data:title"]} />
                </div>
              )}
              {isVisibleModalMindmap ? (
                <MindmapModal
                  isVisible={isVisibleModalMindmap}
                  item={item}
                  setHideModal={setIsVisibleModalMindmap}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  function onChangeCheckbox() {
    if (checkbox === false) {
      setNewsSelection([...newsSelection, item]);
      setIndeterminate(newsSelection.length < lengthDataSource - 1);
    } else {
      setNewsSelection([...newsSelection].filter((e) => e._id !== item._id));
      setIndeterminate(newsSelection.length !== 1);
    }
    setCheckbox(!checkbox);
  }

  function handleRemove() {
    Modal.confirm({
      title: "Bạn có muốn xoá bản tin này?",
      icon: <ExclamationCircleOutlined />,
      content: `${item["data:title"]}`,
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

  function handleClickBell() {
    item.isBell
      ? onDelete?.(item._id, ETreeTag.QUAN_TRONG)
      : onAdd?.(item._id, ETreeTag.QUAN_TRONG);
  }

  function handleClickStar() {
    item.isStar ? onDelete?.(item._id, ETreeTag.DANH_DAU) : onAdd?.(item._id, ETreeTag.DANH_DAU);
  }
};
