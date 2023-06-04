import { ReportIcon } from "@/assets/svg";
import { CloseOutlined, DeleteOutlined, EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { Checkbox, Space, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";

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
            <div className={styles.time}>
              {(new Date(item.date_created).getDate() < 10
                ? "0" + new Date(item.date_created).getDate()
                : new Date(item.date_created).getDate()) +
                "/" +
                (new Date(item.date_created).getMonth() < 9
                  ? "0" + (new Date(item.date_created).getMonth() + 1)
                  : new Date(item.date_created).getMonth() + 1) +
                "/" +
                new Date(item.date_created).getFullYear()}
            </div>

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
                <span className={styles.detailContentHeader}>{item.event_content}</span>
              </div>
            </div>
            <div className={styles.allButtonContainer}>
              <Tooltip
                arrowPointAtCenter={true}
                title="Thêm sự kiện vào báo cáo"
                placement="topRight"
              >
                <FileTextOutlined onClick={handleOpenReport} className={styles.reportIcon} />
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
                  <div className={styles.time}>
                    {(new Date(item.date_created).getDate() < 10
                      ? "0" + new Date(item.date_created).getDate()
                      : new Date(item.date_created).getDate()) +
                      "/" +
                      (new Date(item.date_created).getMonth() < 9
                        ? "0" + (new Date(item.date_created).getMonth() + 1)
                        : new Date(item.date_created).getMonth() + 1) +
                      "/" +
                      new Date(item.date_created).getFullYear()}
                  </div>
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
              <div className={styles.container2}>
                {item.chu_the.length > 0 ? (
                  <div className={styles.khachtheContainer}>
                    Chủ thể: <span>{item.chu_the}</span>
                  </div>
                ) : null}
                {item.khach_the.length > 0 ? (
                  <div className={styles.khachtheContainer}>
                    Khách thể: <span>{item.khach_the}</span>
                  </div>
                ) : null}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: item.event_content }}
                className={styles.detailContent}
                onClick={(event) => event.stopPropagation()}
              />
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
