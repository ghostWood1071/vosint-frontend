import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import "@aiacademy/editor/style.css";
import { CloseOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";

import styles from "./table-news.module.less";

interface Props {
  item: any;
  type?: string;
}

export const NewsTableTTXVN: React.FC<Props> = ({ item }) => {
  const [typeShow, setTypeShow] = useState<boolean>(true);
  const Ref = useRef<any>();

  return (
    <>
      {typeShow ? (
        <tr ref={Ref} className={styles.header}>
          <td className={styles.sourceNameContainer}></td>
          <td
            className={styles.titleHeaderContainer}
            onClick={() => {
              setTypeShow(!typeShow);
              Ref?.current?.scrollIntoView();
            }}
          >
            <div className={styles.contentHeader}>
              {item?.Title}. <span className={styles.detailContentHeader}>{item?.content}</span>
            </div>
          </td>
          <td className={styles.col4}>
            <div className={styles.allNumberHeader}>
              <div className={styles.time}>
                {item.PublishDate ? convertTimeToShowInUI(item.PublishDate) : ""}
              </div>
            </div>
          </td>
        </tr>
      ) : (
        <tr ref={Ref}>
          <td colSpan={4}>
            <div className={styles.content}>
              <div
                onClick={() => {
                  Ref?.current?.scrollIntoView();
                }}
                className={styles.scrollContainer}
              >
                <button className={styles.hideDetailButton} onClick={() => setTypeShow(!typeShow)}>
                  <CloseOutlined title="Đóng chi tiết tin" className={styles.closeIcon} />
                </button>
              </div>
              <div className={styles.detailContainer}>
                <div className={styles.detailHeader}>
                  <div className={styles.title}>{item?.Title}</div>
                  <div className={styles.container1}>
                    <div className={styles.time}>
                      {item.PublishDate ? convertTimeToShowInUI(item.PublishDate) : ""}
                    </div>
                  </div>
                  <div className={styles.container2}></div>
                  <div className={styles.comtainer3}>{item?.content}</div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
