import { ETreeTag } from "@/components/tree/tree.store";
import { useGetMe } from "@/pages/auth/auth.loader";
import { BellTwoTone, ShoppingCartOutlined, StarTwoTone } from "@ant-design/icons";
import { Col, Modal, Row, Space, Tabs, TabsProps, Tooltip, Typography } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { useNewsDetail } from "../../news.loader";
import { useNewsStore } from "../../news.store";
import { NewDetailSummary, NewsDetailContent, NewsDetailKey } from "./components";
import styles from "./news-detail.module.less";

interface Props {
  onDelete: (id: string, tag?: ETreeTag) => void;
  onAdd: (id: string, tag: ETreeTag) => void;
}

export const NewsDetail: React.FC<Props> = ({ onDelete, onAdd }) => {
  const { setNewsIds, setShow } = useNewsStore(
    (state) => ({
      setNewsIds: state.setNewsIds,
      setShow: state.setShow,
    }),
    shallow,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const newsId = searchParams.get("newsId");
  const { data } = useNewsDetail(newsId);
  const { data: dataIAm } = useGetMe();

  const isBell = dataIAm?.vital_list.includes(newsId);
  const isStar = dataIAm?.news_bookmarks.includes(newsId);

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
              <Tooltip title={isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}>
                <BellTwoTone
                  twoToneColor={isBell ? "#00A94E" : "#A6A6A6"}
                  onClick={handleClickBell}
                />
              </Tooltip>
              <Tooltip title={isStar ? "Xoá khỏi tin được đánh dấu" : "Thêm vào tin được đánh dấu"}>
                <StarTwoTone
                  twoToneColor={isStar ? "#FFCA10" : "#A6A6A6"}
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
    >
      <div className={styles.bodyTab}>
        <Tabs items={items} centered />
      </div>
    </Modal>
  );

  function handleClickShop() {
    setNewsIds([newsId!]);
    setShow(true);
  }

  function handleClickBell() {
    isBell ? onDelete?.(newsId!, ETreeTag.QUAN_TRONG) : onAdd?.(newsId!, ETreeTag.QUAN_TRONG);
  }
  function handleClickStar() {
    isStar ? onDelete?.(newsId!, ETreeTag.DANH_DAU) : onAdd?.(newsId!, ETreeTag.DANH_DAU);
  }

  function handleCancelModel() {
    searchParams.delete("newsId");
    setSearchParams(searchParams);
  }
};
