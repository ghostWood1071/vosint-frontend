import { OutlineFileWordIcon } from "@/assets/icons";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { downloadFile } from "@/components/editor/utils";
import { useConvertHeadingsToDocx } from "@/components/editor/utils/docx";
import { getSyntheticReportDetailUrl, reportPath } from "@/pages/router";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
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
import { shallow } from "zustand/shallow";

import { HeadingToc } from "../components/heading-toc";
import {
  HeadingTocProvider,
  useHeadingTocContext,
  useHeadingTocDispatchContext,
} from "../components/heading-toc.context";
import { Headings, HeadingsData } from "../components/headings";
import {
  CACHE_KEYS,
  useCreateReport,
  useDeleteReport,
  useReport,
  useUpdateReport,
} from "../report.loader";
import styles from "./synthesis-report.module.less";

export function SynthesisReport(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useReport(id!, {
    enabled: !!id,
    onSuccess: (data) => {
      setTitle(data.title);
      setHeadings(data?.headings ?? []);
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [headings, setHeadings] = useState<HeadingsData[]>([]);
  const [form] = Form.useForm();
  const [title, setTitle] = useState("Tên báo cáo");
  const [isOpen, setIsOpen] = useState(true);
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );

  const { mutate } = useCreateReport({
    onSuccess: (data) => {
      navigate(getSyntheticReportDetailUrl(data));
      message.success("Tạo báo cáo thành công");
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
    },
  });
  const { mutate: deleteReport, isLoading: isDeleting } = useDeleteReport();
  const { mutate: updateReport, isLoading: isUpdating } = useUpdateReport(id!, {
    onSuccess: (_, variables) => {
      setHeadings(variables?.headings ?? []);
    },
  });

  const convertHeadingsToDocx = useConvertHeadingsToDocx();
  const handleDeleteEvent = (headingId: string) => (eventId: string) => {
    const deletedEventsHeadings = produce(headings, (draft) => {
      const headingIndex = draft.findIndex((heading) => heading.id === headingId);
      if (!headingIndex) return;

      const index = headings[headingIndex].eventIds.findIndex((id) => id === eventId);
      if (index === -1) return;

      draft[headingIndex].eventIds.splice(index, 1);
    });

    updateReport({
      headings: deletedEventsHeadings,
    });
  };

  // HeadingTOC
  const { mode, selectedIndex } = useHeadingTocContext();
  const { setMode, setSelectedIndex } = useHeadingTocDispatchContext();

  useEffect(() => {
    if (mode === "delete") {
      return;
    }

    if (mode === "update") {
      const selectedHeading = headings[selectedIndex!];
      form.setFieldsValue(selectedHeading);
    }

    if (mode === "create") {
      form.resetFields();
    }
  }, [mode]);

  return (
    <div className={styles.root}>
      <Card bordered={false} loading={isLoading}>
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

              {isOpen && <HeadingToc headingsData={headings} />}
            </div>
          </Col>
          <Col span={isOpen ? 16 : 22} className={styles.container}>
            <Row justify={"space-between"} align={"middle"}>
              <Col span={4}></Col>
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
                  {data?.title}
                </Typography.Title>
              </Col>
              <Col span={4}>
                <Space>
                  <Button
                    title="Xuất file ra docx"
                    icon={<OutlineFileWordIcon />}
                    onClick={handleExportDocx}
                  />
                </Space>
              </Col>

              <Col span={24} className={styles.center}>
                <Space>
                  <Typography.Text>Từ ngày: </Typography.Text>
                  <DatePicker.RangePicker
                    defaultValue={[moment().subtract(7, "days"), moment()]}
                    format={"DD/MM/YYYY"}
                    bordered={false}
                    onChange={(_, formatString) => setDateTime(formatString)}
                  />
                </Space>
              </Col>
            </Row>

            <Headings headingsData={headings} onDeleteEvent={handleDeleteEvent} />
          </Col>
          <Col span={isOpen ? 2 : 1} className={styles.action}>
            <Space>
              <Button
                className={styles.save}
                icon={<SaveOutlined />}
                type="primary"
                title="Lưu báo cáo"
                onClick={handleSave}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                title="Xoá báo cáo"
                onClick={handleDelete}
                loading={isDeleting}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Modal
        open={mode !== null}
        title={
          mode === "create"
            ? "Thêm tiêu đề bên dưới"
            : mode === "update"
            ? "Chỉnh sửa tiêu đề"
            : "Xóa tiêu đề"
        }
        onCancel={() => setMode(null)}
        getContainer={"#modal-mount"}
        closable={false}
        onOk={handleOK}
        confirmLoading={isUpdating}
      >
        {mode === "delete" && (
          <Alert
            message="Bạn có chắc chắn muốn xóa tiêu đề này?"
            description="Tất cả các sự kiện bên trong tiêu đề này sẽ bị xóa."
            type="warning"
            showIcon
          />
        )}

        {mode !== "delete" && (
          <Form form={form} labelCol={{ span: 6 }} initialValues={{ level: 1 }}>
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
                  { label: "Heading 1", value: 1 },
                  { label: "Heading 2", value: 2 },
                  { label: "Heading 3", value: 3 },
                  { label: "Heading 4", value: 4 },
                  { label: "Heading 5", value: 5 },
                ]}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );

  function toggleOutline() {
    setIsOpen(!isOpen);
  }

  function handleSave() {
    mutate({ title, headings });
  }

  function handleDelete() {
    Modal.confirm({
      title: "Xác nhận xoá báo cáo",
      content: "Bạn có chắc chắn muốn xoá báo cáo này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      getContainer: "#modal-mount",
      onOk: () => {
        deleteReport(id!, {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.REPORTS]);
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
      downloadFile(blob, "bao-cao-tong-hop.docx");
    });
  }

  // Handle CRUD heading toc
  function handleOK() {
    form.validateFields().then((values) => {
      const updatedHeadings = produce(headings, (draft) => {
        if (mode === "create") {
          if (selectedIndex !== null) {
            draft.splice(selectedIndex + 1, 0, {
              id: nanoid(),
              title: values.title,
              level: values.level,
              eventIds: [],
            });
            return;
          }

          draft.push({
            id: nanoid(),
            title: values.title,
            level: values.level,
            eventIds: [],
          });
        }

        if (mode === "update") {
          draft[selectedIndex!].title = values.title;
          draft[selectedIndex!].level = values.level;
        }

        if (mode === "delete") {
          draft.splice(selectedIndex!, 1);
        }
      });
      updateReport(
        { headings: updatedHeadings },
        {
          onSuccess: () => {
            setHeadings(updatedHeadings);
            // Reset form
            message.success(`Đã ${mode === "delete" ? "xoá" : "lưu"} tiêu đề`);
            setMode(null);
            setSelectedIndex(null);
          },
        },
      );
    });
  }
}

export function SynthesisReportDetail(): JSX.Element {
  return (
    <HeadingTocProvider>
      <SynthesisReport />
    </HeadingTocProvider>
  );
}
