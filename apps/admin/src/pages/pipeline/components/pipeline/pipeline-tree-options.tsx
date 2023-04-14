import { useProxyPipelineOptions } from "@/pages/configuration/config.loader";
import type { IActionParamInfo } from "@/services/pipeline.type";
import { CloseCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import classNames from "classnames";
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

  // Set default value
  var defaultParams = option?.param_infos?.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.default_val }),
    {},
  );

  useEffect(() => {
    // Reset form
    form.setFieldsValue({ ...defaultParams, ...option?.params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option?.id]);

  return (
    <Card title="Options" className={styles.root} extra={<CloseCircleOutlined onClick={onClose} />}>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange} preserve>
        {option?.param_infos?.map((param) => {
          if (param.val_type === "select") {
            return <FormSelect key={param.name} {...param} />;
          }

          if (param.val_type === "str") {
            return <FormStr key={param.name} {...param} />;
          }

          if (param.val_type === "source") {
            return <FormSource key={param.name} {...param} />;
          }

          if (param.val_type === "pubdate") {
            return <FormPubDate key={param.name} {...param} />;
          }

          if (param.val_type === "proxy") {
            return <FormProxy key={param.name} {...param} />;
          }

          return null;
        })}

        {/* hold actions value when change */}
        <Form.Item name="actions" hidden>
          <Input hidden />
        </Form.Item>
      </Form>
    </Card>
  );
}

function FormSelect({ options, name, display_name }: IActionParamInfo): JSX.Element {
  return (
    <Form.Item label={display_name} name={[name]}>
      <Select>
        {options?.map((val) => (
          <Option key={val} value={val}>
            {val}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}

function FormStr({ display_name, name }: IActionParamInfo): JSX.Element {
  return (
    <Form.Item label={display_name} name={[name]}>
      <TextArea />
    </Form.Item>
  );
}

function FormSource({ display_name, name }: IActionParamInfo): JSX.Element {
  const { data, isLoading } = usePipelineSource();

  return (
    <Form.Item label={display_name} name={[name]}>
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

function FormProxy({ display_name, name }: IActionParamInfo): JSX.Element {
  const { data, isLoading } = useProxyPipelineOptions();

  return (
    <Form.Item label={display_name} name={[name]}>
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

function FormPubDate({ display_name, name, options }: IActionParamInfo): JSX.Element {
  const form = Form.useFormInstance();
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
