// import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import {
  BellTwoTone,
  CaretDownFilled,
  CaretUpFilled,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LineOutlined,
  LinkOutlined,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { Checkbox, Modal, Radio, Space, Tag, Tooltip, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

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

  const keyword = [
    "hello",
    "Viet nam",
    "Hai Duonng",
    "Nghe an",
    " okd la",
    "Vietnam.net",
    "Nong nghiep",
    "Lam nghiep",
    "Cong nghiep",
    "Xuat khau",
    "hang det may",
  ];

  const optionsRadio = [
    { label: "Nội dung", value: "content" },
    { label: "Tóm tắt", value: "summary" },
    { label: "Mind map", value: "mindmap" },
  ];

  const [typeShow, setTypeShow] = useState<boolean>(true);
  const [seen, setSeen] = useState<boolean>(false);
  const [typeDetail, setTypeDetail] = useState<any>("content");
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
              {item["data:class_sacthai"] === "2" ? (
                <Tooltip title="Tích cực">
                  <CaretUpFilled className={styles.goodIcon} />
                </Tooltip>
              ) : item["data:class_sacthai"] === "0" ? (
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
              <div className={styles.time}>{item["data:time"]}</div>
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
                  {item["data:class_sacthai"] === "2" ? (
                    <Tooltip title="Tích cực">
                      <CaretUpFilled className={styles.goodIcon} />
                    </Tooltip>
                  ) : item["data:class_sacthai"] === "0" ? (
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
                {keyword.map((element, index) => {
                  return (
                    <Tag key={index} className={styles.tag}>
                      {element}
                    </Tag>
                  );
                })}
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
                  <Radio.Group
                    options={optionsRadio}
                    onChange={changeTypeDetail}
                    value={typeDetail}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </div>
              </div>
              {typeDetail === "content" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: item["data:html"] }}
                  className={styles.detailContent}
                  onClick={(event) => event.stopPropagation()}
                />
              ) : typeDetail === "summary" ? (
                <NewDetailSummary content={item["data:content"]} title={item["data:title"]} />
              ) : (
                <></>
              )}
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

  function changeTypeDetail({ target: { value } }: RadioChangeEvent) {
    setTypeDetail(value);
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
