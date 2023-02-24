import { pipelineListPath } from "@/pages/router";
import { IActionInfos, IPipelineSchema } from "@/services/pipeline.types";
import { PageHeader, message } from "antd";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Pipeline } from "../components/pipeline/pipeline";
import { DEFAULT_INIT_PIPELINE } from "../components/pipeline/pipeline.constants";
import {
  CACHE_KEYS,
  usePipelineActionInfos,
  usePipelineDetail,
  usePutPipeline,
  useVerifyPipeline,
} from "../pipeline.loader";

export const PipelineDetail: React.FC = () => {
  const { id } = useParams();
  const { data: actions, isLoading: loadingActions } = usePipelineActionInfos();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineDetail(id!, !!actions);
  const { mutate: updatePipeline } = usePutPipeline({
    onSuccess: () =>
      message.success({
        content: "Update pipeline success",
        key: CACHE_KEYS.PipelineUpdate,
      }),
  });

  const { mutate: verifyPipeline } = useVerifyPipeline({
    onSuccess: () => {
      message.success({
        content: "Successfully verified",
        key: CACHE_KEYS.PipelineVerify,
      });
    },
    onError: () => {
      message.error({
        content: "Failure verified",
        key: CACHE_KEYS.PipelineVerify,
      });
    },
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
        onSavePipeline={handleSavePipeline}
        onVerifyPipeline={handleVerifyPipeline}
      />
    </>
  );

  function handleBack() {
    navigate(pipelineListPath);
  }

  function handleSavePipeline({
    pipeline,
    name,
    cron_expr,
  }: {
    pipeline: IPipelineSchema[];
    name: string;
    cron_expr: string;
  }) {
    message.loading({
      content: "Updating...",
      key: CACHE_KEYS.PipelineUpdate,
    });
    updatePipeline({
      _id: id,
      name,
      cron_expr,
      schema: pipeline.map((p) => pick(p, ["name", "id", "params"])),
    });
  }

  function handleVerifyPipeline() {
    if (!id) return;
    message.loading({
      content: "Verifying...",
      key: CACHE_KEYS.PipelineVerify,
    });

    verifyPipeline(id);
  }
};

function generateIdToActions(actions: IActionInfos[]) {
  return actions.map((action) => ({ ...action, id: nanoid() }));
}
