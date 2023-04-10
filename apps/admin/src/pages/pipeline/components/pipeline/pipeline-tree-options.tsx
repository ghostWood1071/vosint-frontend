import { IActionParamInfo } from "@/services/pipeline.type";
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import classNames from "classnames";
import { FormInstance } from "rc-field-form";
import { useEffect } from "react";

import { usePipelineSource } from "../../pipeline.loader";
import styles from "./pipeline-tree-options.module.less";
import type { FlattenedItem } from "./pipeline.type";

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
        {option?.param_infos?.map((param) =>
          renderFormItemStrategies?.[param?.val_type]?.(param, form),
        )}
      </Form>
    </Card>
  );
}

const renderFormItemStrategies: Record<
  string,
  (props: IActionParamInfo, form: FormInstance<any>) => JSX.Element
> = {
  select: ({ options, name, display_name }) => (
    <Form.Item key={name} label={display_name} name={[name]}>
      <Select>
        {options?.map((val) => (
          <Option key={val} value={val}>
            {val}
          </Option>
        ))}
      </Select>
    </Form.Item>
  ),
  str: ({ name, display_name }) => (
    <Form.Item key={name} label={display_name} name={[name]}>
      <TextArea />
    </Form.Item>
  ),
  source: SourceItem,
  pubdate: PubDateItem,
};

function PubDateItem(
  { name, display_name, options }: IActionParamInfo,
  form: FormInstance<any>,
): JSX.Element {
  const display = Form.useWatch(name, form);

  return (
    <Form.Item label={display_name} key={name}>
      <Form.Item name={[name, "time_expr"]} noStyle>
        <Input />
      </Form.Item>
      <div
        style={{
          margin: "8px 0",
        }}
      >
        <Typography.Text strong>{display?.time_format.join(" ")}</Typography.Text>
      </div>
      <Form.List name={[name, "time_format"]}>
        {(fields, { add, remove }) => (
          <Space align="start" className={classNames(styles.space, "scrollbar")}>
            {fields.map((field) => (
              <Space direction="vertical" key={field.key} align="center">
                <Form.Item {...field} noStyle>
                  <Select className={styles.select}>
                    {options?.map((o) => (
                      <Option key={o}>{o}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className={styles.center}>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </div>
              </Space>
            ))}
            <Button className={styles.buttonRight} icon={<PlusOutlined />} onClick={() => add()} />
          </Space>
        )}
      </Form.List>
    </Form.Item>
  );
}

function SourceItem({ name, display_name }: IActionParamInfo): JSX.Element {
  const { data, isLoading } = usePipelineSource();
  return (
    <Form.Item key={name} label={display_name} name={[name]}>
      <Select
        loading={isLoading}
        options={data}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
    </Form.Item>
  );
}
