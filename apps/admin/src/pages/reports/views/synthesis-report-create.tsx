import { ReportIcon } from "@/assets/svg";
import { getSyntheticReportDetailUrl } from "@/pages/router";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { HeadingToc } from "../components/heading-toc";
import { Headings, HeadingsData } from "../components/headings";
import { CACHE_KEYS, useCreateReport } from "../report.loader";
import styles from "./synthesis-report.module.less";

export function SynthesisReportCreate(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [headings, setHeadings] = useState<HeadingsData[]>([]);
  const [isCreateHeading, setIsCreateHeading] = useState(false);
  const [form] = Form.useForm();
  const [title, setTitle] = useState("Tên báo cáo");
  const [isOpen, setIsOpen] = useState(true);

  const { mutate } = useCreateReport({
    onSuccess: (data) => {
      navigate(getSyntheticReportDetailUrl(data));
      message.success("Tạo báo cáo thành công");
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
    },
  });

  const handleDeleteEvent = (reportId: string) => (eventId: string) => {
    console.log(reportId, eventId);
  };

  return (
    <div className={styles.root}>
      <Card bordered={false}>
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
                    icon={<ReportIcon />}
                    title="Tạo tiêu đề mới"
                    onClick={handleOpenCreateHeading}
                  />
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
}
