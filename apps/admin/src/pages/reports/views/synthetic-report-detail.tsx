import { OutlineFileWordIcon } from "@/assets/icons";
import { EventDialog } from "@/components/editor/plugins/event-plugin/event-dialog";
import EventsPlugin from "@/components/editor/plugins/events-plugin";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { downloadFile } from "@/components/editor/utils";
import { useConvertLexicalToDocx } from "@/components/editor/utils/docx";
import { Editor, useLexicalComposerContext } from "@aiacademy/editor";
import { ArrowLeftOutlined, EditOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button, Card, Col, DatePicker, Row, Space, Spin, Typography } from "antd";
import { Packer } from "docx";
import { EditorState } from "lexical";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { CACHE_KEYS, useReport, useUpdateReport } from "../report.loader";
import styles from "./synthetic-report.module.less";

export const SyntheticReportDetail: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useReport(id!, {
    enabled: !!id,
  });

  const [content, setContent] = useState("");
  const { mutate } = useUpdateReport(id!);
  const convertLexicalToDocx = useConvertLexicalToDocx();

  useEffect(() => {
    if (data && editor) {
      const editorState = editor.parseEditorState(data.content);
      editor.setEditorState(editorState);
    }
  }, [editor, data]);

  useEffect(() => {
    if (content) {
      const timeout = setTimeout(() => {
        mutate({ content });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [content, mutate]);

  useEffect(() => {
    if (title) {
      mutate(
        { title },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.REPORT, id!]);
          },
        },
      );
    }
  }, [title]);

  async function handleExportDocx() {
    const editorState = editor.getEditorState();
    const blobData = await convertLexicalToDocx(editorState.toJSON(), dateTime, data?.title ?? "");
    Packer.toBlob(blobData).then((blob) => {
      downloadFile(blob, "bao-cao-tong-hop.docx");
    });
  }

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
        <Col span={16} className={styles.container}>
          <Row align="middle" justify="center">
            <Col span={3}></Col>
            <Col span={18} className={styles.center}>
              <Typography.Title
                level={3}
                editable={{
                  icon: <EditOutlined />,
                  tooltip: "Chỉnh sửa tên báo cáo",
                  onChange: (value) => setTitle(value),
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                }}
                style={{
                  marginBottom: 0,
                }}
              >
                {data?.title}
              </Typography.Title>
            </Col>
            <Col span={3}>
              <Button
                title="Xuất file ra docx"
                icon={<OutlineFileWordIcon />}
                onClick={handleExportDocx}
              />
            </Col>

            <Col span={18} className={styles.center}>
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
          <Spin spinning={isLoading}>
            <Editor>
              <EventsPlugin />
              <OnChangePlugin onChange={handleChangeContent} />
            </Editor>
          </Spin>
          <EventDialog />
        </Col>
      </Row>
    </Card>
  );

  function handleChangeContent(editorState: EditorState) {
    setContent(JSON.stringify(editorState));
  }

  function toggleOutline() {
    setIsOpen(!isOpen);
  }
};
