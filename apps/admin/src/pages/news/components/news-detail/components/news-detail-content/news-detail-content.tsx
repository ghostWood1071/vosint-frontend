import React from "react";

import styles from "./news-detail-content.module.less";

interface Props {
  content?: string;
}
export const NewsDetailContent: React.FC<Props> = ({ content }) => {
  return (
    <div>
      <div className={styles.content_body}>{content}</div>
    </div>
  );
};
