import { ETreeAction, ETreeTag, useTreeStore } from "@/components/tree/tree.store";
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  List,
  Modal,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import produce from "immer";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import shallow from "zustand/shallow";

import { useNewsList, useNewsletterDetail } from "../news.loader";
import { useNewsStore } from "../news.store";
import styles from "./news-form.module.less";

const formItemLayoutWithOutLabel = {
  labelCol: { span: 6 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 1 },
  },
};
const formItemLayoutWithOutLabel2 = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 7 },
  },
};

interface Props {
  onFinish: (values: Record<string, any>) => void;
  confirmLoading?: boolean;
}

export const NewsForm: React.FC<Props> = ({ onFinish, confirmLoading }) => {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const [form] = Form.useForm<Record<string, any>>();
  const [tag, action, initialValues] = useTreeStore(
    (state) => [state.tag, state.action, state.data],
    shallow,
  );

  const [checked, setChecked] = useState(false);
  const setValues = useTreeStore((state) => state.setValues);
  const [showAddNews, setShowAddNews] = useState(false);
  const [news, setNews] = useNewsStore((state) => [state.newsIds, state.setNewsIds], shallow);

  const { data } = useNewsletterDetail(initialValues?._id, {});

  useEffect(() => {
    if (data?.news_samples?.length > 0) {
      setChecked(true);
      setNews(data?.news_samples);
    }
  }, [data, initialValues?._id]);

  if (action === ETreeAction.SELECT) {
    return null;
  }

  return (
    <>
      <Modal
        title={t(action!) + t(tag!)}
        open={action !== null}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        getContainer="#modal-mount"
        width="45%"
      >
        {tag === ETreeTag.GIO_TIN && (
          <Form form={form} initialValues={initialValues ?? {}} preserve={false}>
            <Form.Item name="title">
              <Input placeholder="Nhập tên giỏ tin" disabled={action === ETreeAction.DELETE} />
            </Form.Item>
          </Form>
        )}

        {(tag === ETreeTag.CHU_DE || tag === ETreeTag.LINH_VUC) && (
          <Form
            form={form}
            initialValues={initialValues ?? {}}
            {...formItemLayoutWithOutLabel}
            preserve={false}
          >
            <Form.Item
              label="Tên danh mục"
              name={"title"}
              validateTrigger={["onChange", "onBlur"]}
              rules={[{ required: true, message: "Hãy nhập vào tên danh mục!", whitespace: true }]}
            >
              <Input placeholder="Nhập tên danh mục" disabled={action === ETreeAction.DELETE} />
            </Form.Item>
            <Form.Item label="Định nghĩa theo tin mẫu">
              <Checkbox checked={checked} onChange={handleChecked} />
            </Form.Item>
            {checked ? (
              <Form.Item label="Tin mẫu">
                <Button type="primary" onClick={() => setShowAddNews(true)}>
                  Thêm tin mẫu
                </Button>

                <List
                  dataSource={news}
                  renderItem={(item) => {
                    return (
                      <List.Item actions={[<CloseCircleOutlined onClick={handleDelete} />]}>
                        <Typography.Link
                          target="_blank"
                          href={item?.["data:url"] ?? item?.["data_url"]}
                          rel="noreferrer"
                        >
                          {item?.["data:title"] ?? item?.["data_title"]}
                        </Typography.Link>
                      </List.Item>
                    );

                    function handleDelete() {
                      const deletedNews = produce(news, (draft) => {
                        const index = draft.findIndex((i) => i._id === item._id);
                        if (index !== -1) draft.splice(index, 1);
                      });
                      setNews(deletedNews);
                    }
                  }}
                />
              </Form.Item>
            ) : (
              <>
                <Form.List
                  name="required_keyword"
                  rules={[
                    {
                      validator: async (_, required_keyword) => {
                        if (!required_keyword || required_keyword.length < 0) {
                          return Promise.reject(new Error("At least 2 passengers"));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          {...(index === 0 ? "" : formItemLayoutWithOutLabel2)}
                          label={index === 0 ? "Từ khoá bắt buộc" : ""}
                          required={false}
                          key={field.key}
                        >
                          <Form.Item
                            {...field}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Nhập vào từ khoá.",
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="Các từ phân tách nhau bởi dấu phẩy"
                              disabled={action === ETreeAction.DELETE}
                              style={{ width: "80%" }}
                            />
                          </Form.Item>

                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              className={styles.deleteButton}
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item
                        {...(fields.length < 1 ? "" : formItemLayoutWithOutLabel2)}
                        label={fields.length < 1 ? "Từ khoá bắt buộc" : ""}
                      >
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: "80%" }}
                          icon={<PlusOutlined />}
                          disabled={action === ETreeAction.DELETE}
                        >
                          Thêm từ khoá bắt buộc
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item label="Từ khoá loại trừ" name={"exclusion_keyword"}>
                  <Input
                    placeholder="Các từ phân tách nhau bởi dấu phẩy"
                    disabled={action === ETreeAction.DELETE}
                  />
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
      <ModalAddNews open={showAddNews} setOpen={setShowAddNews} />
    </>
  );

  function handleChecked(e: CheckboxChangeEvent) {
    setChecked(e.target.checked);
  }

  function handleOk() {
    const values = form.getFieldsValue();

    if (checked) {
      values.required_keyword = null;
      values.exclusion_keyword = null;
      values.news_samples = news.map((i) => i._id);
    } else {
      values.news_samples = [];
    }

    onFinish({
      ...initialValues,
      ...values,
      tag,
      action,
    });
    reset();
  }

  function handleCancel() {
    reset();
    setValues({
      tag: null,
      action: null,
      data: null,
    });
  }

  function reset() {
    setNews([]);
    setChecked(false);
    form.resetFields();
  }
};

interface ModalAddNewsProps {
  open: boolean;
  setOpen: any;
}

const ModalAddNews: React.FC<ModalAddNewsProps> = ({ open, setOpen }) => {
  const [paginate, setPaginate] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [news, setNews] = useNewsStore((state) => [state.newsIds, state.setNewsIds], shallow);

  const { data, isLoading } = useNewsList(
    {
      skip: paginate.pageNumber,
      limit: paginate.pageSize,
    },
    true,
  );

  const columns: TableColumnsType<any> = [
    {
      key: "data:title",
      dataIndex: "data:title",
      render: (_, record) => (
        <Typography.Link target="_blank" href={record?.["data:url"]} rel="noreferrer">
          {record?.["data:title"]}
        </Typography.Link>
      ),
    },
    {
      key: "data:time",
      dataIndex: "data:time",
    },
  ];

  const rowSelection = {
    onChange: (_: any, selectedRows: any[]) => {
      setNews(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.title,
    }),
    selectedRowKeys: news.map((i: any) => i?._id),
    preserveSelectedRowKeys: true,
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Thêm tin mẫu"
      style={{ top: 20 }}
      width="75%"
      getContainer="#modal-mount"
      footer={null}
      zIndex={1001}
      destroyOnClose
    >
      <Input.Search placeholder="Từ khoá" style={{ marginBottom: 8 }} />

      <Table
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: paginate.pageNumber,
          pageSize: paginate.pageSize,
          onChange: handlePaginate,
        }}
        columns={columns}
        dataSource={data?.result}
        rowSelection={rowSelection}
        loading={isLoading}
      />
    </Modal>
  );

  function handlePaginate(page: number, pageSize: number) {
    setPaginate({
      pageSize: pageSize,
      pageNumber: page,
    });
  }

  function handleCancel() {
    setOpen(false);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
  }
};
