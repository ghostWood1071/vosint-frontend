import { pipelineListPath } from "@/pages/router";
import { IActionInfos, IPipelineSchema } from "@/services/pipeline.type";
import { Modal, PageHeader, Typography, message } from "antd";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { Pipeline } from "../components/pipeline/pipeline";
import { DEFAULT_INIT_PIPELINE } from "../components/pipeline/pipeline.constants";
import { usePipelineState } from "../pipeline-state";
import {
  CACHE_KEYS,
  usePipelineActionInfos,
  usePipelineDetail,
  usePipelineLogHistoryLastLazy,
  usePutPipeline,
  useVerifyPipeline,
} from "../pipeline.loader";
import styles from "./pipeline-detail.module.less";

export const PipelineDetail: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: actions, isLoading: loadingActions } = usePipelineActionInfos();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineDetail(id!, !!actions);
  const [setData, setError] = usePipelineState((state) => [state.setData, state.setError], shallow);
  const location = useLocation();

  const { mutate: updatePipeline } = usePutPipeline({
    onSuccess: () => {
      message.success({
        content: "Cập nhật thành công",
        key: CACHE_KEYS.PipelineUpdate,
      });
      queryClient.invalidateQueries([CACHE_KEYS.Pipelines]);
    },
    onError: () => {
      message.error({
        content: "Cập nhật thất bại",
        key: CACHE_KEYS.PipelineUpdate,
      });
    },
  });

  const { mutate: verifyPipeline } = useVerifyPipeline({
    onSuccess: (data) => {
      setError(null);
      setData(data.result);
      message.success({
        content: "Verify pipeline thành công",
        key: CACHE_KEYS.PipelineVerify,
      });
      Modal.success({
        width: "70%",
        getContainer: "#modal-mount",
        closable: true,
        content:
          typeof data.result === "string" ? (
            <></>
          ) : (
            <>
              <Typography.Text type={data.result["data:title"] ? undefined : "danger"} strong>
                Tiêu đề:
              </Typography.Text>

              <Typography.Paragraph>{data.result["data:title"]}</Typography.Paragraph>

              <Typography.Text type={data.result["data:author"] ? undefined : "danger"} strong>
                Tác giả:
              </Typography.Text>

              <Typography.Paragraph>{data.result["data:author"]}</Typography.Paragraph>

              <Typography.Text type={data.result["pub_date"] ? undefined : "danger"} strong>
                Thời gian
              </Typography.Text>

              <Typography.Paragraph>{data.result["pub_date"]}</Typography.Paragraph>

              <Typography.Text type={data.result["data:html"] ? undefined : "danger"} strong>
                Nội dung:
              </Typography.Text>

              <div
                dangerouslySetInnerHTML={{
                  __html: data.result["data:html"],
                }}
                ref={(el) => el && removeStyles(el)}
                className={styles.detailContent}
              />
            </>
          ),
      });
    },
    onError: () => {
      getLogHistoryLast(id!);
      message.error({
        content: "Verify pipeline thất bại",
        key: CACHE_KEYS.PipelineVerify,
      });
    },
    onMutate: () => {
      message.loading({
        content: "Verifying...",
        key: CACHE_KEYS.PipelineVerify,
        duration: 0,
      });
    },
  });

  const { mutate: getLogHistoryLast } = usePipelineLogHistoryLastLazy({
    onSuccess: (error) => {
      setError(error);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setData(null);
  }, [location.pathname]);

  if (loadingActions || loadingPipeline) return null;

  return (
    <PageHeader
      title="Thông tin chi tiết pipeline"
      className={styles.pageHeader}
      onBack={handleBack}
    >
      <Pipeline
        initialCron={pipeline?.cron_expr ?? ""}
        initialActions={generateIdToActions(actions ?? [])}
        initialItems={pipeline?.schema.length ? pipeline.schema : DEFAULT_INIT_PIPELINE}
        initialNamePipeline={pipeline?.name}
        onSavePipeline={handleSavePipeline}
        onVerifyPipeline={handleVerifyPipeline}
      />
    </PageHeader>
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
    id && verifyPipeline(id);
  }
};

function generateIdToActions(actions: IActionInfos[]) {
  return actions.map((action) => ({ ...action, id: nanoid() }));
}

function removeStyles(el: HTMLElement | ChildNode) {
  if (el instanceof HTMLElement) {
    el.removeAttribute("style");
  }

  if (el.childNodes.length > 0) {
    for (let child in el.childNodes) {
      /* filter element nodes only */
      if (el.childNodes[child].nodeType === 1) removeStyles(el.childNodes[child]);
    }
  }
}
