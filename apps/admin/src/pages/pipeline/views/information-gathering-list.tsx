import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Typography, Input, Space, Button, Modal } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ActionReloadIcon, ActionRunIcon, ActionStopIcon } from "@/assets/svg";
import { pipelineInformationGatheringCreatePath } from "@/pages/router";
import { PipelineHistory } from "../components/pipeline-history";
import { PipelineTable } from "../components/pipeline-table";
import {
  useClonePipeline,
  useDeletePipeline,
  usePipelines,
  usePutPipeline,
} from "../pipeline.loader";
import styles from "./information-gathering-list.module.less";

const { Title } = Typography;
const { Search } = Input;

export const InformationGatheringList: React.FC = () => {
  const { data } = usePipelines();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const navigate = useNavigate();

  const { mutate, isLoading } = usePutPipeline({
    onSuccess: () => {},
  });
  const { mutate: mutateClone, isLoading: isCloning } = useClonePipeline();
  const { mutate: mutateDelete, isLoading: isDeleting } = useDeletePipeline();

  return (
    <div id="pipeline-gathering" className={classNames(styles.informationGathering, "modal-mount")}>
      <Title level={2} className={styles.title}>
        {t("title_information_gathering")}
      </Title>
      <Row justify="space-between">
        <Col span={6}>
          <Search placeholder={t("search_here")} />
        </Col>
        <Col>
          <Space align="end">
            <Button icon={<ActionStopIcon />} />
            <Button icon={<ActionRunIcon />} />
            <Button icon={<ActionReloadIcon />} />
            <Button onClick={navigateCreatePipeline} icon={<PlusOutlined />} />
          </Space>
        </Col>
      </Row>
      <br />
      <PipelineTable
        isLoading={isLoading || isCloning || isDeleting}
        data={data ?? []}
        onHistory={showHistory}
        onChangeEnabled={handleChangeEnabled}
        onChangeActived={handleChangeActived}
        onClonePipeline={handleClonePipeline}
        onDeletePipeline={handleDeletePipeline}
      />
      <Modal
        title={t("pipeline_history")}
        open={isHistoryOpen}
        onCancel={handleCancelHistory}
        getContainer="#pipeline-gathering"
        width={1300}
        footer={null}
      >
        <PipelineHistory />
      </Modal>
    </div>
  );

  function showHistory() {
    setIsHistoryOpen(true);
  }

  function handleCancelHistory() {
    setIsHistoryOpen(false);
  }

  function navigateCreatePipeline() {
    navigate(pipelineInformationGatheringCreatePath);
  }

  function handleChangeEnabled(_id: string, enabled: boolean) {
    mutate({
      _id,
      enabled,
    });
  }

  function handleChangeActived(_id: string, actived: boolean) {
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
};
