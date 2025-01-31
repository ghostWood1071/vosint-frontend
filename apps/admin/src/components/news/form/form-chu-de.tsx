import { TNews } from "@/models/news.type";
import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Switch, Table, TableColumnsType, Tooltip, Typography } from "antd";
import produce from "immer";
import { Dispatch, SetStateAction, useState } from "react";

import { useNewsSamplesTopicState } from "../news-state";
import { rulesRequiredItemKeyword, rulesTitle } from "./form-rules";
import "./form.less";
import styles from "./form.module.less";

type IKeyword = Record<
  string,
  {
    required_keyword: string[];
    exclusion_keyword: string;
  }
>;
interface Props {
  title: string;
  keyword: IKeyword;
  setKeyword: Dispatch<SetStateAction<IKeyword>>;
}

export function NewsletterFormChuDe({ title, keyword, setKeyword }: Props): JSX.Element {
  const form = Form.useFormInstance();
  const [formNewsSample] = Form.useForm<any>();

  const is_sample = Form.useWatch("is_sample", form);
  const [conditionValue, setConditionValue] = useState("keyword_vi");
  const [requiredKeywordInput, setRequiredKeywordInput] = useState<string>("");
  const [exclusionKeywordInput, setExclusionKeywordInput] = useState<string>(
    keyword?.["keyword_vi"].exclusion_keyword,
  );
  const requiredKeyword = keyword?.[conditionValue]?.required_keyword ?? [];
  const newsSamples = useNewsSamplesTopicState((state) => state.newsSamples);
  const setNewsSamples = useNewsSamplesTopicState((state) => state.setNewsSamples);
  const [isShowAddedNewsSample, setIsShowAddedNewsSample] = useState<boolean>(false);

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
            title="Xoá tin mẫu"
            onClick={() => handleDeleteNewsSampleItem(item)}
            className={styles.delete}
          />
        );
      },
    },
  ];

  return (
    <>
      <Form.Item
        labelAlign="right"
        label={<div className="topic-title">{`Tên ${title}`}</div>}
        name="title"
        rules={rulesTitle(title)}
      >
        <Input placeholder={`Nhập tên ${title}`} />
      </Form.Item>
      <Form.Item
        hidden={title === "Lĩnh vực"}
        name="is_sample"
        labelAlign="right"
        label={<div style={{ width: 120 }}>Định nghĩa tin mẫu</div>}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {is_sample && title !== "Lĩnh vực" ? (
        <>
          <Form.Item labelAlign="right" label={<div style={{ width: 120 }}>Tin mẫu</div>}>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                setIsShowAddedNewsSample(!isShowAddedNewsSample);
              }}
            >
              {isShowAddedNewsSample ? "Đóng tin mẫu" : "Thêm tin mẫu"}
            </Button>
            {isShowAddedNewsSample && (
              <Form style={{ marginTop: 10 }} form={formNewsSample} preserve={false}>
                <Form.Item
                  labelAlign="right"
                  label={<div style={{ width: 80 }}>Tên tin mẫu</div>}
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
                  labelAlign="right"
                  validateTrigger={["onChange", "onBlur"]}
                  label={<div style={{ width: 80 }}>Nội dung tin</div>}
                  name={"content"}
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập vào nội dung tin",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
                </Form.Item>

                <Form.Item
                  labelAlign="right"
                  validateTrigger={["onChange", "onBlur"]}
                  label={<div style={{ width: 90 }}>Đường dẫn</div>}
                  name={"link"}
                >
                  <Input />
                </Form.Item>
                <div className={styles.addButtonContainer}>
                  <Button
                    type="primary"
                    className={styles.addButton}
                    onClick={addOneNewsSampleItem}
                  >
                    Thêm
                  </Button>
                </div>
              </Form>
            )}

            {newsSamples.length > 0 && (
              <Table
                columns={columns}
                dataSource={newsSamples}
                rowKey="id"
                pagination={false}
                size="small"
                
              />
            )}
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item labelAlign="right" label={<div style={{ width: 120 }}>Loại ngôn ngữ</div>}>
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
            <Form.Item
              labelAlign="right"
              label={<div style={{ width: 120 }}>Từ khoá bắt buộc</div>}
              rules={rulesRequiredItemKeyword}
            >
              <div className={styles.requiredKeywordContainer}>
                <div className={styles.requiredKeywordInputBox}>
                  <Input
                    value={requiredKeywordInput}
                    placeholder="Các từ phân tách nhau bởi dấu phẩy"
                    className={styles.input}
                    onChange={(event) => {
                      setRequiredKeywordInput(event.target.value);
                    }}
                    onPressEnter={handleAddRequiredKeyword}
                  />
                  <div className={styles.inputButtonBox}>
                    <Tooltip title="Thêm từ khoá bắt buộc">
                      <Button
                        icon={<PlusOutlined className={styles.plus} />}
                        onClick={handleAddRequiredKeyword}
                      />
                    </Tooltip>
                  </div>
                </div>
                {requiredKeyword?.length > 0 ? (
                  <div className={styles.tableBox}>
                    <Table
                      columns={columnsRequiredKeyword}
                      pagination={false}
                      dataSource={requiredKeyword ?? []}
                      size={"small"}
                      rowKey={(record) => record}
                    />
                  </div>
                ) : null}
              </div>
            </Form.Item>
            <Form.Item
              labelAlign="right"
              label={<div style={{ width: 120 }}>Từ khoá loại trừ</div>}
            >
              <Input
                value={exclusionKeywordInput}
                onChange={(event) => {
                  setExclusionKeywordInput(event.target.value);
                  const newKeyword = produce(keyword, (draft) => {
                    draft[conditionValue].exclusion_keyword = event.target.value;
                  });
                  setKeyword(newKeyword);
                }}
                placeholder="Các từ phân tách nhau bởi dấu phẩy"
              />
            </Form.Item>
          </div>
        </>
      )}
    </>
  );

  function handleDeleteNewsSampleItem(value: any) {
    const result = newsSamples.filter((e: any) => e.id !== value.id);

    setNewsSamples(result);
  }

  function addOneNewsSampleItem() {
    formNewsSample
      .validateFields()
      .then((values) => {
        values.id = new Date().getTime().toString();
        const data = removeWhitespaceInStartAndEndOfString(values);
        setNewsSamples([...newsSamples, data]);
        formNewsSample.resetFields();
      })
      .catch();
  }

  function handleChangeKeyword(key: string) {
    setConditionValue(key);
    setRequiredKeywordInput("");
    setExclusionKeywordInput(keyword[key].exclusion_keyword);
  }

  function handleAddRequiredKeyword() {
    const text = requiredKeywordInput.trim();
    if (text !== "") {
      const newKeyword = produce(keyword, (draft) => {
        draft[conditionValue].required_keyword.push(requiredKeywordInput);
      });
      setKeyword(newKeyword);
      setRequiredKeywordInput("");
    }
  }

  function handleDeleteItemList(value: string) {
    const newKeyword = produce(keyword, (draft) => {
      const index = draft[conditionValue].required_keyword.indexOf(value);
      if (index > -1) {
        draft[conditionValue].required_keyword.splice(index, 1);
      }
    });
    setKeyword(newKeyword);
  }
}
