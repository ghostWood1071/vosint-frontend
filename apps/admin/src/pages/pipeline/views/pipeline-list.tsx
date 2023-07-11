import { ActionReloadIcon, ActionRunIcon, ActionStopIcon } from "@/assets/svg";
import { VI_LOCALE } from "@/locales/cron";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, message } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import { PipelineHistory } from "../components/pipeline-history";
import { PipelineTable } from "../components/pipeline-table";
import {
  CACHE_KEYS,
  useClonePipeline,
  useDeletePipeline,
  useMutateRunOrStopAllJob,
  useMutateRunOrStopJob,
  usePipelineHistory,
  usePipelines,
  usePutPipeline,
  useVerifyPipeline,
} from "../pipeline.loader";
import styles from "./pipeline-list.module.less";

const { Search } = Input;

export const PipelineList: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [cronExpr, setCronExpr] = useState("* * * * *");

  const [searchParams, setSearchParams] = useSearchParams();
  const { data: pipelines } = usePipelines({
    page_number: searchParams.get("page_number") ?? 1,
    page_size: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
    order: "created_at",
  });

  const [idPipeline, setIdPipeline] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { data, isLoading: isLoadingHistory } = usePipelineHistory(idPipeline, {
    page_number: searchParams.get("page_number_history") ?? 1,
    page_size: searchParams.get("page_size_history") ?? 10,
  });

  const { mutate: mutateUpdate, isLoading: isUpdating } = usePutPipeline({
    onSuccess: (_, variables) => {
      message.success(variables.enabled ? "Kích hoạt thành công" : "Vô hiệu hoá thành công");
    },
  });
  const { mutate: mutateClone, isLoading: isCloning } = useClonePipeline();
  const { mutateAsync: mutateDelete, isLoading: isDeleting } = useDeletePipeline();
  const { mutate: mutateJobAll, isLoading: isLoadingJobAll } = useMutateRunOrStopAllJob({
    onSuccess: (_, variables) => {
      message.success(variables.status === "start" ? "Khởi động thành công" : "Dừng thành công");
    },
  });
  const { mutate: mutateJobOnly } = useMutateRunOrStopJob({
    onSuccess: (_, variables) => {
      message.success(variables.activated ? "Khởi động thành công" : "Dừng thành công");
    },
  });

  const { mutate: handleVerifyPipeline } = useVerifyPipeline({
    onSuccess: () => {
      message.success({
        content: "Chạy pipeline thành công",
        key: CACHE_KEYS.PipelineVerify,
      });
    },
    onError: () => {
      message.error({
        content: "Chạy pipeline thất bại",
        key: CACHE_KEYS.PipelineVerify,
      });
    },
    onMutate: () => {
      message.loading({
        content: "Đang chạy...",
        key: CACHE_KEYS.PipelineVerify,
        duration: 0,
      });
    },
  });

  return (
    <div id="pipeline-gathering" className={classNames(styles.informationGathering, "modal-mount")}>
      <PageHeader
        title={t("title_information_gathering")}
        extra={[
          <Search placeholder={t("search_here")} onSearch={handleSearch} key="search" />,
          <Button
            title="Dừng tất cả"
            loading={isLoadingJobAll}
            icon={<ActionStopIcon onClick={handleStopJobAll} />}
            key="stop_all"
          />,
          <Button
            title="Chạy tất cả"
            loading={isLoadingJobAll}
            icon={<ActionRunIcon onClick={handleStartJobAll} />}
            key="start_all"
          />,
          <Button
            title="Làm mới trang"
            icon={<ActionReloadIcon />}
            onClick={handleRefresh}
            key="refresh"
          />,
          <Button
            title="Tạo mới pipeline"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            key="create"
          />,
        ]}
      >
        <PipelineTable
          isLoading={isCloning || isDeleting || isUpdating}
          data={pipelines?.data ?? []}
          onHistory={showHistory}
          onChangeEnabled={handleChangeEnabled}
          onChangeActive={handleChangeActive}
          onClonePipeline={handleClonePipeline}
          onDeletePipeline={handleDeletePipeline}
          onVerifyPipeline={handleVerifyPipeline}
          totalRecord={pipelines?.total}
        />
      </PageHeader>
      <Modal
        title={t("pipeline_history")}
        open={isHistoryOpen}
        onCancel={handleCancelHistory}
        getContainer="#pipeline-gathering"
        width={1300}
        footer={null}
      >
        <PipelineHistory isLoading={isLoadingHistory} data={data} />
      </Modal>
      <Modal
        title={t("create_new_pipeline")}
        open={isOpenCreate}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        confirmLoading={isUpdating}
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên pipeline"
            name="name"
            rules={[{ required: true, whitespace: true, message: "Hãy nhập tên pipeline" }]}
          >
            <Input placeholder="Tên pipeline" />
          </Form.Item>
          <Form.Item label="Lịch chạy:">
            <Cron
              allowedPeriods={["week", "day", "hour", "minute", "reboot"]}
              value={cronExpr}
              setValue={setCronExpr}
              locale={VI_LOCALE}
              clearButtonProps={{ type: "default" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  function showHistory(id: string) {
    setIdPipeline(id);
    setIsHistoryOpen(true);
  }

  function handleCancelHistory() {
    setIsHistoryOpen(false);
  }

  function openCreateModal() {
    setIsOpenCreate(true);
  }

  function handleChangeActive(_id: string, activated: boolean) {
    mutateJobOnly({
      _id,
      activated,
    });
  }

  function handleChangeEnabled(_id: string, enabled: boolean) {
    mutateUpdate(
      {
        _id,
        enabled,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
        },
      },
    );
  }

  function handleClonePipeline(_id: string) {
    mutateClone(_id);
  }

  function handleDeletePipeline(_id: string) {
    return mutateDelete(_id);
  }

  function handleSearch(value: string) {
    setSearchParams({
      text_search: value,
    });
  }

  function handleStartJobAll() {
    mutateJobAll({ status: "start" });
  }

  function handleStopJobAll() {
    mutateJobAll({ status: "stop" });
  }

  function handleRefresh() {
    queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
  }

  function handleOkCreate() {
    form.validateFields().then(({ name }) => {
      mutateUpdate(
        {
          name,
          cron_expr: cronExpr,
          enabled: false,
        },
        {
          onSuccess: () => {
            setIsOpenCreate(false);
            queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
          },
        },
      );
    });
  }

  function handleCancelCreate() {
    setIsOpenCreate(false);
  }
};
