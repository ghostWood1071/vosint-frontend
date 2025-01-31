import { getSyntheticReportDetailUrl } from "@/pages/router";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography, message } from "antd";
import produce from "immer";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { HeadingToc } from "../components/heading-toc";
import {
  HeadingTocProvider,
  useHeadingTocContext,
  useHeadingTocDispatchContext,
} from "../components/heading-toc.context";
import { Headings, HeadingsData } from "../components/headings";
import { CACHE_KEYS, useCreateReport } from "../report.loader";
import styles from "./synthesis-report.module.less";

export function SynthesisReport(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [headings, setHeadings] = useState<HeadingsData[]>([]);
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

  // HeadingTOC
  const { mode, selectedIndex, currentHeading } = useHeadingTocContext();
  const { setMode, setSelectedIndex, setCurrentHeading } = useHeadingTocDispatchContext();

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

            {isOpen && <HeadingToc headingsData={headings} setHeadingsData={setHeadings} />}
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

          <Headings headingsData={headings} />
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
    mutate({ title, headings });
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

      setHeadings(updatedHeadings);
      message.success(`Đã ${mode === "delete" ? "xoá" : "lưu"} tiêu đề`);

      // Reset form
      setMode(null);
      setSelectedIndex(null);
    });
  }
}

export function SynthesisReportCreate(): JSX.Element {
  return (
    <HeadingTocProvider>
      <SynthesisReport />
    </HeadingTocProvider>
  );
}
