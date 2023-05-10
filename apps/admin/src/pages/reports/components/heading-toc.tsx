import cn from "classnames";
import { useRef, useState } from "react";

import styles from "./heading-toc.module.less";
import { HeadingsData } from "./headings";

interface Props {
  headingsData: HeadingsData[];
}

export const navigationItemLevel: Record<number, string> = {
  1: styles.navigationItemLevel1,
  2: styles.navigationItemLevel2,
  3: styles.navigationItemLevel3,
  4: styles.navigationItemLevel4,
  5: styles.navigationItemLevel5,
};

export function HeadingToc({ headingsData }: Props): JSX.Element {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectedIndex = useRef(0);

  function scrollToNode(id: string, currentIndex: number) {
    window.location.hash = id;
    setSelectedKey(id);
    selectedIndex.current = currentIndex;
  }

  return (
    <div className={cn(styles.tableOfContents, "scrollbar table-of-contents")}>
      <div className={styles.header}>Outline</div>
      <div className={styles.navigationItemList} tabIndex={0}>
        {headingsData.map(({ id, level, title }, index) => {
          return (
            <div
              key={id}
              className={cn({
                [styles.navigationItem]: true,
                [styles.locationIndicatorHighlight]: selectedKey === id,
              })}
              role="navigation"
              onClick={() => scrollToNode(id, index)}
            >
              <div className={cn(styles.navigationItemContent, navigationItemLevel[level])}>
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
