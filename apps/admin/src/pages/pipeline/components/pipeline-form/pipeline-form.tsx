import { VI_LOCALE } from "@/locales/cron";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import React, { useState } from "react";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";

interface Props {
  isLoading?: boolean;
  onSave: (data: { name: string; cronExpr: string }) => void;
}

export const PipelineForm: React.FC<Props> = ({ isLoading, onSave }) => {
  const [cronExpr, setCronExpr] = useState("* * * * *");

  return (
    <Card>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Tên pipeline"
          name="name"
          rules={[{ required: true, whitespace: true, message: "Hãy nhập tên pipeline" }]}
        >
          <Input placeholder="Tên pipeline" />
        </Form.Item>
        <Form.Item label="Lịch chạy">
          <Cron value={cronExpr} setValue={setCronExpr} locale={VI_LOCALE} />
        </Form.Item>
        <Form.Item>
          <Button loading={isLoading} type="primary" icon={<SaveOutlined />} htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  function handleSave(values: Record<string, string>) {
    onSave({
      name: values.name,
      cronExpr,
    });
  }
};
