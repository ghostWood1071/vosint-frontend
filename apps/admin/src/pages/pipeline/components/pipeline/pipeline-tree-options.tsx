import { IActionParamInfo } from "@/services/pipeline.type";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Card, Form, Input, Select } from "antd";
import { useEffect } from "react";

import styles from "./pipeline-tree-options.module.less";
import { FlattenedItem } from "./pipeline.type";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  option: FlattenedItem | null;
  onClose(): void;
  onValuesChange(changedValues: any, values: any): void;
}

export function PipelineTreeOptions({ option, onClose, onValuesChange }: Props) {
  const [form] = Form.useForm();

  var defaultParams = option?.param_infos?.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.default_val }),
    {},
  );

  useEffect(() => {
    form.setFieldsValue({ ...defaultParams, ...option?.params });
  }, [option?.id]);

  return (
    <Card title="Options" className={styles.root} extra={<CloseCircleOutlined onClick={onClose} />}>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        {option?.param_infos?.map((param) => (
          <RenderFormItem key={param.name} param={param} />
        ))}
      </Form>
    </Card>
  );
}

function RenderFormItem({ param }: { param: IActionParamInfo }) {
  return (
    <Form.Item key={param.name} label={param.display_name} name={[param.name]}>
      {renderFormItemStrategies?.[param?.val_type]?.(param)}
    </Form.Item>
  );
}

const renderFormItemStrategies: Record<string, (props: IActionParamInfo) => JSX.Element> = {
  select: ({ options }) => (
    <Select>
      {options?.map((val) => (
        <Option key={val} value={val}>
          {val}
        </Option>
      ))}
    </Select>
  ),
  str: () => <TextArea />,
};
