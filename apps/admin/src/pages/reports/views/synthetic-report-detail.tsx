import { EventDialog } from "@/components/editor/plugins/event-plugin/event-dialog";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar-plugin";
import { Editor, useLexicalComposerContext } from "@aiacademy/editor";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Col, PageHeader, Row, Spin } from "antd";
import { EditorState } from "lexical";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useReport, useUpdateReport } from "../report.loader";
import styles from "./synthetic-report.module.less";

export const SyntheticReportDetail: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useReport(id!, {
    enabled: !!id,
  });

  const [content, setContent] = useState("");
  const { mutate } = useUpdateReport(id!);

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

  return (
    <PageHeader className={styles.pageHeader} title="Báo cáo phân tích tổng hợp">
      <Row>
        <Col span={4}>
          <TableOfContentsPlugin />
        </Col>
        <Col span={18}>
          <ToolbarPlugin />
          <Spin spinning={isLoading}>
            <Editor>
              <OnChangePlugin onChange={handleChangeContent} />
            </Editor>
          </Spin>
          <EventDialog />
        </Col>
      </Row>
    </PageHeader>
  );

  function handleChangeContent(editorState: EditorState) {
    setContent(JSON.stringify(editorState));
  }
};
