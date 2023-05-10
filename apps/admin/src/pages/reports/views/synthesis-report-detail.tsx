import { OutlineFileWordIcon } from "@/assets/icons";
import { ReportIcon } from "@/assets/svg";
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
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { HeadingToc } from "../components/heading-toc";
import { Headings, HeadingsData } from "../components/headings";
import {
  CACHE_KEYS,
  useCreateReport,
  useDeleteReport,
  useReport,
  useUpdateReport,
} from "../report.loader";
import styles from "./synthesis-report.module.less";

export function SynthesisReportDetail(): JSX.Element {
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
  const [isCreateHeading, setIsCreateHeading] = useState(false);
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
  const { mutate: updateReport } = useUpdateReport(id!, {
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

  return (
    <div className={styles.root}>
      <Card bordered={false} loading={isLoading}>
        <Row>
          <Col span={isOpen ? 4 : 1} className={styles.outline}>
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
                    className={styles.save}
                    icon={<ReportIcon />}
                    title="Tạo tiêu đề mới"
                    onClick={handleOpenCreateHeading}
                  />
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
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    title="Xoá báo cáo"
                    onClick={handleDelete}
                    loading={isDeleting}
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
          <Col span={isOpen ? 4 : 1}></Col>
        </Row>
      </Card>

      <Modal
        title="Tạo tiêu đề mới"
        open={isCreateHeading}
        onCancel={handleCloseCreateHeading}
        getContainer={"#modal-mount"}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            const id = Math.random().toString();
            setIsCreateHeading(false);
            setHeadings((prev) => [
              ...prev,
              {
                id,
                ...values,
                eventIds: [],
              },
            ]);
          });
        }}
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          initialValues={{
            level: 1,
          }}
        >
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
      </Modal>
    </div>
  );

  function toggleOutline() {
    setIsOpen(!isOpen);
  }

  function handleSave() {
    mutate({ title, headings });
  }

  function handleOpenCreateHeading() {
    setIsCreateHeading(true);
  }

  function handleCloseCreateHeading() {
    setIsCreateHeading(false);
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
}
