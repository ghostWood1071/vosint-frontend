import { OutlineFileWordIcon } from "@/assets/icons";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { downloadFile } from "@/components/editor/utils";
import { useConvertHeadingsToDocx } from "@/components/editor/utils/docx";
import { reportPath } from "@/pages/router";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
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
  useDeleteReport,
  useReport,
  useUpdateReport,
  useUpdateReportAndEvent,
} from "../report.loader";
import styles from "./synthesis-report.module.less";

export function SynthesisReport(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("Tên báo cáo");
  const [headings, setHeadings] = useState<HeadingsData[]>([]);

  const { id } = useParams<{ id: string }>();
  const { data } = useReport(id!, {
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;

    setTitle(data.title);
    setHeadings(data.headings);
  }, [data]);

  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(true);
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );

  const { mutate: deleteReport, isLoading: isDeleting } = useDeleteReport();
  const { mutate: updateReportAndEvent } = useUpdateReportAndEvent();
  const { mutate: updateReport, isLoading: isUpdating } = useUpdateReport(id!, {
    onSuccess: (_, variables) => {
      setHeadings(variables?.headings ?? []);
      setTitle(variables?.title ?? "");
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
      message.success("Cập nhật báo cáo thành công");
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
    setHeadings(deletedEventsHeadings);
  };

  // HeadingTOC
  const { mode, selectedIndex, currentHeading } = useHeadingTocContext();
  const { setMode, setSelectedIndex, setCurrentHeading } = useHeadingTocDispatchContext();
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
      form.setFieldValue("level", currentHeading);
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

            {isOpen && <HeadingToc headingsData={headings} setHeadingsData={setHeadings} />}
          </div>
        </Col>
        <Col md={isOpen ? 16 : 21} span={isOpen ? 16 : 22} className={styles.container}>
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
        <Col md={isOpen ? 4 : 2} span={isOpen ? 4 : 1} className={styles.action} pull={3}>
          <Space>
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
      >
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
                { label: "Tiêu đề mức 1", value: 1 },
                { label: "Tiêu đề mức 2", value: 2 },
                { label: "Tiêu đề mức 3", value: 3 },
                { label: "Tiêu đề mức 4", value: 4 },
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
    updateReport({ title, headings });
  }

  function handleDelete() {
    Modal.confirm({
      title: "Xác nhận xoá báo cáo",
      content: "Bạn có chắc chắn muốn xoá báo cáo này?",
      okText: "Xoá",
      cancelText: "Huỷ",
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

        // if (mode === "delete") {
        //   draft.splice(selectedIndex!, 1);
        // }
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

export function SynthesisReportDetail(): JSX.Element {
  return (
    <HeadingTocProvider>
      <SynthesisReport />
    </HeadingTocProvider>
  );
}
