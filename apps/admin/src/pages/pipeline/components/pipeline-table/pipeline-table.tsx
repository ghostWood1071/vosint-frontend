import {
  PipelineCloneIcon,
  PipelineHistoryIcon,
  PipelineRunIcon,
  PipelineSleepIcon,
} from "@/assets/svg";
import { SwitchCustom } from "@/components/";
import { getPipelineDetailPath } from "@/pages/router";
import { IPipelines } from "@/services/pipeline.type";
import Icon, { DeleteOutlined, PlayCircleTwoTone } from "@ant-design/icons";
import { Button, Modal, Space, Table, TableColumnsType } from "antd";
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
  onDeletePipeline: (_id: string) => Promise<any>;
  onChangeActive: (_id: string, enabled: boolean) => void;
  onVerifyPipeline: (data: { id: string; mode_test?: boolean }) => void;
}

export const PipelineTable: React.FC<Props> = ({
  data,
  isLoading,
  totalRecord,
  onHistory,
  onChangeEnabled,
  onClonePipeline,
  onDeletePipeline,
  onChangeActive,
  onVerifyPipeline,
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
      title: "Kích hoạt",
      dataIndex: "enabled",
      align: "center",
      render: (enabled: boolean, { _id }) => {
        return (
          <SwitchCustom
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
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
      title: "Hoạt động",
      dataIndex: "actived",
      align: "center",
      render: (actived: boolean, { _id, enabled }) => {
        return (
          <SwitchCustom
            checkedChildren="Stop"
            unCheckedChildren="Run"
            defaultChecked={actived}
            isColorful
            onChange={handleChange}
            disabled={!enabled}
          />
        );

        function handleChange(checked: boolean) {
          onChangeActive(_id, checked);
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
        return (
          <Button
            onClick={handleSetId}
            icon={<PipelineHistoryIcon />}
            type="primary"
            title="Lịch sử thu thập"
          />
        );
        function handleSetId() {
          onHistory && onHistory(record._id);
        }
      },
    },
    {
      title: t("action"),
      align: "center",
      dataIndex: "_id",

      render: (_id: string, record) => {
        return (
          <Space>
            <Button
              title={`Chạy pipeline "${record.name}"`}
              icon={<PlayCircleTwoTone twoToneColor="#52c41a" />}
              type="text"
              onClick={() =>
                onVerifyPipeline({
                  id: _id,
                  mode_test: false,
                })
              }
            />

            <Icon
              style={{ fontSize: 16 }}
              component={PipelineCloneIcon}
              onClick={handleClone}
              title="Nhân bản pipeline"
            />

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              type="text"
              title="Xoá pipeline"
            />
          </Space>
        );

        function handleClone() {
          onClonePipeline(_id);
        }

        function handleDelete() {
          Modal.confirm({
            title: "Bạn có muốn xoá pipeline này không?",
            okText: "Xoá",
            cancelText: "Huỷ",
            content: record.name,
            onOk: () => onDeletePipeline(_id),
          });
        }
      },
    },
  ];

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={data}
      size="small"
      rowKey="_id"
      pagination={{
        position: ["bottomCenter"],
        onChange: handlePaginationChange,
        current: page ? +page : 1,
        total: totalRecord,
        showSizeChanger: true,
      }}
    />
  );

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
