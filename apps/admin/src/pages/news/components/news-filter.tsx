import { ReactComponent as UnreadIcon } from "@/assets/svg/envelope-open.svg";
import { ReactComponent as ReadIcon } from "@/assets/svg/envelope.svg";
import { Tree } from "@/components";
import { ETreeTag, useNewsSelection, useNewsState } from "@/components/news/news-state";
import { useSidebar } from "@/pages/app/app.store";
import { useGetMe } from "@/pages/auth/auth.loader";
import {
  useDeleteNewsInNewsletter,
  useMutationChangeStatusSeenPost,
  useMutationExportNews,
  useNewsIdToNewsletter,
  useNewsSidebar,
} from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileWordOutlined,
  MailOutlined,
  MailTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, List, Modal, Select, Typography } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { useNewsFilter, useNewsFilterDispatch } from "../news.context";
import styles from "./news-filter.module.less";
import { NewsSummaryModal } from "./news-summary-modal";

export function NewsFilter(): JSX.Element {
  const { data: dataIAm } = useGetMe();
  let { newsletterId: detailIds, tag } = useParams();

  const pinned = useSidebar((state) => state.pinned);
  const { mutate: mutateChangeStatusSeenPost } = useMutationChangeStatusSeenPost();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const newsSelectionIds: string[] = newsSelection.map((i) => i?._id);
  const [openSelection, setOpenSelection] = useNewsSelection(
    (state) => [state.open, state.setOpen],
    shallow,
  );
  const newsFilter = useNewsFilter();
  const setNewsFilter = useNewsFilterDispatch();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();

  const [internalTextSearch, setInternalTextSearch] = useState("");
  const { mutate } = useMutationExportNews();

  function handleSetSeen(checkedSeen: boolean, idNews: string) {
    if (checkedSeen) {
      mutateChangeStatusSeenPost({ action: "set-seen", newsId: idNews });
    } else {
      mutateChangeStatusSeenPost({ action: "set-unseen", newsId: idNews });
    }
  }

  const handleExportWord = () => {
    const newArr = newsSelection.map((news) => news._id);
    mutate(
      { data: newArr },
      {
        onSuccess: (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;

          // get date dd/MM/yyyy
          const today = new Date();
          const yyyy = today.getFullYear();
          let mm: any = today.getMonth() + 1; // Months start at 0!
          let dd: any = today.getDate();

          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;

          const formattedToday = dd + "/" + mm + "/" + yyyy;
          link.setAttribute("download", `tin_tuc(${formattedToday}).docx`);
          document.body.appendChild(link);
          link.click();
        },
      },
    );
  };

  const seen = newsSelection.find((item: any) => item.list_user_read?.length > 0);
  const unseen = newsSelection.find(
    (item: any) => item.list_user_read?.length == 0 || !("list_user_read" in item),
  );

  return (
    <div className={pinned ? styles.filterWithSidebar : styles.filter}>
      <Form
        onValuesChange={handleFinish}
        initialValues={{
          sac_thai: "",
        }}
        style={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        {/* {seen && unseen && ( */}
        <>
          <div
            className={styles.iconWrap}
            onClick={() => {
              newsSelection.forEach((item) => {
                handleSetSeen(true, item._id);
              });
              // setNewsSelection([]);
              setNewsSelection(
                newsSelection.map((item) => ({ ...item, list_user_read: [dataIAm] })),
              );
            }}
            title="Đánh dấu đã đọc tin"
          >
            <Button
              icon={<UnreadIcon className={styles.unreadIcon} />}
              className={styles.iconWrapBtn}
              disabled={!(!seen && unseen) && !(seen && unseen)}
            />
          </div>

          <div
            className={styles.iconWrap + " " + styles.iconWrapLast}
            onClick={() => {
              newsSelection.forEach((item) => {
                handleSetSeen(false, item._id);
              });
              setNewsSelection(newsSelection.map((item) => ({ ...item, list_user_read: [] })));
            }}
            title="Đánh dấu chưa đọc tin"
          >
            <Button
              icon={<ReadIcon className={styles.readIcon} />}
              disabled={!(seen && !unseen) && !(seen && unseen)}
              className={styles.iconWrapBtn}
            />
          </div>
        </>
        {/* )} */}
        {/* 
        {seen && !unseen && (
          <div
            className={styles.iconWrap}
            onClick={() => {
              newsSelection.forEach((item) => {
                handleSetSeen(false, item._id);
              });

              setNewsSelection(newsSelection.map((item) => ({ ...item, list_user_read: [] })));
            }}
            title="Đánh dấu chưa đọc tin"
          >
            <ReadIcon className={styles.readIcon} />
          </div>
        )}

        {!seen && unseen && (
          <div
            className={styles.iconWrap}
            onClick={() => {
              // setNewsSelection(newsSelection.map((item) => ({ ...item, is_read: true })));

              newsSelection.forEach((item) => {
                handleSetSeen(true, item._id);
              });

              setNewsSelection(
                newsSelection.map((item) => ({ ...item, list_user_read: [dataIAm] })),
              );
            }}
            title="Đánh dấu đã đọc tin"
          >
            <UnreadIcon className={styles.unreadIcon} />
          </div>
        )} */}
        <Button
          className={styles.item}
          icon={<FileWordOutlined />}
          onClick={handleExportWord}
          title="Thêm tin"
        />

        <Form.Item className={styles.item} name="datetime">
          <DatePicker.RangePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        <Form.Item className={styles.item} name={"type_translate"}>
          <Select placeholder="Dịch" defaultValue="nguon">
            <Select.Option key="nuoc-ngoai">Dịch tiếng nước ngoài</Select.Option>
            <Select.Option key="nguon">Hiển thị ngôn ngữ nguồn</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={styles.item} name="language_source">
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
        <Form.Item className={styles.item} name="sac_thai">
          <Select placeholder="Điểm tin">
            <Select.Option key="">Sắc thái tin</Select.Option>
            <Select.Option key="1">Tích cực</Select.Option>
            <Select.Option key="2">Tiêu cực</Select.Option>
            <Select.Option key="0">Trung tính</Select.Option>
          </Select>
        </Form.Item>
        <NewsSummaryModal />
        <Button
          className={styles.item}
          icon={<PlusCircleTwoTone />}
          onClick={handleAddBasket}
          disabled={newsSelectionIds.length === 0}
          title="Thêm tin"
        />
        {detailIds && ![ETreeTag.LINH_VUC, ETreeTag.CHU_DE].includes((tag ?? "") as ETreeTag) && (
          <Button
            className={styles.item}
            icon={<MinusCircleTwoTone twoToneColor="#ff4d4f" />}
            danger
            disabled={newsSelectionIds.length === 0}
            onClick={handleRemoveNewsIds}
            title="Xoá tin"
          />
        )}
        <div className={styles.input}>
          <Input.Search
            className={styles.search}
            placeholder="Tìm kiếm"
            onSearch={handleSearch}
            value={internalTextSearch}
            onChange={(e) => setInternalTextSearch(e.target.value)}
          />
        </div>
      </Form>

      {openSelection && <NewsFilterModal />}
    </div>
  );

  function handleFinish(values: Record<string, any>) {
    if ("datetime" in values) {
      values.start_date = values.datetime?.[0].format("DD/MM/YYYY");
      values.end_date = values.datetime?.[1].format("DD/MM/YYYY");
      delete values.datetime;
    }
    if ("sac_thai" in values && values.sac_thai === "all") {
      values.sac_thai = "";
    }
    if ("language_source" in values) {
      values.language_source = values?.language_source?.join(",");
    }
    setNewsFilter({ ...newsFilter, ...values, text_search: internalTextSearch.trim() });
  }

  function handleSearch(value: string) {
    setNewsFilter({ ...newsFilter, text_search: value.trim() });
  }

  function handleAddBasket() {
    setOpenSelection(true);
  }

  function handleRemoveNewsIds() {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá những bản tin này không?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk() {
        setNewsSelection([]);
        return mutateDelete({
          newsId: newsSelectionIds,
          newsletterId: detailIds!,
        });
      },
    });
  }

  function handleNewsSummary() {}
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
      // {
      //   _id: ETreeTag.QUAN_TRONG,
      //   title: "Tin Quan Trọng",
      //   tag: ETreeTag.QUAN_TRONG,
      // },
      // {
      //   _id: ETreeTag.DANH_DAU,
      //   title: "Tin đánh dấu",
      //   tag: ETreeTag.DANH_DAU,
      // },
      // {
      //   _id: ETreeTag.GIO_TIN,
      //   title: "Giỏ tin",
      //   tag: ETreeTag.GIO_TIN,
      // },
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
        isModal={true}
      />
      <br />
      <Typography.Text>Danh sách tin:</Typography.Text>
      <List
        dataSource={newsSelection}
        renderItem={(item) => {
          return (
            <List.Item
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  title="Xoá tin khỏi danh sách tin"
                  onClick={handleDelete}
                  danger
                  type="text"
                />,
              ]}
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
