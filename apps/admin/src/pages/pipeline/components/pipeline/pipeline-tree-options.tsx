import { IActionParamInfo } from "@/services/pipeline.types";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Card, Form, Input, Select } from "antd";
import { useEffect } from "react";
import styles from "./pipeline-tree-options.module.less";
import { FlattenedItem } from "./pipeline.types";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  option: FlattenedItem | null;
  onClose(): void;
  onValuesChange(changedValues: any, values: any): void;
}

export function PipelineTreeOptions({ option, onClose, onValuesChange }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      Object.keys(option?.params ?? {}).length === 1 && option?.params.actions
        ? option?.param_infos?.reduce(
            (acc, curr) => ({ ...acc, [curr.name]: curr.default_val }),
            {},
          )
        : option?.params,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {renderFormItemStrategies[param?.val_type](param)}
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
