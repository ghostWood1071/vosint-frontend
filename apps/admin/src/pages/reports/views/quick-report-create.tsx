import {
  rulesRequiredItemKeyword,
  rulesRequiredListKeyword,
} from "@/components/news/form/form-rules";
import { LOCAL_USER_PROFILE } from "@/constants/config";
import { getReportQuickUrl } from "@/pages/router";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography, message } from "antd";
import produce from "immer";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";

import {
  IQuickHeading,
  QuickHeading,
  QuickHeadingProvider,
  QuickHeadings,
  useQuickHeadingContext,
  useQuickHeadingDispatchContext,
} from "../components/quick-heading";
import { CACHE_KEYS, useCreateReport } from "../report.loader";
import styles from "./quick-report.module.less";

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

export function QuickReport(): JSX.Element {
  const [userProfile] = useLocalStorage<Record<string, string>>(LOCAL_USER_PROFILE);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [headings, setHeadings] = useState<IQuickHeading[]>([]);
  const [form] = Form.useForm();
  const [title, setTitle] = useState("Báo cáo nhanh");
  const [isOpen, setIsOpen] = useState(true);

  const { mutate } = useCreateReport({
    onSuccess: (data) => {
      navigate(getReportQuickUrl(data));
      message.success("Tạo báo cáo thành công");
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
    },
  });

  // HeadingTOC
  const { mode, selectedIndex, currentHeading } = useQuickHeadingContext();
  const { setMode, setSelectedIndex, setCurrentHeading } = useQuickHeadingDispatchContext();

  useEffect(() => {
    if (mode === "delete") {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xoá tiêu đề này?",
        content: "Tất cả các sự kiện bên trong tiêu đề này sẽ bị xóa",
        okText: "Xóa",
        cancelText: "Hủy",
        onOk: handleOK,
        onCancel: () => {
          setMode(null);
          setSelectedIndex(null);
          setCurrentHeading(null);
        },
      });
      return;
    }

    if (mode === "update") {
      const selectedHeading = headings[selectedIndex!];
      form.setFieldsValue(selectedHeading);
    }

    if (mode === "create") {
      form.resetFields();
      form.setFieldValue("level", currentHeading ?? 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className={styles.root}>
      <Row>
        <Col span={isOpen ? 5 : 1} className={styles.outline}>
          <div className={styles.affix}>
            {isOpen ? (
              <Button
                shape="circle"
                title="Đóng outline"
                icon={<ArrowLeftOutlined />}
                onClick={toggleOutline}
              />
            ) : (
              <Button
                shape="circle"
                title="Mở outline"
                icon={<UnorderedListOutlined />}
                onClick={toggleOutline}
              />
            )}

            {isOpen && <QuickHeading headingsData={headings} setHeadingsData={setHeadings} />}
          </div>
        </Col>
        <Col span={isOpen ? 16 : 22} className={styles.container}>
          <Row justify={"space-between"} align={"middle"}>
            <Col span={3}></Col>
            <Col span={16} className={styles.title}>
              <Typography.Title
                level={1}
                editable={{
                  icon: <EditOutlined />,
                  tooltip: "Chỉnh sửa tên báo cáo",
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                  onChange: (value) => setTitle(value),
                }}
              >
                {title}
              </Typography.Title>
            </Col>
            <Col span={3}>
              <Space>
                <Button
                  className={styles.save}
                  icon={<SaveOutlined />}
                  type="primary"
                  title="Lưu báo cáo"
                  onClick={handleSave}
                />
              </Space>
            </Col>
          </Row>

          <QuickHeadings headingsData={headings} />
        </Col>
        <Col span={isOpen ? 2 : 1}></Col>
      </Row>

      <Modal
        open={mode !== null && mode !== "delete"}
        title={
          mode === "create"
            ? "Thêm tiêu đề bên dưới"
            : mode === "update"
            ? "Chỉnh sửa tiêu đề"
            : "Xóa tiêu đề"
        }
        onCancel={() => {
          setMode(null);
          setSelectedIndex(null);
          setCurrentHeading(null);
        }}
        getContainer={"#modal-mount"}
        closable={false}
        onOk={handleOK}
        width={900}
      >
        <Form form={form} {...formItemLayoutWithOutLabel}>
          <Form.Item
            label="Tên tiêu đề"
            name="title"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên tiêu đề",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Level" name="level">
            <Select
              options={[
                { label: "Tiêu đề mức 1", value: 1 },
                { label: "Tiêu đề mức 2", value: 2 },
                { label: "Tiêu đề mức 3", value: 3 },
                { label: "Tiêu đề mức 4", value: 4 },
              ]}
            />
          </Form.Item>
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
        </Form>
      </Modal>
    </div>
  );

  function toggleOutline() {
    setIsOpen(!isOpen);
  }

  function handleSave() {
    mutate({ title, headings });
  }

  // Handle CRUD heading toc
  function handleOK() {
    form.validateFields().then((values) => {
      const updatedHeadings = produce(headings, (draft) => {
        if (mode === "create") {
          const temp = {
            id: nanoid(),
            title: values.title,
            level: values.level,
            exclusion_keyword: values.exclusion_keyword,
            required_keyword: values.required_keyword,
            username: userProfile?.username ?? "",
            eventIds: [],
          };
          if (selectedIndex !== null) {
            draft.splice(selectedIndex + 1, 0, temp);
            return;
          }

          draft.push(temp);
        }

        if (mode === "update") {
          draft[selectedIndex!].title = values.title;
          draft[selectedIndex!].level = values.level;
          draft[selectedIndex!].required_keyword = values.required_keyword;
          draft[selectedIndex!].exclusion_keyword = values.exclusion_keyword;
          draft[selectedIndex!].username = userProfile?.username ?? "";
        }

        if (mode === "delete") {
          draft.splice(selectedIndex!, 1);
        }
      });

      setHeadings(updatedHeadings);
      message.success(`Đã ${mode === "delete" ? "xoá" : "lưu"} tiêu đề`);

      // Reset form
      setMode(null);
      setSelectedIndex(null);
    });
  }
}

export function QuickReportCreate(): JSX.Element {
  return (
    <QuickHeadingProvider>
      <QuickReport />
    </QuickHeadingProvider>
  );
}
