import "react-js-cron/dist/styles.css";

import { VI_LOCALE } from "@/locales/cron";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Cron } from "react-js-cron";

interface Props {
  isLoading?: boolean;
  onSave: (data: { name: string; cronExpr: string }) => void;
}

export const PipelineForm: React.FC<Props> = ({ isLoading, onSave }) => {
  const [name, setName] = useState("");
  const [cronExpr, setCronExpr] = useState("* * * * *");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (name === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [name]);

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item label="Tên pipeline" rules={[{ required: true }]}>
          <Input placeholder="Tên pipeline" value={name} onChange={handleChangeName} />
        </Form.Item>
        <Form.Item label="Lịch chạy">
          <Cron value={cronExpr} setValue={setCronExpr} locale={VI_LOCALE} />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={disabled}
            loading={isLoading}
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  function handleChangeName(e: React.FormEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  function handleSave() {
    onSave({
      name,
      cronExpr,
    });
  }
};
