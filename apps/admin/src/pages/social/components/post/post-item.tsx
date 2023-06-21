import { UserIcon } from "@/assets/svg";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { CloseOutlined, CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React, { useRef, useState } from "react";

import styles from "./post-item.module.less";

interface PostItemProps {
  item: any;
}

export const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const [typeShow, setTypeShow] = useState<boolean>(true);
  const [seen, setSeen] = useState<boolean>(false);
  const Ref = useRef<any>();
  return (
    <div ref={Ref} className={styles.mainContainer} id={item.id}>
      {typeShow ? (
        <div
          className={styles.header}
          onClick={(event) => {
            event.stopPropagation();
          }}
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
          <div className={styles.typePostContainer}>
            {item.goodPost ? (
              <img className={styles.typePostIcon} src="/good-post-icon.png" alt="good" />
            ) : (
              <img className={styles.typePostIcon} src="/bad-post-icon.png" alt="bad" />
            )}
          </div>
          <div
            onClick={() => {
              setTypeShow(!typeShow);
              Ref?.current?.scrollIntoView();
              setSeen(true);
            }}
            className={seen ? styles.seenContentHeaderContainer : styles.contentHeaderContainer}
          >
            <div className={styles.nameHeader}>{item.header}</div>
            <span style={{ width: 5 }}></span>
            <div className={styles.contentHeader}>{item.content ?? ""}</div>
          </div>
          <div className={styles.allNumberHeader}>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                <span className={styles.numberLike}>{item.like ?? 0}</span>
                <LikeOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                <span className={styles.numberLike}>{item.comments ?? 0}</span>
                <CommentOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                <span className={styles.numberLike}>{item.share ?? 0}</span>
                <ShareAltOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTagTime : styles.tagTime}>
                {convertTimeToShowInUI(item.created_at)}
              </Tag>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div
            onClick={(event) => {
              event.stopPropagation();
              Ref?.current?.scrollIntoView();
            }}
            className={styles.scrollContainer}
          >
            <button className={styles.hideDetailButton} onClick={() => setTypeShow(!typeShow)}>
              <CloseOutlined title="Đóng chi tiết" className={styles.closeIcon} />
            </button>
          </div>
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div className={styles.leftDetailHeader}>
                <UserIcon className={styles.avatar} />
              </div>
              <div className={styles.rightDetailHeader}>
                <div className={styles.name}>{item.header}</div>
                <div className={styles.time}>
                  <Tag className={styles.tag}>{convertTimeToShowInUI(item.created_at)}</Tag>
                </div>
                <div className={styles.allNumberContainer}>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.like ?? 0}
                      <LikeOutlined className={styles.likeIcon} />
                    </Tag>
                  </div>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.comments ?? 0}
                      <CommentOutlined className={styles.likeIcon} />
                    </Tag>
                  </div>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.share ?? 0}
                      <ShareAltOutlined className={styles.likeIcon} />
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.detailBody}>
              {item.image_url ? (
                <img src={item?.image_url} className={styles.image} alt={item?.image_url} />
              ) : null}
              <label className={styles.textContent}>{item.content ?? ""}</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
