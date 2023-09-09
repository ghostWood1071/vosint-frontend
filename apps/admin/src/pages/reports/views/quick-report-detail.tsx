import { OutlineFileWordIcon } from "@/assets/icons";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { downloadFile } from "@/components/editor/utils";
import { useConvertHeadingsToDocx } from "@/components/editor/utils/docx";
import {
  rulesRequiredItemKeyword,
  rulesRequiredListKeyword,
} from "@/components/news/form/form-rules";
import { LOCAL_USER_PROFILE } from "@/constants/config";
import { reportPath } from "@/pages/router";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
  message,
} from "antd";
import { Packer } from "docx";
import produce from "immer";
import moment from "moment";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { shallow } from "zustand/shallow";

import { IQuickHeading, QuickHeading, QuickHeadings } from "../components/quick-heading";
import {
  QuickHeadingProvider,
  useQuickHeadingContext,
  useQuickHeadingDispatchContext,
} from "../components/quick-heading/quick-heading.context";
import {
  CACHE_KEYS,
  useDeleteReport,
  useQuickReport,
  useUpdateReport,
  useUpdateReportAndEvent,
} from "../report.loader";
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
function QuickReport(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("Tên báo cáo");
  const [headings, setHeadings] = useState<IQuickHeading[]>([]);
  const [userProfile] = useLocalStorage<Record<string, string>>(LOCAL_USER_PROFILE);
  const [isNotRemove, setIsNotRemove] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuickReport(id!, {
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;

    setTitle(data.title);
    setHeadings(data.headings);
    setIsNotRemove(data.is_not_remove);
  }, [data]);

  const [form] = Form.useForm<any>();
  const isTtxvn = Form.useWatch("ttxvn", form);
  const [isOpen, setIsOpen] = useState(true);
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );

  const { mutate: deleteReport, isLoading: isDeleting } = useDeleteReport();
  const { mutate: updateReportAndEvent } = useUpdateReportAndEvent();
  const { mutate: updateReport, isLoading: isUpdating } = useUpdateReport(id!, {
    onSuccess: (_, variables) => {
      setHeadings((variables?.headings as IQuickHeading[]) ?? []);
      setTitle(variables?.title ?? "");
      queryClient.invalidateQueries(CACHE_KEYS.QUICK_REPORT);
    },
  });

  const convertHeadingsToDocx = useConvertHeadingsToDocx();
  const handleDeleteEvent = (headingId: string) => (eventId: string) => {
    const deletedEventsHeadings = produce(headings, (draft) => {
      const headingIndex = draft.findIndex((heading) => heading.id === headingId);
      if (headingIndex === -1) return;

      const index = headings[headingIndex].eventIds.findIndex((id) => id === eventId);
      if (index === -1) return;

      draft[headingIndex].eventIds.splice(index, 1);
    });
    setHeadings(deletedEventsHeadings);
  };

  // HeadingTOC
  const { mode, selectedIndex, currentHeading } = useQuickHeadingContext();
  const { setMode, setSelectedIndex, setCurrentHeading } = useQuickHeadingDispatchContext();

  useEffect(() => {
    if (mode === "delete") {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xoá tiêu đề này?",
        // content: "Tất cả các sự kiện bên trong tiêu đề này sẽ bị xóa",
        okText: "Xóa",
        cancelText: "Thoát",
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
      const selectedHeading = produce(headings[selectedIndex!], (draft) => {
        draft.required_keyword = headings[selectedIndex!]?.required_keyword ?? [];
        draft.exclusion_keyword = headings[selectedIndex!]?.exclusion_keyword ?? "";
      });

      form.setFieldsValue(selectedHeading);
    }

    if (mode === "create") {
      form.resetFields();
      form.setFieldValue("level", currentHeading || 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className={styles.root}>
      <Row>
        <Col md={isOpen ? 4 : 1} lg={isOpen ? 4 : 1} className={styles.outline}>
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
        <Col md={isOpen ? 16 : 21} span={isOpen ? 16 : 22} className={styles.container}>
          <Spin size="large" spinning={isLoading}>
            <Space className={styles.menu_action}>
              <Button
                title="Xuất file ra docx"
                icon={<OutlineFileWordIcon />}
                onClick={handleExportDocx}
              />
              <Button
                className={styles.save}
                icon={<SaveOutlined />}
                type="primary"
                title="Lưu báo cáo"
                onClick={handleSave}
              />
              {!isNotRemove && (
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  title="Xoá báo cáo"
                  onClick={handleDelete}
                  loading={isDeleting}
                  style={{border: 0}}
                />
              )}
            </Space>
            <Row justify={"space-between"} align={"middle"}>
              <Col span={4}></Col>
              <Col span={16} className={styles.title} pull={4}>
                <Typography.Title
                  level={2}
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

              <Col span={24} className={styles.center}>
                <Space>
                  <Typography.Text>Từ ngày: </Typography.Text>
                  <DatePicker.RangePicker
                    inputReadOnly
                    defaultValue={[moment().subtract(7, "days"), moment()]}
                    format={"DD/MM/YYYY"}
                    bordered={false}
                    onChange={(_, formatString) => setDateTime(formatString)}
                  />
                </Space>
              </Col>
            </Row>
            <QuickHeadings headingsData={headings} onDeleteEvent={handleDeleteEvent} />
          </Spin>
        </Col>

        <Col md={isOpen ? 4 : 2} span={isOpen ? 4 : 1} className={styles.action}></Col>
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
        confirmLoading={isUpdating}
        width={700}
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
          <Form.Item name="ttxvn" label="Lấy tin từ thông tấn xã" valuePropName="checked">
            <Switch />
          </Form.Item>
          {isTtxvn && (
            <>
              <Form.List name="required_keyword" rules={rulesRequiredListKeyword}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        key={field.key}
                        {...(index === 0 ? "" : formItemLayoutWithOutLabel2)}
                        label={index === 0 ? "Từ khoá bắt buộc:" : ""}
                      >
                        <Form.Item {...field} noStyle>
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
        </Form>
      </Modal>
    </div>
  );

  function toggleOutline() {
    setIsOpen(!isOpen);
  }

  function handleSave() {
    updateReport({ title, headings });
  }

  function handleDelete() {
    Modal.confirm({
      // title: "Xác nhận xoá báo cáo",
      title: "Bạn có chắc chắn muốn xoá báo cáo này?",
      // content: "Bạn có chắc chắn muốn xoá báo cáo này?",
      okText: "Xoá",
      cancelText: "Thoát",
      onOk: () => {
        deleteReport(id!, {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.QUICK_REPORT]);
            message.success({
              content: "Xoá báo cáo thành công",
            });
            navigate(reportPath);
          },
        });
      },
    });
  }

  async function handleExportDocx() {
    const blobData = await convertHeadingsToDocx({
      title,
      headings,
      dateTime,
    });

    Packer.toBlob(blobData).then((blob) => {
      downloadFile(blob, `${title}.docx`);
    });
  }

  // Handle CRUD heading toc
  function handleOK() {
    form.validateFields().then((values) => {
      if (mode === "delete") {
        const updatedHeadings = produce(headings, (draft) => {
          if (mode === "delete") {
            draft.splice(selectedIndex!, 1);
          }
        });
        updateReportAndEvent(
          { id_report: id, id_heading: headings[selectedIndex!]?.id },
          {
            onSuccess: () => {
              setHeadings(updatedHeadings);
              // Reset form
              message.success(`Đã xoá tiêu đề`);
              setMode(null);
              setSelectedIndex(null);
            },
          },
        );
        return;
      }

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
            ttxvn: values?.ttxvn ?? false,
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
          draft[selectedIndex!].ttxvn = values.ttxvn;
          draft[selectedIndex!].exclusion_keyword = values.exclusion_keyword;
          draft[selectedIndex!].required_keyword = values.required_keyword;
          draft[selectedIndex!].username = userProfile?.username ?? "";
        }
      });
      updateReport(
        { headings: updatedHeadings },
        {
          onSuccess: () => {
            setHeadings(updatedHeadings);
            // Reset form
            message.success(`Đã lưu tiêu đề`);
            setMode(null);
            setSelectedIndex(null);
          },
        },
      );
    });
  }
}

export function QuickReportDetail(): JSX.Element {
  return (
    <QuickHeadingProvider>
      <QuickReport />
    </QuickHeadingProvider>
  );
}
