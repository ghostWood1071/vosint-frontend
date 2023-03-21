import { Tree } from "@/components";
import { ETreeTag, useNewsSelection, useNewsState } from "@/components/news/news-state";
import {
  useDeleteNewsInNewsletter,
  useNewsIdToNewsletter,
  useNewsSidebar,
} from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import {
  DeleteOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  MenuOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import classNames from "classnames";
import produce from "immer";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { useSidebar } from "../app.store";
import styles from "./app-filter.module.less";

const { Search } = Input;

export function AppFilter(): JSX.Element {
  const pinned = useSidebar((state) => state.pinned);
  const setPinned = useSidebar((state) => state.setPinned);
  const { t } = useTranslation("translation", { keyPrefix: "app" });
  const { data, isLoading } = useNewsSidebar();
  const [newsSelectId] = useNewsState((state) => [state.newsSelectId]);
  const [openSelection, setOpenSelection] = useNewsSelection(
    (state) => [state.open, state.setOpen],
    shallow,
  );
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const newsSelectionIds: string[] = newsSelection.map((i) => i?._id);
  let { newsletterId: detailIds, tag } = useParams();

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
            <Select placeholder="Điểm tin" defaultValue="sac-thai-tin">
              <Select.Option key="sac-thai-tin">Sắc thái tin</Select.Option>
              <Select.Option key="tich-cuc">Tích cực</Select.Option>
              <Select.Option key="tieu-cuc">Tiêu cực</Select.Option>
              <Select.Option key="trung-tinh">Trung tính</Select.Option>
            </Select>
            <Button disabled={newsSelectionIds.length === 0}>
              Tóm tắt tin ({newsSelectionIds.length})
            </Button>
            <Search placeholder="Từ khoá" />
            {/* <Select placeholder="Kiểu danh sách" /> */}
            <Button
              icon={<PlusCircleTwoTone />}
              onClick={handleAddBasket}
              disabled={newsSelectionIds.length === 0}
            >
              Thêm tin
            </Button>

            {detailIds &&
              ![ETreeTag.LINH_VUC, ETreeTag.CHU_DE].includes((tag ?? "") as ETreeTag) && (
                <Button
                  icon={<MinusCircleTwoTone twoToneColor="#ff4d4f" />}
                  danger
                  disabled={newsSelectionIds.length === 0}
                  onClick={handleRemoveNewsIds}
                >
                  Xoá tin
                </Button>
              )}

            <Button type="primary" icon={<ExportOutlined />} title="Xuất file dữ liệu" />
          </Space>
        </Col>
      </Row>

      <Modal
        title={"Thêm tin vào giỏ tin"}
        open={openSelection}
        onOk={handleOK}
        onCancel={handleCancel}
        getContainer="#modal-mount"
        okText="Thêm"
        okButtonProps={{ disabled: !newsSelectId || newsSelectId === ETreeTag.GIO_TIN }}
        confirmLoading={isLoadingMutate}
        destroyOnClose
      >
        <Tree
          isSpinning={isLoading}
          title={""}
          treeData={gioTinTree}
          tag={ETreeTag.GIO_TIN}
          selectedKeys={[newsSelectId!]}
        />
        <br />
        <Typography.Text>Danh sách tin:</Typography.Text>
        <List
          dataSource={newsSelection}
          renderItem={(item) => {
            return (
              <List.Item actions={[<DeleteOutlined onClick={handleDelete} />]}>
                <Typography.Link target="_blank" href={item?.["data:url"]} rel="noreferrer">
                  {item?.["data:title"]}
                </Typography.Link>
              </List.Item>
            );

            function handleDelete() {
              const deletedNews = produce(newsSelection, (draft) => {
                const index = draft.findIndex((i) => i._id === item._id);
                if (index !== -1) draft.splice(index, 1);
              });
              setNewsSelection(deletedNews);
            }
          }}
        />
      </Modal>
    </>
  );

  function handleCancel() {
    setOpenSelection(false);
  }

  function handleAddBasket() {
    setOpenSelection(true);
  }

  function handleRemoveNewsIds() {
    Modal.confirm({
      title: "Bạn có muốn xoá những bản tin này?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return mutateDelete({
          newsId: newsSelectionIds,
          newsletterId: detailIds!,
        });
      },
      onCancel() {},
    });
  }

  function handleOK() {
    mutate(
      {
        newsIds: newsSelectionIds,
        newsletterId: newsSelectId! + "",
      },
      {
        onSuccess: () => {
          setOpenSelection(false);
          setNewsSelection([]);
        },
      },
    );
  }
}
