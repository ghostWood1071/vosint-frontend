import { Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

interface SwiperItemProps {
  title: string;
  content: string;
  dateCreated: string;
}

export const SwiperItem: React.FC<SwiperItemProps> = ({ content, title, dateCreated }) => {
  return (
    <div
      style={{
        padding: "0 60px",
      }}
    >
      <Typography.Title level={4}>{title}</Typography.Title>
      <Typography.Text>
        Ngày tạo:{" "}
        {dateCreated ? dayjs(dateCreated).format("DD/MM/YYYY HH:mm:ss") : "Không có dữ liệu"}
      </Typography.Text>
      <Typography.Paragraph
        ellipsis={{
          rows: 5,
        }}
      >
        <blockquote>{content}</blockquote>
      </Typography.Paragraph>
    </div>
  );
};
