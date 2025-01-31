import { TNews } from "@/models/news.type";
import { CACHE_KEYS, useNewsList } from "@/pages/news/news.loader";
import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  List,
  Modal,
  Switch,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import produce from "immer";
import { compact, unionBy } from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { NewsType, useNewsSamplesState, useNewsState } from "../news-state";
import { rulesRequiredItemKeyword, rulesRequiredListKeyword, rulesTitle } from "./form-rules";
import styles from "./form.module.less";

const formItemLayoutWithOutLabel2 = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 7 },
  },
};
interface Props {
  title: string;
}

export function NewsletterFormLinhVuc({ title }: Props): JSX.Element {
  const form = Form.useFormInstance();
  const is_sample = Form.useWatch("is_sample", form);

  return (
    <>
      <Form.Item label={`Tên ${title}`} name="title" rules={rulesTitle(title)}>
        <Input placeholder={`Nhập tên ${title}`} />
      </Form.Item>
      <Form.Item
        hidden={title === "Lĩnh vực"}
        name="is_sample"
        label="Định nghĩa tin mẫu"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {is_sample && title !== "Lĩnh vực" ? (
        <ListNewsSampleLinhVuc />
      ) : (
        <>
          <Form.List name="required_keyword" rules={rulesRequiredListKeyword}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required
                    key={field.key}
                    {...(index === 0 ? "" : formItemLayoutWithOutLabel2)}
                    label={index === 0 ? "Từ khoá bắt buộc:" : ""}
                  >
                    <Form.Item {...field} rules={rulesRequiredItemKeyword} noStyle>
                      <Input
                        placeholder="Các từ phân tách nhau bởi dấu phẩy"
                        className={styles.formItem}
                      />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <Button
                        icon={<DeleteOutlined className={styles.deleteButton} />}
                        onClick={() => remove(field.name)}
                        type="text"
                        title="Xoá từ khoá bắt buộc"
                        danger
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item
                  {...(fields.length < 1 ? "" : formItemLayoutWithOutLabel2)}
                  label={fields.length < 1 ? "Từ khoá bắt buộc:" : ""}
                  required
                >
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className={styles.formItem}
                  >
                    Thêm từ khoá bắt buộc
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item label="Từ khoá loại trừ" name={"exclusion_keyword"}>
            <Input placeholder="Các từ phân tách nhau bởi dấu phẩy" />
          </Form.Item>
        </>
      )}
    </>
  );
}

export function ListNewsSampleLinhVuc(): JSX.Element {
  const newsSelectId = useNewsState((state) => state.newsSelectId);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<NewsType["data"]>([
    CACHE_KEYS.NewsletterDetail,
    newsSelectId,
  ]);

  const newsSamples = useNewsSamplesState((state) => state.newsSamples);
  const setNewsSamples = useNewsSamplesState((state) => state.setNewsSamples);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNewsSamples(data?.news_samples ?? []);
  }, [data]);

  return (
    <>
      <Form.Item label="Tin mẫu">
        <Button type="primary" onClick={handleOpen}>
          Thêm tin mẫu
        </Button>

        <List
          dataSource={newsSamples}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    danger
                    type="text"
                    key="delete"
                    title="Xoá tin mẫu"
                  />,
                ]}
              >
                <Typography.Link target="_blank" href={item?.["data:url"]} rel="noreferrer">
                  {item?.["data:title"]}
                </Typography.Link>
              </List.Item>
            );

            function handleDelete() {
              const deletedNews = produce(newsSamples, (draft) => {
                const index = draft.findIndex((i) => i._id === item._id);
                if (index !== -1) draft.splice(index, 1);
              });
              setNewsSamples(deletedNews);
            }
          }}
        />
      </Form.Item>

      <ModalAddNewsSamples open={open} setOpen={setOpen} selected={newsSamples} onOk={handleOk} />
    </>
  );

  function handleOpen() {
    setOpen(true);
  }

  function handleOk(selected: TNews[]) {
    setNewsSamples(selected);
  }
}

interface ModalAddNewsSamplesProps {
  open: boolean;
  selected: TNews[];
  onOk: (selected: TNews[]) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalAddNewsSamples({
  open,
  selected,
  setOpen,
  onOk,
}: ModalAddNewsSamplesProps): JSX.Element {
  const [newsSamples, setNewsSamples] = useState<TNews[]>(selected);
  const [title, setTitle] = useState("");
  const [paginate, setPaginate] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const { data, isLoading } = useNewsList({
    skip: paginate.pageNumber,
    limit: paginate.pageSize,
    title: title,
  });

  useEffect(() => {
    setNewsSamples(selected);
  }, [selected]);

  const rowSelection = {
    onChange: (_: any, selectedRows: TNews[]) => {
      setNewsSamples(compact(selectedRows));
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.title,
    }),
    selectedRowKeys: newsSamples.map((i: any) => i?._id),
    preserveSelectedRowKeys: true,
  };

  const columns: TableColumnsType<TNews> = [
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

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="Thêm tin mẫu"
      style={{ top: 20 }}
      width="75%"
      getContainer="#modal-mount"
      zIndex={1001}
      destroyOnClose
      closable={false}
      maskClosable={false}
    >
      <Input.Search placeholder="Từ khoá" style={{ marginBottom: 8 }} onSearch={handleSearch} />

      <Table
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: paginate.pageNumber,
          pageSize: paginate.pageSize,
          showSizeChanger: true,
          onChange: handlePaginate,
        }}
        columns={columns}
        dataSource={data?.result}
        rowSelection={rowSelection}
        loading={isLoading}
        size="small"
      />
    </Modal>
  );

  function handleSearch(value: string) {
    setTitle(value);
  }

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
    setTitle("");
  }

  function handleOk() {
    setOpen(false);
    onOk(newsSamples);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
    setTitle("");
  }
}
