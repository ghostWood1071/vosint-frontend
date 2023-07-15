import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { LoadingOutlined, StarTwoTone } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import React, { useRef, useState } from "react";

import { useMutationTTXVN } from "../ttxvn.loader";
import styles from "./ttxvn-news-item.module.less";

interface Props {
  item: any;
}

export const TTXVNNewsItem: React.FC<Props> = ({ item }) => {
  const Ref = useRef<any>();
  const [isCrawlingData, setIsCrawlingData] = useState<boolean>(false);
  const { mutate } = useMutationTTXVN();

  return (
    <div className={styles.mainContainer} key={item._id}>
      <div className={styles.newsLine}>
        <div ref={Ref} className={styles.header} onClick={(event) => event.stopPropagation()}>
          <div className={styles.time}>{convertTimeToShowInUI(item.PublishDate)}</div>
          <div className={styles.contentHeaderContainer}>
            <div className={styles.contentHeader}>{item.Title}</div>
          </div>
          <div className={styles.allButtonContainer}>
            <Space>
              {isCrawlingData ? (
                <LoadingOutlined className={styles.loadingIcon} />
              ) : (
                <Tooltip
                  arrowPointAtCenter={true}
                  title={item.content ? "Tin đã được lấy" : "Lấy chi tiết tin"}
                  placement="topRight"
                >
                  <StarTwoTone
                    disabled={item.content}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (item.content) {
                        return;
                      } else {
                        handleCrawlNews();
                      }
                    }}
                    twoToneColor={item.content ? "#00A94E" : "#A6A6A6"}
                    className={styles.reportIcon}
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );

  function handleCrawlNews() {
    setIsCrawlingData(true);
    mutate(
      { id: item._id },
      {
        onSuccess: () => {
          setIsCrawlingData(false);
        },
        onError: () => {
          setIsCrawlingData(false);
        },
      },
    );
  }
};
