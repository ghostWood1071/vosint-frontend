import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContents";
import LexicalTableOfContentsPlugin from "@lexical/react/LexicalTableOfContents";
import { HeadingTagType } from "@lexical/rich-text";
import cn from "classnames";
import { NodeKey } from "lexical";
import { useEffect, useRef, useState } from "react";

import styles from "./index.module.less";

export const navigationItemLevel: Record<HeadingTagType, string> = {
  h1: styles.navigationItemLevel1,
  h2: styles.navigationItemLevel2,
  h3: styles.navigationItemLevel3,
  h4: styles.navigationItemLevel4,
  h5: styles.navigationItemLevel5,
  h6: styles.navigationItemLevel6,
};

function TableOfContentsList({
  tableOfContents,
}: {
  tableOfContents: Array<TableOfContentsEntry>;
}) {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const selectedIndex = useRef(0);
  const [editor] = useLexicalComposerContext();

  function scrollToNode(key: NodeKey, currentIndex: number) {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(key);
      if (domElement === null) return;

      // domElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      const domElementPosition = domElement.getBoundingClientRect().top;
      const offset = domElementPosition + window.pageYOffset - 60;
      const scrollArea = document.getElementById("container");
      if (scrollArea === null) return;
      scrollArea.scrollTo({ top: offset, behavior: "smooth" });
      setSelectedKey(key);
      selectedIndex.current = currentIndex;
    });
  }

  useEffect(() => {
    function scrollCallback() {
      if (tableOfContents.length !== 0 && selectedIndex.current < tableOfContents.length - 1) {
        let currentHeading = editor.getElementByKey(tableOfContents[selectedIndex.current][0]);

        if (currentHeading !== null) {
        }
      } else {
        selectedIndex.current = 0;
      }
    }
    let timerId: ReturnType<typeof setTimeout>;

    function debounceFunction(func: () => void, delay: number) {
      clearTimeout(timerId);
      timerId = setTimeout(func, delay);
    }

    function onScroll(): void {
      debounceFunction(scrollCallback, 10);
    }

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [tableOfContents, editor]);

  return (
    <div className={cn(styles.tableOfContents, "scrollbar table-of-contents")}>
      <div className={styles.header}>Outline</div>
      <div className={styles.navigationItemList} tabIndex={0}>
        {tableOfContents.map(([key, text, tag], index) => {
          return (
            <div
              key={key}
              className={cn({
                [styles.navigationItem]: true,
                [styles.locationIndicatorHighlight]: selectedKey === key,
              })}
              onClick={() => scrollToNode(key, index)}
              role="menuitem"
            >
              <div className={cn(styles.navigationItemContent, navigationItemLevel[tag])}>
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TableOfContentsPlugin(): JSX.Element {
  return (
    <LexicalTableOfContentsPlugin>
      {(tableOfContents) => {
        return <TableOfContentsList tableOfContents={tableOfContents} />;
      }}
    </LexicalTableOfContentsPlugin>
  );
}
