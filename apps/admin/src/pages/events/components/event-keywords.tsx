import { getKeywords } from "@/common/Functions";
import { Tag } from "antd";

import styles from "./event-item.module.less";

const EventKeyword = ({ item }: { item: any }) => {
  const keywords = item.new_list.length > 0 && getKeywords(item);

  return (
    <>
      {keywords.length > 0
        ? keywords.map((item: any, index: any) => {
            return (
              <Tag key={index} className={styles.tag}>
                {item}
              </Tag>
            );
          })
        : null}
    </>
  );
};

export default EventKeyword;
