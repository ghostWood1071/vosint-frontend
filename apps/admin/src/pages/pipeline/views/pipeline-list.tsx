import { ActionReloadIcon, ActionRunIcon, ActionStopIcon } from "@/assets/svg";
import { pipelineCreatePath } from "@/pages/router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, PageHeader } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

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
} from "../pipeline.loader";
import styles from "./pipeline-list.module.less";

const { Search } = Input;

export const PipelineList: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const { mutate: mutateUpdate, isLoading: isUpdating } = usePutPipeline();
  const { mutate: mutateClone, isLoading: isCloning } = useClonePipeline();
  const { mutate: mutateDelete, isLoading: isDeleting } = useDeletePipeline();
  const { mutate: mutateJobAll, isLoading: isLoadingJobAll } = useMutateRunOrStopAllJob();
  const { mutate: mutateJobOnly } = useMutateRunOrStopJob();

  return (
    <div id="pipeline-gathering" className={classNames(styles.informationGathering, "modal-mount")}>
      <PageHeader
        title={t("title_information_gathering")}
        extra={[
          <Search placeholder={t("search_here")} onSearch={handleSearch} />,
          <Button
            title="Dung tat ca"
            loading={isLoadingJobAll}
            icon={<ActionStopIcon onClick={handleStopJobAll} />}
          />,
          <Button
            title="Chay tat ca"
            loading={isLoadingJobAll}
            icon={<ActionRunIcon onClick={handleStartJobAll} />}
          />,
          <Button title="Làm mới trang" icon={<ActionReloadIcon />} onClick={handleRefresh} />,
          <Button
            title="Them moi pipeline"
            icon={<PlusOutlined />}
            onClick={navigateCreatePipeline}
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
    </div>
  );

  function showHistory(id: string) {
    setIdPipeline(id);
    setIsHistoryOpen(true);
  }

  function handleCancelHistory() {
    setIsHistoryOpen(false);
  }

  function navigateCreatePipeline() {
    navigate(pipelineCreatePath);
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
    mutateDelete(_id);
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
};
