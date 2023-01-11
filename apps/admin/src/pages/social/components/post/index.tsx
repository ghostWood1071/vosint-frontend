import React from "react";
import { Input, List } from "antd";
import { PostItem } from "./post-item";
import styles from "./index.module.less";

interface PostProps {
  data: any[];
  pageSize: number;
}

export const Post: React.FC<PostProps> = ({ data, pageSize }) => {
  return (
    <div className={styles.mainContainer}>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: pageSize,
          size: "default",
          position: "bottom",
        }}
        dataSource={data}
        renderItem={(item) => {
          return (
            <PostItem
              title={item.title}
              summary={item.summary}
              goodPost={item.goodPost}
              postDate={item.postDate}
              numberOfComment={item.numberOfComment}
              numberOfLike={item.numberOfLike}
              numberOfShare={item.numberOfShare}
              clonedDate={item.clonedDate}
            />
          );
        }}
      />
    </div>
  );
};
