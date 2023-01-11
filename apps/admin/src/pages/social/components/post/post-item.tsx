import { UserIcon } from "@/assets/svg";
import { Col, Row } from "antd";
import React from "react";
import styles from "./post-item.module.less";

interface PostItemProps {
  title: string;
  summary: string;
  goodPost: boolean;
  postDate: string;
  numberOfComment: number;
  numberOfLike: number;
  numberOfShare: number;
  clonedDate: string;
}

export const PostItem: React.FC<PostItemProps> = ({
  title,
  summary,
  goodPost,
  postDate,
  numberOfComment,
  numberOfLike,
  numberOfShare,
  clonedDate,
}) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.iconUserContainer}>
        <UserIcon className={styles.iconUser} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.summary}>{summary}</div>
        <div className={styles.bottom}>
          <Row>
            <Col span={2}>
              <div className={styles.type}>
                {goodPost ? (
                  <img className={styles.typePostIcon} src="/good-post-icon.png" alt="good" />
                ) : (
                  <img className={styles.typePostIcon} src="/bad-post-icon.png" alt="bad" />
                )}
              </div>
            </Col>
            <Col span={5}>
              <div className={styles.type}>
                <div className={styles.titleItemBottom}>Ngày đăng:</div>
                <div className={styles.numberItemBottom}>
                  {(new Date(postDate).getDate() < 10
                    ? "0" + new Date(postDate).getDate()
                    : new Date(postDate).getDate()) +
                    "-" +
                    (new Date(postDate).getMonth() < 10
                      ? "0" + (new Date(postDate).getMonth() + 1)
                      : new Date(postDate).getMonth() + 1) +
                    "-" +
                    new Date(postDate).getFullYear()}
                </div>
              </div>
            </Col>
            <Col span={3}>
              <div className={styles.type}>
                <div className={styles.titleItemBottom}>Bình luận:</div>
                <div className={styles.numberItemBottom}>{numberOfComment}</div>
              </div>
            </Col>
            <Col span={3}>
              <div className={styles.type}>
                <div className={styles.titleItemBottom}>Like:</div>
                <div className={styles.numberItemBottom}>{numberOfLike}</div>
              </div>
            </Col>
            <Col span={3}>
              <div className={styles.type}>
                <div className={styles.titleItemBottom}>Share:</div>
                <div className={styles.numberItemBottom}>{numberOfShare}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.type}>
                <div className={styles.titleItemBottom}>Ngày thu thập:</div>
                <div className={styles.numberItemBottom}>
                  {(new Date(clonedDate).getDate() < 10
                    ? "0" + new Date(clonedDate).getDate()
                    : new Date(clonedDate).getDate()) +
                    "-" +
                    (new Date(clonedDate).getMonth() < 10
                      ? "0" + (new Date(clonedDate).getMonth() + 1)
                      : new Date(clonedDate).getMonth() + 1) +
                    "-" +
                    new Date(clonedDate).getFullYear()}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
