import {
  PipelineCloneIcon,
  PipelineHistoryIcon,
  PipelineRunIcon,
  PipelineSleepIcon,
} from "@/assets/svg";
import { SwitchCustom } from "@/components/";
import { getPipelineDetailPath } from "@/pages/router";
import { IPipelines } from "@/services/pipeline.types";
import Icon, { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, TableColumnsType, Tooltip } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

interface Props {
  data?: IPipelines[];
  isLoading?: boolean;
  totalRecord?: number;

  onHistory?(id: string): void;

  onChangeEnabled: (_id: string, enabled: boolean) => void;
  onClonePipeline: (_id: string) => void;
  onDeletePipeline: (_id: string) => void;
}

export const PipelineTable: React.FC<Props> = ({
  data,
  isLoading,
  onHistory,
  onChangeEnabled,
  onClonePipeline,
  onDeletePipeline,
  totalRecord,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const columns: TableColumnsType<IPipelines> = [
    {
      title: t("name_pipeline"),
      key: "name",
      dataIndex: "name",
      render: (name, { _id }) => {
        return <Link to={getPipelineDetailPath(_id)}>{name}</Link>;
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
      title: t("status"),
      dataIndex: "actived",
      align: "center",
      render: (status: number) => {
        return (
          <Space align="center">
            <PipelineSleepIcon className={!status ? "active" : ""} />
            <PipelineRunIcon className={status ? "active" : ""} />
          </Space>
        );
      },
    },
    {
      title: t("collect_history"),
      align: "center",
      render: (_, record) => {
        return <Button onClick={handleSetId} icon={<PipelineHistoryIcon />} type="primary" />;
        function handleSetId() {
          onHistory && onHistory(record._id);
        }
      },
    },
    {
      title: t("action"),
      align: "center",
      dataIndex: "_id",

      render: (_id: string) => {
        return (
          <Space>
            <Tooltip title="Nhân bản pipeline">
              <Icon style={{ fontSize: 16 }} component={PipelineCloneIcon} onClick={handleClone} />
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Bạn có muốn xoá pipeline này không?"
              onConfirm={handleDelete}
            >
              <Tooltip title="Xoá pipeline">
                <Button danger icon={<DeleteOutlined />} type="text" />
              </Tooltip>
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
        onChange: handlePaginationChange,
        current: page ? +page : 1,
        total: totalRecord,
      }}
    />
  );

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
