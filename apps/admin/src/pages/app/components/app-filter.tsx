import { Tree } from "@/components";
import { ETreeTag } from "@/components/tree/tree.store";
import { useNewsIdToNewsletter, useNewsSidebar } from "@/pages/news/news.loader";
import { useNewsStore } from "@/pages/news/news.store";
import { buildTree } from "@/pages/news/news.utils";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  MenuOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Modal, Row, Select, Space, Tooltip } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import shallow from "zustand/shallow";

import { useSidebar } from "../app.store";
import styles from "./app-filter.module.less";

const { Search } = Input;

export function AppFilter(): JSX.Element {
  const pinned = useSidebar((state) => state.pinned);
  const setPinned = useSidebar((state) => state.setPinned);
  const { t } = useTranslation("translation", { keyPrefix: "app" });
  const [show, setShow] = useNewsStore((state) => [state.show, state.setShow], shallow);
  const { data, isLoading } = useNewsSidebar();
  const { newsIds, setNewsIds } = useNewsStore(
    (state) => ({ newsIds: state.newsIds, setNewsIds: state.setNewsIds }),
    shallow,
  );
  const [newsletterId, setNewsletterId] = useState("");

  function handlePin() {
    setPinned(!pinned);
  }
  const { mutate, isLoading: isLoadingMutate } = useNewsIdToNewsletter();

  const gioTinTree = data?.gio_tin && buildTree(data.gio_tin);

  return (
    <>
      <Row className={styles.filter}>
        <Col span={4}>
          <Tooltip title={!pinned ? t("open sidebar") : t("close sidebar")} placement="bottomLeft">
            <div className={styles.containerIcon}>
              <MenuOutlined className={classNames(styles.menuIcon, styles.icon)} />
              {!pinned && (
                <DoubleRightOutlined
                  className={classNames(styles.doubleIcon, styles.icon)}
                  onClick={handlePin}
                />
              )}
              {pinned && (
                <DoubleLeftOutlined
                  className={classNames(styles.doubleIcon, styles.icon)}
                  onClick={handlePin}
                />
              )}
            </div>
          </Tooltip>
        </Col>
        <Col span={20}>
          <Space>
            <DatePicker.RangePicker />
            <Select placeholder="Dịch" />
            <Select placeholder="Điểm tin" />
            <Button>Tóm tắt đa tin (1)</Button>
            <Search placeholder="Từ khoá" />
            <Select placeholder="Kiểu danh sách" />
            <Button
              icon={<PlusCircleTwoTone />}
              onClick={handleAddBasket}
              disabled={newsIds.length === 0}
            >
              Thêm tin
            </Button>
            <Button type="primary">Xuất file dữ liệu</Button>
          </Space>
        </Col>
      </Row>

      {/* TODO: Need move to module news */}
      <Modal
        title={"Thêm tin vào giỏ tin"}
        open={show}
        onOk={handleOK}
        onCancel={handleCancel}
        getContainer="#modal-mount"
        okText="Thêm"
        okButtonProps={{ disabled: !newsletterId }}
        confirmLoading={isLoadingMutate}
        destroyOnClose
      >
        <Tree
          isSpinning={isLoading}
          title={"Giỏ tin"}
          treeData={gioTinTree}
          onSelect={handleSelect}
          tag={ETreeTag.GIO_TIN}
        />
      </Modal>
    </>
  );

  function handleCancel() {
    setShow(false);
  }

  function handleAddBasket() {
    setShow(true);
  }

  function handleOK() {
    mutate(
      {
        newsIds,
        newsletterId,
      },
      {
        onSuccess: () => {
          setShow(false);
          setNewsIds([]);
        },
      },
    );
  }

  function handleSelect(selectedKeys: any[]) {
    setNewsletterId(selectedKeys[0]);
  }
}
