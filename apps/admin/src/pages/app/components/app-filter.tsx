import { Tree } from "@/components";
import { useNewsSidebar } from "@/pages/news/news.loader";
import { useNewsStore } from "@/pages/news/news.store";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  MenuOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Modal, Row, Select, Space, Tooltip, message } from "antd";
import classNames from "classnames";
import { Key } from "react";
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

  function handlePin() {
    setPinned(!pinned);
  }

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
            <Button icon={<PlusCircleTwoTone />} onClick={handleAddBasket}>
              Thêm tin
            </Button>
            <Button type="primary">Xuất file dữ liệu</Button>
          </Space>
        </Col>
      </Row>

      {/* TODO: Need move to module news */}
      <Modal
        title={"Thêm tin"}
        open={show}
        onOk={handleOK}
        onCancel={handleCancel}
        getContainer="#modal-mount"
        okText="Thêm"
      >
        <Tree
          key="Giỏ tin"
          isSpinning={isLoading}
          title={"Giỏ tin"}
          treeData={data?.[0]?.data ?? []}
          onSelect={handleSelect}
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
    message.success("Đã thêm vào giỏ tin");
    setShow(false);
  }

  function handleSelect(selectedKeys: Key[]) {
    console.debug({ selectedKeys });
  }
}
