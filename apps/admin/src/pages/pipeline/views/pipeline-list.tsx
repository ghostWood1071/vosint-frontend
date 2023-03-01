import { ActionReloadIcon, ActionRunIcon, ActionStopIcon } from "@/assets/svg";
import { pipelineCreatePath } from "@/pages/router";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, PageHeader } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PipelineHistory } from "../components/pipeline-history";
import { PipelineTable } from "../components/pipeline-table";
import {
  useClonePipeline,
  useDeletePipeline,
  usePipelineHistory,
  usePipelines,
  usePutPipeline,
} from "../pipeline.loader";
import styles from "./pipeline-list.module.less";

const { Search } = Input;

export const PipelineList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: pipelines } = usePipelines({
    page_number: searchParams.get("page_number") ?? 1,
    page_size: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const navigate = useNavigate();

  const { mutate, isLoading } = usePutPipeline({
    onSuccess: () => {},
  });
  const { mutate: mutateClone, isLoading: isCloning } = useClonePipeline();
  const { mutate: mutateDelete, isLoading: isDeleting } = useDeletePipeline();
  const [idPipeline, setIdPipeline] = useState("");
  const { data, isLoading: isLoadingHistory } = usePipelineHistory(idPipeline);

  return (
    <div id="pipeline-gathering" className={classNames(styles.informationGathering, "modal-mount")}>
      <PageHeader
        title={t("title_information_gathering")}
        extra={[
          <Search placeholder={t("search_here")} onSearch={handleSearch} />,
          <Button title="Dung tat ca" icon={<ActionStopIcon />} />,
          <Button title="Chay tat ca" icon={<ActionRunIcon />} />,
          <Button title="Làm mới trang" icon={<ActionReloadIcon />} />,
          <Button
            title="Them moi pipeline"
            icon={<PlusOutlined />}
            onClick={navigateCreatePipeline}
          />,
        ]}
      >
        <PipelineTable
          isLoading={isLoading || isCloning || isDeleting}
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

  function handleChangeEnabled(_id: string, enabled: boolean) {
    mutate({
      _id,
      enabled,
    });
  }

  function handleChangeActive(_id: string, actived: boolean) {
    mutate({
      _id,
      actived,
    });
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
};
