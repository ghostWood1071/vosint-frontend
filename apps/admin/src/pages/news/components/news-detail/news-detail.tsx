import ImportantButton from "@/components/important-button/important-button";
import { ETreeTag, useNewsSelection } from "@/components/news/news-state";
import { BellTwoTone, ShoppingCartOutlined, StarTwoTone } from "@ant-design/icons";
import { Col, Modal, Row, Space, Tabs, TabsProps, Tooltip, Typography } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";

import { useNewsDetail } from "../../news.loader";
import { NewDetailSummary, NewsDetailContent, NewsDetailKey } from "./components";
import styles from "./news-detail.module.less";

interface Props {
  onDelete: (id: string, tag?: ETreeTag) => void;
  onAdd: (id: string, tag: ETreeTag) => void;
}

export const NewsDetail: React.FC<Props> = ({ onDelete, onAdd }) => {
  const setNewsSelection = useNewsSelection((state) => state.setNewsSelection);
  const setOpenSelection = useNewsSelection((state) => state.setOpen);
  const [searchParams, setSearchParams] = useSearchParams();
  const newsId = searchParams.get("newsId");
  const { data } = useNewsDetail(newsId);

  const items: TabsProps["items"] = [
    {
      label: "Nội dung",
      key: "noi-dung",
      children: <NewsDetailContent content={data?.["data:content"]} />,
    },
    {
      label: "Tóm tắt",
      key: "tom-tat",
      children: <NewDetailSummary content={data?.["data:content"]} title={data?.["data:title"]} />,
    },
    {
      label: "Mind map",
      key: "mind-map",
    },
    {
      label: "Từ khoá",
      key: "tu-khoa",
      children: <NewsDetailKey />,
    },
    // {
    //   label: "Tin liên quan",
    //   key: "tin-lien-quan",
    // },
  ];

  return (
    <Modal
      width={"90%"}
      open={!!newsId}
      onCancel={handleCancelModel}
      getContainer="#modal-mount"
      footer={null}
      title={
        <Row align="middle">
          <Col span={6}>
            <Space>
              <Tooltip title="Thêm vào giỏ tin">
                <ShoppingCartOutlined onClick={handleClickShop} />
              </Tooltip>
              <Tooltip
                title={data?.["is_bell"] ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}
              >
                <ImportantButton
                  item={{ isBell: data?.["is_bell"] }}
                  handleClickImportant={handleClickImportant}
                />
              </Tooltip>
              <Tooltip
                title={
                  data?.["is_star"] ? "Xoá khỏi tin được đánh dấu" : "Thêm vào tin được đánh dấu"
                }
              >
                <StarTwoTone
                  twoToneColor={data?.["is_star"] ? "#FFCA10" : "#A6A6A6"}
                  onClick={handleClickStar}
                />
              </Tooltip>
            </Space>
          </Col>
          <Col span={12}>
            <h3 style={{ color: "#00A94E", textAlign: "center" }}>{data?.["data:title"]}</h3>
          </Col>
          <Col span={4} push={1}>
            <Typography.Link
              target="_blank"
              href={data?.["data:url"]}
              rel="noreferrer"
              ellipsis={true}
            >
              {data?.["data:url"]}
            </Typography.Link>
            <div>{data?.["data:time"]}</div>
          </Col>
        </Row>
      }
      destroyOnClose
    >
      <div className={styles.bodyTab}>
        <Tabs items={items} centered />
      </div>
    </Modal>
  );

  function handleClickShop() {
    setNewsSelection([data]);
    setOpenSelection(true);
  }

  function handleClickImportant() {
    data?.["is_bell"]
      ? onDelete?.(newsId!, ETreeTag.QUAN_TRONG)
      : onAdd?.(newsId!, ETreeTag.QUAN_TRONG);
  }

  function handleClickStar() {
    data?.["is_star"]
      ? onDelete?.(newsId!, ETreeTag.DANH_DAU)
      : onAdd?.(newsId!, ETreeTag.DANH_DAU);
  }

  function handleCancelModel() {
    searchParams.delete("newsId");
    setSearchParams(searchParams);
  }
};
