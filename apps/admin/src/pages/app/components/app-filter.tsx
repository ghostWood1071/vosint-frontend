import { Tree } from "@/components";
import { ETreeTag } from "@/components/tree/tree.store";
import {
  useDeleteNewsInNewsletter,
  useNewsIdToNewsletter,
  useNewsSidebar,
} from "@/pages/news/news.loader";
import { useNewsStore } from "@/pages/news/news.store";
import { buildTree } from "@/pages/news/news.utils";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Modal, Row, Select, Space, Tooltip } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
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
  let { newsletterId: detailIds } = useParams();

  function handlePin() {
    setPinned(!pinned);
  }
  const { mutate, isLoading: isLoadingMutate } = useNewsIdToNewsletter();

  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();

  const gioTinTree =
    data?.gio_tin &&
    buildTree([
      {
        _id: ETreeTag.QUAN_TRONG,
        title: "Tin Quan Trọng",
        tag: ETreeTag.QUAN_TRONG,
      },
      {
        _id: ETreeTag.DANH_DAU,
        title: "Tin đánh dấu",
        tag: ETreeTag.DANH_DAU,
      },
      {
        _id: ETreeTag.GIO_TIN,
        title: "Giỏ tin",
        tag: ETreeTag.GIO_TIN,
      },
      ...data.gio_tin.map((i: any) => ({ ...i, parent_id: i?.parent_id ?? ETreeTag.GIO_TIN })),
    ]);

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
          <Space wrap>
            <DatePicker.RangePicker />
            <Select placeholder="Dịch" defaultValue="nuoc-ngoai">
              <Select.Option key="nuoc-ngoai">Dịch tiếng nước ngoài</Select.Option>
              <Select.Option key="nguon">Hiển thị ngôn ngữ nguồn</Select.Option>
            </Select>
            <Select placeholder="Điểm tin" />
            <Button disabled={newsIds.length === 0}>Tóm tắt đa tin ({newsIds.length})</Button>
            <Search placeholder="Từ khoá" />
            <Select placeholder="Kiểu danh sách" />
            <Button
              icon={<PlusCircleTwoTone />}
              onClick={handleAddBasket}
              disabled={newsIds.length === 0}
            >
              Thêm tin
            </Button>

            {detailIds && (
              <Button
                icon={<MinusCircleTwoTone twoToneColor="#ff4d4f" />}
                danger
                disabled={newsIds.length === 0}
                onClick={handleRemoveNewsIds}
              >
                Xoá tin
              </Button>
            )}

            <Button type="primary">Xuất file dữ liệu</Button>
          </Space>
        </Col>
      </Row>

      <Modal
        title={"Thêm tin vào giỏ tin"}
        open={show}
        onOk={handleOK}
        onCancel={handleCancel}
        getContainer="#modal-mount"
        okText="Thêm"
        okButtonProps={{ disabled: !newsletterId || newsletterId === ETreeTag.GIO_TIN }}
        confirmLoading={isLoadingMutate}
        destroyOnClose
      >
        <Tree
          isSpinning={isLoading}
          title={""}
          treeData={gioTinTree}
          onSelect={handleSelect}
          tag={ETreeTag.GIO_TIN}
        />
      </Modal>
    </>
  );

  function handleCancel() {
    setShow(false);
    setNewsletterId("");
  }

  function handleAddBasket() {
    setShow(true);
  }

  function handleRemoveNewsIds() {
    Modal.confirm({
      title: "Bạn có muốn xoá những bản tin này?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return mutateDelete({
          newsId: newsIds,
          newsletterId: detailIds!,
        });
      },
      onCancel() {},
    });
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
