import { CACHE_KEYS } from "@/pages/news/news.loader";
import { TNews } from "@/services/news.type";
import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { NewsType, useNewsSamplesTopicState, useNewsState } from "../news-state";
import { rulesRequiredItemKeyword, rulesTitle } from "./form-rules";
import styles from "./form.module.less";

interface Props {
  title: string;
  keyword: any;
  setKeyword: (value: any) => void;
}

export function NewsletterFormChuDe({ title, keyword, setKeyword }: Props): JSX.Element {
  const form = Form.useFormInstance();
  const is_sample = Form.useWatch("is_sample", form);
  const [conditionValue, setConditionValue] = useState("keyword_vi");
  const [requiredKeywordInput, setRequiredKeywordInput] = useState<string>("");
  const [exclusionKeywordInput, setExclusionKeywordInput] = useState<string>(
    keyword["keyword_vi"].exclusion_keyword,
  );
  const [requiredKeywordData, setRequiredKeywordData] = useState<any[]>(
    keyword["keyword_vi"].required_keyword,
  );

  const columnsRequiredKeyword: TableColumnsType<any> = [
    {
      key: "name",
      title: "Từ khoá",
      render: (value) => <div>{value}</div>,
    },
    {
      key: "button",
      title: "",
      width: 50,
      align: "center",
      render: (item) => {
        return (
          <DeleteOutlined
            title="Xoá từ khoá"
            onClick={() => handleDeleteItemList(item)}
            className={styles.delete}
          />
        );
      },
    },
  ];
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
        <ListNewsSampleChuDe />
      ) : (
        <>
          <Form.Item label="Loại ngôn ngữ">
            <div className={styles.allItemCondition}>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "keyword_vi"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    handleChangeKeyword("keyword_vi");
                  }}
                >
                  Tiếng Việt
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "keyword_en"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    handleChangeKeyword("keyword_en");
                  }}
                >
                  Tiếng Anh
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "keyword_cn"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    handleChangeKeyword("keyword_cn");
                  }}
                >
                  Tiếng Trung
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "keyword_ru"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    handleChangeKeyword("keyword_ru");
                  }}
                >
                  Tiếng Nga
                </div>
              </div>
            </div>
          </Form.Item>
          <div className={styles.detailOptionItemContainer}>
            <Form.Item rules={rulesRequiredItemKeyword} label="Từ khoá bắt buộc">
              <div className={styles.requiredKeywordContainer}>
                <div className={styles.requiredKeywordInputBox}>
                  <Input
                    value={requiredKeywordInput}
                    placeholder="Các từ phân tách nhau bởi dấu phẩy"
                    className={styles.input}
                    onChange={(event) => {
                      setRequiredKeywordInput(event.target.value);
                    }}
                  />
                  <div className={styles.inputButtonBox}>
                    <Button
                      icon={<PlusOutlined className={styles.plus} />}
                      onClick={handleAddRequiredKeyword}
                    />
                  </div>
                </div>
                {requiredKeywordData?.length > 0 ? (
                  <div className={styles.tableBox}>
                    <Table
                      columns={columnsRequiredKeyword}
                      pagination={false}
                      dataSource={requiredKeywordData ?? []}
                      size={"small"}
                    />
                  </div>
                ) : null}
              </div>
            </Form.Item>
            <Form.Item label="Từ khoá loại trừ">
              <Input
                value={exclusionKeywordInput}
                onChange={(event) => {
                  setExclusionKeywordInput(event.target.value);
                  setKeyword({
                    ...keyword,
                    [conditionValue]: {
                      required_keyword: requiredKeywordData,
                      exclusion_keyword: event.target.value,
                    },
                  });
                }}
                placeholder="Các từ phân tách nhau bởi dấu phẩy"
              />
            </Form.Item>
          </div>
        </>
      )}
    </>
  );

  function handleChangeKeyword(key: string) {
    setConditionValue(key);
    setRequiredKeywordData(keyword[key].required_keyword);
    setRequiredKeywordInput("");
    setExclusionKeywordInput(keyword[key].exclusion_keyword);
  }

  function handleAddRequiredKeyword() {
    setRequiredKeywordData([...requiredKeywordData, requiredKeywordInput]);
    setKeyword({
      ...keyword,
      [conditionValue]: {
        required_keyword: [...requiredKeywordData, requiredKeywordInput],
        exclusion_keyword: exclusionKeywordInput,
      },
    });
    setRequiredKeywordInput("");
  }

  function handleDeleteItemList(value: string) {
    const result = requiredKeywordData.filter((e: any) => e !== value);
    setRequiredKeywordData(result);
    setKeyword({
      ...keyword,
      [conditionValue]: {
        required_keyword: result,
        exclusion_keyword: exclusionKeywordInput,
      },
    });
  }
}

