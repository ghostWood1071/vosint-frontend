import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { StarOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import React, { useRef, useState } from "react";

import styles from "./ttxvn-news-item.module.less";

interface Props {
  item: any;
}

export const TTXVNNewsItem: React.FC<Props> = ({ item }) => {
  const [typeShow, setTypeShow] = useState<boolean>(true);
  const Ref = useRef<any>();

  return (
    <div className={styles.mainContainer} key={item._id}>
      <div className={styles.newsLine}>
        <div ref={Ref} className={styles.header} onClick={(event) => event.stopPropagation()}>
          <div className={styles.time}>{convertTimeToShowInUI(item.date)}</div>
          <div className={styles.contentHeaderContainer}>
            <div className={styles.contentHeader}>{item.title}</div>
          </div>
          <div className={styles.allButtonContainer}>
            <Space>
              <Tooltip arrowPointAtCenter={true} title="Lấy chi tiết tin" placement="topRight">
                <StarOutlined
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  className={styles.reportIcon}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};
