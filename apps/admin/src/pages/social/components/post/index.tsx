import { Input, List } from "antd";
import React, { useRef } from "react";

import styles from "./index.module.less";
import { PostItem } from "./post-item";

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
          return <PostItem item={item} />;
        }}
      />
    </div>
  );
};