export function ListNewsSampleChuDe(): JSX.Element {
  const newsSelectId = useNewsState((state) => state.newsSelectId);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<NewsType["data"]>([
    CACHE_KEYS.NewsletterDetail,
    newsSelectId,
  ]);

  const newsSamples = useNewsSamplesTopicState((state) => state.newsSamples);
  const setNewsSamples = useNewsSamplesTopicState((state) => state.setNewsSamples);
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
                {item?.["title"]}
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

  function handleOk(selected: any[]) {
    setNewsSamples(selected);
  }
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

interface ModalAddNewsSamplesProps {
  open: boolean;
  selected: any[];
  onOk: (selected: any[]) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalAddNewsSamples({
  open,
  selected,
  setOpen,
  onOk,
}: ModalAddNewsSamplesProps): JSX.Element {
  const [newsSamples, setNewsSamples] = useState<any[]>(selected);

  const [form] = Form.useForm<Record<string, any>>();

  const columns: TableColumnsType<TNews> = [
    {
      key: "title",
      dataIndex: "title",
      title: "Tên tin mẫu",
    },
    {
      key: "content",
      title: "Nội dung tin",
      dataIndex: "content",
    },
    {
      key: "link",
      title: "Đường dẫn",
      dataIndex: "link",
      render: (value) => (
        <Typography.Link target="_blank" href={value} rel="noreferrer">
          {value}
        </Typography.Link>
      ),
    },
    {
      key: "button",
      title: "",
      width: 50,
      align: "center",
      render: (item) => {
        return (
          <DeleteOutlined
            title="Xoá từ khoá"
            onClick={() => handleDeleteItemList(item)}
            className={styles.delete}
          />
        );
      },
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
      <Form form={form} {...formItemLayoutWithOutLabel} preserve={false}>
        <Form.Item
          label={"Tên tin mẫu"}
          name={"title"}
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào tên tin mẫu!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Nội dung tin"
          name={"content"}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào nội dung tin",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Đường dẫn" name={"link"}>
          <Input />
        </Form.Item>
        <div className={styles.addButtonContainer}>
          <Button type="primary" className={styles.addButton} onClick={addOneEvent}>
            Thêm
          </Button>
        </div>
        {newsSamples.length > 0 && (
          <Table
            columns={columns}
            dataSource={newsSamples}
            rowKey="_id"
            pagination={false}
            size="small"
          />
        )}
      </Form>
    </Modal>
  );

  function addOneEvent() {
    form
      .validateFields()
      .then((values) => {
        values.id = new Date().getTime().toString();
        const data = removeWhitespaceInStartAndEndOfString(values);
        setNewsSamples([...newsSamples, data]);
        form.resetFields();
      })
      .catch();
  }

  function handleCancel() {
    setOpen(false);
  }

  function handleOk() {
    setOpen(false);
    onOk(newsSamples);
  }

  function handleDeleteItemList(value: any) {
    const result = newsSamples.filter((e: any) => e._id !== value._id);

    setNewsSamples(result);
  }
}
