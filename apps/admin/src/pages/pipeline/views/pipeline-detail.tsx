import { ActionLogIcon } from "@/assets/svg";
import { VI_LOCALE } from "@/locales/cron";
import { IActionInfos, IPipelineSchema } from "@/models/pipeline.type";
import { useSidebar } from "@/pages/app/app.store";
import { pipelineListPath } from "@/pages/router";
import { ArrowLeftOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, message } from "antd";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";
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
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });
  const queryClient = useQueryClient();
  const { data: actions, isLoading: loadingActions } = usePipelineActionInfos();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineDetail(id!, !!actions);
  const [setData, setError] = usePipelineState((state) => [state.setData, state.setError], shallow);
  const [pipelineName, setPipelineName] = useState<string>(pipeline?.name ?? t("name_pipeline"));
  const [cron, setCron] = useState(pipeline?.cron_expr ?? "");
  const location = useLocation();
  const [items, setItems] = useState(
    pipeline?.schema.length ? pipeline.schema : DEFAULT_INIT_PIPELINE,
  );

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

  useEffect(() => {
    if (pipeline !== undefined) {
      setPipelineName(pipeline?.name ?? "");
      setCron(pipeline?.cron_expr ?? "");
      setItems(pipeline?.schema.length ? pipeline.schema : DEFAULT_INIT_PIPELINE);
    }
  }, [pipeline]);

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

  const pinned = useSidebar((state) => state.pinned);

  if (loadingActions || loadingPipeline) return null;
  return (
    <div className={styles.mainContainer}>
      <div className={pinned ? styles.header2 : styles.header1}>
        <div className={styles.leftHeader}>
          <div className={styles.backContainer}>
            <ArrowLeftOutlined onClick={handleBack} style={{ fontSize: 18 }} />
          </div>
          <div className={styles.titleContainer}>
            <div style={{ alignSelf: "center", marginLeft: 10, width: "90%" }}>
              <Typography.Paragraph
                editable={{
                  icon: <EditOutlined />,
                  tooltip: t("edit_pipeline_name"),
                  onChange: setPipelineName,
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                }}
                ellipsis={true}
              >
                {pipelineName}
              </Typography.Paragraph>
            </div>
          </div>
        </div>
        <div className={styles.rightHeader}>
          <Cron
            allowedPeriods={["week", "day", "hour", "minute", "reboot"]}
            value={cron}
            setValue={setCron}
            locale={VI_LOCALE}
            clearButtonProps={{ type: "default" }}
          />

          {handleSavePipeline && (
            <Button
              icon={<SaveOutlined />}
              title="Save"
              onClick={() =>
                handleSavePipeline({
                  name: pipelineName,
                  pipeline: items,
                  cron_expr: cron,
                })
              }
              className={styles.button}
            />
          )}
          {handleVerifyPipeline && (
            <Button
              icon={<ActionLogIcon />}
              title="verify pipeline"
              onClick={handleVerifyPipeline}
              className={styles.button}
            />
          )}
        </div>
      </div>
      <div className={styles.body}>
        <Pipeline
          initialActions={generateIdToActions(actions ?? [])}
          setItems={setItems}
          items={items}
        />
      </div>
    </div>
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
    id &&
      verifyPipeline({
        id,
      });
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
