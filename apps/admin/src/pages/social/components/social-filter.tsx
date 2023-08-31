import { useNewsFilter, useNewsFilterDispatch } from "@/pages/news/news.context";
import { DatePicker, Form, Input, Select, Space } from "antd";

import styles from "./social-filter.module.less";

export function SocialFilter(): JSX.Element {
  const newsFilter = useNewsFilter();
  const setNewsFilter = useNewsFilterDispatch();

  return (
    <div className={styles.filter}>
      <Form onValuesChange={handleFinish}>
        <Space wrap>
          <Form.Item noStyle name="datetime">
            <DatePicker.RangePicker inputReadOnly />
          </Form.Item>
          {/* <Form.Item noStyle> */}
          <Select placeholder="Dịch" defaultValue="nguon">
            <Select.Option key="nuoc-ngoai">Dịch tiếng nước ngoài</Select.Option>
            <Select.Option key="nguon">Hiển thị ngôn ngữ nguồn</Select.Option>
          </Select>
          {/* </Form.Item> */}
          <Form.Item noStyle name="language_source">
            <Select placeholder="Ngôn ngữ" mode="multiple" allowClear style={{ minWidth: 100 }}>
              <Select.Option key="anh">Anh</Select.Option>
              <Select.Option key="viet">Việt</Select.Option>{" "}
              <Select.Option key="trung">Trung</Select.Option>
              <Select.Option key="nga">Nga</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle name="sac_thai">
            <Select placeholder="Điểm tin" defaultValue="sac-thai-tin">
              <Select.Option key="sac-thai-tin">Sắc thái tin</Select.Option>
              <Select.Option key="tich-cuc">Tích cực</Select.Option>
              <Select.Option key="tieu-cuc">Tiêu cực</Select.Option>
              <Select.Option key="trung-tinh">Trung tính</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle name="title">
            <Input.Search placeholder="Từ khoá" />
          </Form.Item>
        </Space>
      </Form>
    </div>
  );

  function handleFinish(values: Record<string, any>) {
    if ("datetime" in values) {
      values.start_date = values.datetime?.[0].format("DD/MM/YYYY");
      values.end_date = values.datetime?.[0].format("DD/MM/YYYY");
      delete values.datetime;
    }

    setNewsFilter({ ...newsFilter, ...values });
  }
}
