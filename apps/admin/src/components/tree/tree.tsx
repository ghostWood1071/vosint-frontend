import { ReactComponent as BagIcon } from "@/assets/svg/bag.svg";
import { ReactComponent as CartIcon } from "@/assets/svg/cart.svg";
import { ReactComponent as CollectionIcon } from "@/assets/svg/collection.svg";
import { ReactComponent as LayerHalfIcon } from "@/assets/svg/layers-half.svg";
import { ReactComponent as SlashIcon } from "@/assets/svg/slash-square.svg";
import { ReactComponent as StackIcon } from "@/assets/svg/stack.svg";
import { PlusCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Col, Row, Tree as TreeAntd } from "antd";
import type { DataNode } from "antd/lib/tree";
import React from "react";

import { ETreeAction, ETreeTag, MTreeTag, useNewsState } from "../news/news-state";
import { TreeTitleGioTin } from "../news/tree-title/tree-title-gio-tin";
import styles from "./tree.module.less";

interface Props {
  isModal?: boolean;
  treeData: DataNode[];
  title: string;
  isSpinning?: boolean;
  selectedKeys?: React.Key[];

  isEditable?: boolean;
  tag: ETreeTag;
  reportLayout?: boolean; 

  onSelect?: (selectedKeys: React.Key[]) => void;
  onClickTitle?: (_id: string, tag: ETreeTag) => void;
}

export const Tree: React.FC<Props> = ({
  treeData,
  title,
  tag,
  isModal,
  isEditable = false,
  selectedKeys,
  reportLayout,
  onClickTitle,
}) => {

  const setNews = useNewsState((state) => state.setNews);
  const setNewsSelectId = useNewsState((state) => state.setNewsSelectId);

  return (
    <div className={styles.tree}>
      <Row className={styles.title}>
        <Col span={18} className={styles.text + " " + styles.sidebarIcon}>
          {tag === "gio_tin" && !isModal && <CartIcon className={styles.sidebarIcon} />}
          {tag === "linh_vuc" && !reportLayout && <LayerHalfIcon className={styles.sidebarIcon} />}
          {tag === "source_group" && <StackIcon className={styles.sidebarIcon} />}
          {tag === "chu_de" && <CollectionIcon className={styles.sidebarIcon} />}
          {tag === "source" && <SlashIcon className={styles.sidebarIcon} />}
          {title}
        </Col>
        {isEditable && (
          <Col span={5} className={styles.icon}>
            {/* <PlusSquareOutlined /> */}
            {/* <PlusOutlined /> */}
            <PlusSquareOutlined
              style={{ fontSize: 16, color: "#1890ff", cursor: "pointer" }}
              onClick={handleAdd}
              title={`Thêm ${MTreeTag[tag]}`}
            />
          </Col>
        )}
      </Row>
      {treeData?.length >= 1 && (
        <TreeAntd
          className={`${styles.treeAnt} tree-antd-report`}
          blockNode
          treeData={treeData}
          titleRender={(node: any) => {
            return <TreeTitleGioTin {...node} isEditable={isEditable} onClick={onClickTitle} tag={tag} />
          }}
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
        />
      )}
    </div>
  );

  function handleSelect(selectedKeys: React.Key[]) {
    if (selectedKeys[0] !== undefined) {
      setNewsSelectId(selectedKeys[0]);
    }
  }

  function handleAdd() {
    setNews({
      tag,
      action: ETreeAction.CREATE,
      data: null,
    });
  }
};
