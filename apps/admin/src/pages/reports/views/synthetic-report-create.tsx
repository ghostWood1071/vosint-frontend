import { EventDialog } from "@/components/editor/plugins/event-plugin/event-dialog";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar-plugin";
import { getSyntheticReportDetailUrl } from "@/pages/router";
import { Editor } from "@aiacademy/editor";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button, Card, Col, PageHeader, Row, Typography, message } from "antd";
import { EditorState } from "lexical";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateReport } from "../report.loader";
import styles from "./synthetic-report.module.less";

export function SyntheticReportCreate(): JSX.Element {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Tên báo cáo");
  const [content, setContent] = useState("Nội dung báo cáo");

  const { mutate } = useCreateReport({
    onSuccess: (data) => {
      navigate(getSyntheticReportDetailUrl(data));
      message.success("Tạo báo cáo thành công");
    },
  });

  return (
    <PageHeader
      className={styles.pageHeader}
      title="Tạo cáo phân tích tổng hợp"
      extra={[
        <Button type="primary" key="save" icon={<SaveOutlined />} onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Card>
        <Row>
          <Col span={4}>
            <Typography.Paragraph
              editable={{
                icon: <EditOutlined />,
                tooltip: "Chỉnh sửa tên báo cáo",
                onChange: (value) => setTitle(value),
                triggerType: ["text", "icon"],
                enterIcon: null,
              }}
            >
              {title}
            </Typography.Paragraph>
            <TableOfContentsPlugin />
          </Col>
          <Col span={20}>
            <ToolbarPlugin />
            <Editor>
              <OnChangePlugin onChange={handleChangeContent} />
            </Editor>
            <EventDialog />
          </Col>
        </Row>
      </Card>
    </PageHeader>
  );

  function handleChangeContent(editorState: EditorState) {
    setContent(JSON.stringify(editorState));
  }

  function handleSave() {
    mutate({ title, content });
  }
}
