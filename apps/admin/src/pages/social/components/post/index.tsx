import { List } from "antd";
import React from "react";

import { SocialFilter } from "../social-filter";
import styles from "./index.module.less";
import { PostItem } from "./post-item";

interface PostProps {
  data: any[];
  pageSize: number;
}

export const Post: React.FC<PostProps> = ({ data, pageSize }) => {
  return (
    <div className={styles.mainContainer}>
      <SocialFilter />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) => {
          return <PostItem item={item} />;
        }}
      />
    </div>
  );
};
