import { Form, Input } from "antd";

import { rulesTitle } from "./form-rules";

export function NewsletterFormGioTin(): JSX.Element {
  return (
    <>
      <Form.Item name="title" rules={rulesTitle}>
        <Input placeholder="Nhập tên giỏ tin" />
      </Form.Item>
    </>
  );
}
