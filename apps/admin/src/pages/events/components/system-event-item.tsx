import { useGetMe } from "@/pages/auth/auth.loader";
import { useQuickReportModalState } from "@/pages/news/components/quick-report-modal/index.state";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { BellOutlined, CloseOutlined, ShareAltOutlined, StarTwoTone } from "@ant-design/icons";
import { Checkbox, Space, Tooltip, message, Empty, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";

import { useMutationSystemEvents } from "../event.loader";
import styles from "./system-event-item.module.less";

interface Props {
  item: any;
  eventChoosedList: any[];
  setEventChoosedList: (value: any) => void;
}

export const SystemEventItem: React.FC<Props> = ({
  item,
  eventChoosedList,
  setEventChoosedList,
}) => {
  const setQuickEvent = useQuickReportModalState((state) => state.setEvent);
  const [checkbox, setCheckbox] = useState<boolean>(false);

  const [typeShow, setTypeShow] = useState<boolean>(true);
  const Ref = useRef<any>();
  const { mutate } = useMutationSystemEvents();
  const { data: dataIAm } = useGetMe();

  useEffect(() => {
    const a = eventChoosedList.findIndex((e) => e._id === item._id);
    if (a !== -1) {
      setCheckbox(true);
    } else {
      setCheckbox(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventChoosedList]);
  const checkoutClone = item?.list_user_clone?.includes(dataIAm?._id);

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
            <div className={styles.time}>{convertTimeToShowInUI(item?.date_created)}</div>

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
                {item?.event_name}.{" "}
                <span className={styles.detailContentHeader}>{item?.event_content}</span>
              </div>
            </div>
            <div className={styles.allButtonContainer}>
              <Space>
                <Tooltip
                  arrowPointAtCenter={true}
                  title="Thêm vào danh sách các sự kiện do người dùng tạo"
                  placement="topRight"
                >
                  <StarTwoTone
                    disabled={checkoutClone}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (checkoutClone) {
                        message.warning(
                          "Sự kiện đã được thêm vào danh sách các sự kiện do người dùng tạo",
                        );
                      } else {
                        handleCloneToEventCreatedByUser();
                      }
                    }}
                    twoToneColor={checkoutClone ? "#00A94E" : "#A6A6A6"}
                    className={styles.reportIcon}
                  />
                </Tooltip>
                <Tooltip
                  arrowPointAtCenter={true}
                  placement="topRight"
                  title={"Thêm sự kiện vào báo cáo nhanh"}
                >
                  <BellOutlined className={styles.ringIcon} onClick={handleOpenQuickReport} />
                </Tooltip>
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
                      title="Thêm vào danh sách các sự kiện do người dùng tạo"
                      placement="topRight"
                    >
                      <StarTwoTone
                        disabled={checkoutClone}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (checkoutClone) {
                            message.warning(
                              "Sự kiện đã được thêm vào danh sách các sự kiện do người dùng tạo",
                            );
                          } else {
                            handleCloneToEventCreatedByUser();
                          }
                        }}
                        twoToneColor={checkoutClone ? "#00A94E" : "#A6A6A6"}
                        className={styles.reportIcon}
                      />
                    </Tooltip>
                    <Tooltip
                      arrowPointAtCenter={true}
                      placement="topRight"
                      title={"Thêm sự kiện vào báo cáo nhanh"}
                    >
                      <BellOutlined className={styles.ringIcon} onClick={handleOpenQuickReport} />
                    </Tooltip>
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

              <div className={styles.detailContent} onClick={(event) => event.stopPropagation()}>
                {item?.event_content?.split(".").map((e: string) => {
                  if (e === "") {
                    return null;
                  }
                  return <p>{e + "."}</p>;
                })}
              </div>
              <div className={styles.listNewsContainer}>
                <div className={styles.titleText}>Danh sách các tin:</div>
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

  function handleCloneToEventCreatedByUser() {
    mutate({ event_id: item._id });
  }

  function handleOpenQuickReport() {
    setEventChoosedList([item]);
    setQuickEvent([item]);
  }
};
