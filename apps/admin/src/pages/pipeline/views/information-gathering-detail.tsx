import { pipelineInformationGathering } from "@/pages/router";
import { IActionInfos, IPipelineSchema } from "@/services/pipeline.types";
import { message, PageHeader } from "antd";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pipeline } from "../components/pipeline/pipeline";
import { DEFAULT_INIT_PIPELINE } from "../components/pipeline/pipeline.constants";
import { usePipelineActionInfos, usePipelineDetail, usePutPipeline } from "../pipeline.loader";

export const InformationGatheringDetail: React.FC = () => {
  const { id } = useParams();
  const { data: actions, isLoading: loadingActions } = usePipelineActionInfos();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineDetail(id!, !!actions);
  const { mutate } = usePutPipeline({
    onSuccess: () => message.success("Update pipeline success"),
  });
  const navigate = useNavigate();

  if (loadingActions || loadingPipeline) return null;

  return (
    <>
      <PageHeader title="Thông tin chi tiết pipeline" onBack={handleBack} />
      <Pipeline
        initialCron={pipeline?.cron_expr ?? ""}
        initialActions={generateIdToActions(actions ?? [])}
        initialItems={pipeline?.schema.length ? pipeline.schema : DEFAULT_INIT_PIPELINE}
        initialNamePipeline={pipeline?.name}
        onRunPipeline={handleRunPipeline}
      />
    </>
  );

  function handleBack() {
    navigate(pipelineInformationGathering);
  }

  function handleRunPipeline({
    pipeline,
    name,
    cron_expr,
  }: {
    pipeline: IPipelineSchema[];
    name: string;
    cron_expr: string;
  }) {
    mutate({
      _id: id,
      name,
      cron_expr,
      schema: pipeline.map((p) => pick(p, ["name", "id", "params"])),
    });
  }
};

function generateIdToActions(actions: IActionInfos[]) {
  return actions.map((action) => ({ ...action, id: nanoid() }));
}
