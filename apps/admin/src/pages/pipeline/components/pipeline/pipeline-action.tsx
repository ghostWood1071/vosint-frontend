import { ActionFallbackIcon } from "@/assets/svg";
import { IActionInfos } from "@/services/pipeline.types";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Col, Row } from "antd";
import { CSSProperties } from "react";

import styles from "./pipeline-action.module.less";
import { PIPELINE_ACTION_ICON } from "./pipeline.constants";

interface Props extends Pick<IActionInfos, "display_name" | "readme" | "name"> {
  id: UniqueIdentifier;
}

export function PipelineAction({ id, display_name, readme, name }: Props) {
  const { setNodeRef, transform, attributes, listeners } = useDraggable({
    id,
    data: {
      name,
    },
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div style={style} className={styles.wrapper} ref={setNodeRef}>
      <Row className={styles.treeitem} align="middle" wrap={false}>
        <Col flex="0 0 40px" className={styles.icon}>
          <div className={styles.grab} {...listeners} {...attributes}>
            {PIPELINE_ACTION_ICON[name] ?? <ActionFallbackIcon />}
          </div>
        </Col>
        <Col className={styles.text} flex="1 1 auto" title={readme}>
          {display_name}
        </Col>
      </Row>
    </div>
  );
}
