import { Button, Popconfirm, Space, Table, TableColumnsType } from "antd";
import React from "react";
import Icon, { DeleteOutlined } from "@ant-design/icons";
import { PipelineCloneIcon, PipelineHistoryIcon } from "@/assets/svg";
import { SwitchCustom } from "@/components/";
import { useTranslation } from "react-i18next";
import { IPipelines } from "@/services/pipeline.types";
import { Link } from "react-router-dom";
import { getPipelineInformationGatheringUrl } from "@/pages/router";

interface Props {
  data?: IPipelines[];
  isLoading?: boolean;
  onHistory?(): void;
  onChangeEnabled: (_id: string, enabled: boolean) => void;
  onChangeActived: (_id: string, actived: boolean) => void;
  onClonePipeline: (_id: string) => void;
  onDeletePipeline: (_id: string) => void;
}

export const PipelineTable: React.FC<Props> = ({
  data,
  isLoading,
  onHistory,
  onChangeEnabled,
  onChangeActived,
  onClonePipeline,
  onDeletePipeline,
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const columns: TableColumnsType<IPipelines> = [
    {
      title: t("id_pipeline"),
      key: "_id",
      dataIndex: "_id",
      render: (id: string) => {
        return <Link to={getPipelineInformationGatheringUrl(id)}>{id}</Link>;
      },
    },
    {
      title: t("name_pipeline"),
      key: "name",
      dataIndex: "name",
      render: (name, { _id }) => {
        return <Link to={getPipelineInformationGatheringUrl(_id)}>{name}</Link>;
      },
    },
    {
      title: t("create_at"),
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: t("active"),
      dataIndex: "enabled",
      align: "center",
      render: (enabled: boolean, { _id }) => {
        return (
          <SwitchCustom
            checkedChildren="Enable"
            unCheckedChildren="Disable"
            defaultChecked={enabled}
            isSquare
            onChange={handleChange}
          />
        );
        function handleChange(checked: boolean) {
          onChangeEnabled(_id, checked);
        }
      },
    },
    {
      title: t("activity"),
      dataIndex: "actived",
      render: (actived: boolean, { _id }) => {
        return (
          <SwitchCustom
            checkedChildren="Stop"
            unCheckedChildren="Run"
            defaultChecked={actived}
            isColorful
            onChange={handleChange}
          />
        );
        function handleChange(checked: boolean) {
          onChangeActived(_id, checked);
        }
      },
    },
    // TODO: Need confirm
    // {
    //   title: t("status"),
    //   dataIndex: "status",
    //   render: (status: number) => {
    //     return (
    //       <Space align="center">
    //         <PipelineStandIcon className={status === 0 ? "active" : ""} />
    //         <PipelineSleepIcon className={status === 1 ? "active" : ""} />
    //         <PipelineRunIcon className={status === 2 ? "active" : ""} />
    //       </Space>
    //     );
    //   },
    // },
    {
      title: t("collect_history"),
      align: "center",
      render: () => {
        return <Button onClick={onHistory} icon={<PipelineHistoryIcon />} type="primary" />;
      },
    },
    {
      title: t("action"),
      align: "center",
      dataIndex: "_id",

      render: (_id: string) => {
        return (
          <Space>
            <Icon style={{ fontSize: 16 }} component={PipelineCloneIcon} onClick={handleClone} />
            <Popconfirm
              placement="top"
              title="Bạn có muốn xoá pipeline này không?"
              onConfirm={handleDelete}
            >
              <Button danger icon={<DeleteOutlined />} type="text" />
            </Popconfirm>
          </Space>
        );
        function handleClone() {
          onClonePipeline(_id);
        }

        function handleDelete() {
          onDeletePipeline(_id);
        }
      },
    },
  ];

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={data}
      rowKey="_id"
      pagination={{
        position: ["bottomCenter"],
      }}
    />
  );
};
