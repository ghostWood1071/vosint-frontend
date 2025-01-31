import { pipelineListPath } from "@/pages/router";
import { PageHeader, message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PipelineForm } from "../components/pipeline-form/pipeline-form";
import { usePutPipeline } from "../pipeline.loader";

export const PipelineCreate: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const { mutate, isLoading } = usePutPipeline({
    onSuccess: () => {
      message.success("Thêm mới pipeline thành công");
      navigate(pipelineListPath);
    },
  });
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title={t("create_new_pipeline")} onBack={goBack}>
        <PipelineForm onSave={handleCreatePipeline} isLoading={isLoading} />
      </PageHeader>
    </div>
  );

  function goBack() {
    navigate(-1);
  }

  function handleCreatePipeline({ name, cronExpr }: { name: string; cronExpr: string }) {
    mutate({
      name,
      cron_expr: cronExpr,
      enabled: false,
    });
  }
};
