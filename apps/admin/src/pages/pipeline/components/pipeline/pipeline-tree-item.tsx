import { ActionFallbackIcon } from "@/assets/svg";
import { CloseOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import classNames from "classnames";
import { HTMLAttributes, forwardRef } from "react";

import styles from "./pipeline-tree-item.module.less";
import { PIPELINE_ACTION_ICON } from "./pipeline.constants";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  name: string;
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  readme?: string;
  display_name?: string;
  is_ctrl_flow?: boolean;
  isOpenOptions?: boolean;
  isError?: boolean;
  wrapperRef?(node: HTMLLIElement): void;
  onCollapse?(): void;
  onOpenOptions?(): void;
  onRemove?(): void;
}

export const PipelineTreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      collapsed,
      style,
      readme,
      display_name,
      name,
      isOpenOptions,
      is_ctrl_flow,
      isError,
      onCollapse,
      onRemove,
      onOpenOptions,
      wrapperRef,
    },
    ref,
  ) => {
    return (
      <li
        className={classNames({
          [styles.wrapper]: true,
          [styles.indicator]: true,
          [styles.clone]: clone,
          [styles.ghost]: ghost,
          [styles.collapsed]: collapsed,
          [styles.disableSelection]: disableSelection,
          [styles.disableInteraction]: disableInteraction,
          [styles.isOpenedOptions]: isOpenOptions,
          [styles.isError]: isError,
        })}
        ref={wrapperRef}
        style={
          {
            "--spacing": `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
      >
        <Row className={styles.treeItem} ref={ref} style={style} align="middle" wrap={false}>
          <Col flex="0 0 40px" className={styles.icon}>
            <div tabIndex={0} className={styles.grab} {...handleProps}>
              {PIPELINE_ACTION_ICON[name] ?? <ActionFallbackIcon />}
            </div>
          </Col>
          {onCollapse && (
            <Col flex="0 0 40px" className={styles.collapsed} onClick={onCollapse}>
              {collapsed ? <RightOutlined /> : <DownOutlined />}
            </Col>
          )}
          <Col
            className={classNames({
              [styles.text]: true,
              [styles.options]: !clone && !is_ctrl_flow && onOpenOptions,
            })}
            flex="1 1 auto"
            title={readme}
            onClick={!clone && onOpenOptions ? onOpenOptions : undefined}
          >
            {display_name}
          </Col>
          {!clone && onRemove && (
            <Col flex="0 0 40px" className={styles.collapsed}>
              <CloseOutlined onClick={onRemove} />
            </Col>
          )}
          {clone && childCount && childCount > 1 && (
            <span className={styles.Count}>{childCount}</span>
          )}
        </Row>
      </li>
    );
  },
);
