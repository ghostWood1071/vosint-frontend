import { EventDialog } from "@/components/editor/plugins/event-plugin/event-dialog";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { getSyntheticReportDetailUrl } from "@/pages/router";
import { Editor, useLexicalComposerContext } from "@aiacademy/editor";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button, Card, Col, Row, Typography, message } from "antd";
import { $getRoot, EditorState } from "lexical";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { CACHE_KEYS, useCreateReport } from "../report.loader";
import styles from "./synthetic-report.module.less";

export function SyntheticReportCreate(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("Tên báo cáo");
  const [content, setContent] = useState(defaultContent);
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(true);

  const { mutate } = useCreateReport({
    onSuccess: (data) => {
      navigate(getSyntheticReportDetailUrl(data));
      message.success("Tạo báo cáo thành công");
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
    },
  });

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
  }, []);

  return (
    <Card bordered={false}>
      <Row>
        <Col span={4} className={styles.outline}>
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
          </div>

          {isOpen && <TableOfContentsPlugin />}
        </Col>
        <Col span={16}>
          <Row justify="space-between">
            <Col
              push={2}
              span={20}
              style={{
                textAlign: "center",
              }}
            >
              <Typography.Title
                level={2}
                editable={{
                  icon: <EditOutlined />,
                  tooltip: "Chỉnh sửa tên báo cáo",
                  onChange: (value) => setTitle(value),
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                }}
              >
                {title}
              </Typography.Title>
            </Col>
          </Row>
          <Editor>
            <OnChangePlugin onChange={handleChangeContent} />
          </Editor>
          <EventDialog />
        </Col>
        <Col span={4}>
          <Button type="primary" key="save" icon={<SaveOutlined />} onClick={handleSave}>
            Lưu
          </Button>
        </Col>
      </Row>
    </Card>
  );

  function handleChangeContent(editorState: EditorState) {
    setContent(JSON.stringify(editorState));
  }

  function handleSave() {
    mutate({ title, content });
  }

  function toggleOutline() {
    setIsOpen(!isOpen);
  }
}

const defaultContent = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;
