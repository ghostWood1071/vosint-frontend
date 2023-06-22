import { Form, Input } from "antd";

import { rulesTitle } from "./form-rules";

export function NewsletterFormGioTin(): JSX.Element {
  return (
    <>
      <Form.Item name="title" label={"Tên giỏ tin"} rules={rulesTitle("giỏ tin")}>
        <Input placeholder="Nhập tên giỏ tin" />
      </Form.Item>
    </>
  );
}
