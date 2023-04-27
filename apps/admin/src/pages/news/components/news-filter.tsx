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
  ExclamationCircleOutlined,
  ExportOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, List, Modal, Select, Space, Typography } from "antd";
import produce from "immer";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { useNewsFilter, useNewsFilterDispatch } from "../news.context";

export function NewsFilter(): JSX.Element {
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const newsSelectionIds: string[] = newsSelection.map((i) => i?._id);
  let { newsletterId: detailIds, tag } = useParams();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();

  const [openSelection, setOpenSelection] = useNewsSelection(
    (state) => [state.open, state.setOpen],
    shallow,
  );

  const newsFilter = useNewsFilter();
  const setNewsFilter = useNewsFilterDispatch();

  return (
    <>
      <Form onValuesChange={handleFinish}>
        <Space wrap>
          <Form.Item noStyle name="datetime">
            <DatePicker.RangePicker format={"DD/MM/YYYY"} />
          </Form.Item>
          {/* <Form.Item noStyle> */}
          <Select placeholder="Dịch" defaultValue="nuoc-ngoai">
            <Select.Option key="nuoc-ngoai">Dịch tiếng nước ngoài</Select.Option>
            <Select.Option key="nguon">Hiển thị ngôn ngữ nguồn</Select.Option>
          </Select>
          {/* </Form.Item> */}
          <Form.Item noStyle name="language_source">
            <Select
              placeholder="Ngôn ngữ"
              mode="multiple"
              showArrow
              allowClear
              style={{ minWidth: 100 }}
            >
              <Select.Option key="en">Tiếng Anh</Select.Option>
              <Select.Option key="vi">Tiếng Việt</Select.Option>
              <Select.Option key="cn">Tiếng Trung</Select.Option>
              <Select.Option key="ru">Tiếng Nga</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle name="sac_thai">
            <Select placeholder="Điểm tin" defaultValue="all">
              <Select.Option key="all">Sắc thái tin</Select.Option>
              <Select.Option key="1">Tích cực</Select.Option>
              <Select.Option key="-1">Tiêu cực</Select.Option>
              <Select.Option key="0">Trung tính</Select.Option>
            </Select>
          </Form.Item>
          {/* <Form.Item noStyle name="title"> */}
          <Input placeholder="Từ khoá" />
          {/* </Form.Item> */}
          <Button disabled={newsSelectionIds.length === 0}>
            Tóm tắt tin ({newsSelectionIds.length})
          </Button>
          <Button
            icon={<PlusCircleTwoTone />}
            onClick={handleAddBasket}
            disabled={newsSelectionIds.length === 0}
            title="Thêm tin"
          />
          {detailIds && ![ETreeTag.LINH_VUC, ETreeTag.CHU_DE].includes((tag ?? "") as ETreeTag) && (
            <Button
              icon={<MinusCircleTwoTone twoToneColor="#ff4d4f" />}
              danger
              disabled={newsSelectionIds.length === 0}
              onClick={handleRemoveNewsIds}
              title="Xoá tin"
            />
          )}
          <Button type="primary" icon={<ExportOutlined />} title="Xuất file dữ liệu" disabled />
        </Space>
      </Form>

      {openSelection && <NewsFilterModal />}
    </>
  );

  function handleFinish(values: Record<string, any>) {
    if ("datetime" in values) {
      values.start_date = values.datetime?.[0].format("DD/MM/YYYY");
      values.end_date = values.datetime?.[1].format("DD/MM/YYYY");
      delete values.datetime;
    }
    if ("language_source" in values) {
      values.language_source = values?.language_source?.join(",");
    }
    setNewsFilter({ ...newsFilter, ...values });
  }

  function handleAddBasket() {
    setOpenSelection(true);
  }

  function handleRemoveNewsIds() {
    Modal.confirm({
      title: "Bạn có muốn xoá những bản tin này?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setNewsSelection([]);
        return mutateDelete({
          newsId: newsSelectionIds,
          newsletterId: detailIds!,
        });
      },
      onCancel() {},
    });
  }
}

function NewsFilterModal(): JSX.Element {
  const [openSelection, setOpenSelection] = useNewsSelection(
    (state) => [state.open, state.setOpen],
    shallow,
  );
  const { data, isLoading } = useNewsSidebar();
  const [newsSelectId] = useNewsState((state) => [state.newsSelectId]);

  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const newsSelectionIds: string[] = newsSelection.map((i) => i?._id);

  const { mutate, isLoading: isLoadingMutate } = useNewsIdToNewsletter();

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
            <List.Item
              actions={[<DeleteOutlined style={{ color: "#ff1207" }} onClick={handleDelete} />]}
            >
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
  );

  function handleCancel() {
    setOpenSelection(false);
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
