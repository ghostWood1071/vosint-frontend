import {
  CloseOutlined,
  CommentOutlined,
  FieldTimeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Tag } from "antd";
import React, { useRef, useState } from "react";

import styles from "./post-item.module.less";

interface PostItemProps {
  item: any;
}

export const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const [typeShow, setTypeShow] = useState<boolean>(true);
  const [seen, setSeen] = useState<boolean>(false);
  // const element = document.getElementById(item.id);
  const Ref = useRef<any>();
  return (
    <div
      ref={Ref}
      onClick={() => {
        Ref?.current?.scrollIntoView();
      }}
      className={styles.mainContainer}
      id={item.id}
    >
      {typeShow ? (
        <div
          className={styles.header}
          onClick={(event) => {
            setTypeShow(!typeShow);
            setSeen(true);
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
          <div className={seen ? styles.seenContentHeaderContainer : styles.contentHeaderContainer}>
            <div className={styles.nameHeader}>{item.name_user}</div>
            <span style={{ width: 5 }}></span>
            <div className={styles.contentHeader}>{item.content}</div>
          </div>
          <div className={styles.allNumberHeader}>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                {item.numberOfLike}
                <LikeOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                {item.numberOfLike}
                <CommentOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                {item.numberOfLike}
                <ShareAltOutlined className={styles.likeIcon} />
              </Tag>
            </div>
            <div className={styles.likeHeaderContainer}>
              <Tag className={seen ? styles.seenTag : styles.tag}>
                {(new Date(item.postDate).getDate() < 10
                  ? "0" + new Date(item.postDate).getDate()
                  : new Date(item.postDate).getDate()) +
                  "-" +
                  (new Date(item.postDate).getMonth() < 10
                    ? "0" + (new Date(item.postDate).getMonth() + 1)
                    : new Date(item.postDate).getMonth() + 1) +
                  "-" +
                  new Date(item.postDate).getFullYear()}
              </Tag>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div className={styles.leftDetailHeader}>
                <Avatar className={styles.avatar} src={item.avatar} />
              </div>
              <div className={styles.rightDetailHeader}>
                <div className={styles.name}>{item.name_user}</div>
                <div className={styles.time}>
                  <Tag className={styles.tag}>
                    {(new Date(item.postDate).getDate() < 10
                      ? "0" + new Date(item.postDate).getDate()
                      : new Date(item.postDate).getDate()) +
                      "-" +
                      (new Date(item.postDate).getMonth() < 10
                        ? "0" + (new Date(item.postDate).getMonth() + 1)
                        : new Date(item.postDate).getMonth() + 1) +
                      "-" +
                      new Date(item.postDate).getFullYear()}
                  </Tag>
                </div>
                <div className={styles.allNumberContainer}>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.numberOfLike}
                      <LikeOutlined className={styles.likeIcon} />
                    </Tag>
                  </div>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.numberOfLike}
                      <CommentOutlined className={styles.likeIcon} />
                    </Tag>
                  </div>
                  <div className={styles.likeHeaderContainer}>
                    <Tag className={styles.tag}>
                      {item.numberOfLike}
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
              <label className={styles.textContent}>{item.content}</label>
            </div>
          </div>
          <button className={styles.hideDetailButton} onClick={() => setTypeShow(!typeShow)}>
            <CloseOutlined className={styles.closeIcon} />
          </button>
        </div>
      )}
    </div>
  );
};
