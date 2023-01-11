import { Col, Form, Input, Modal, Row, Select, Table, TableColumnsType } from "antd";
import React, { useState } from "react";
import { ViewIcon } from "@/assets/svg";
import form from "antd/lib/form";
import layout from "antd/lib/layout";

interface DataType {
  key: React.Key;
  name: string;
  country: string;
  group: string;
  url: string;
}

export const SourceList = () => {
  const { Search } = Input;

  const columns: TableColumnsType<DataType> = [
    {
      title: <span className="headerTable">Tên nguồn tin</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: <span className="headerTable">Quốc gia</span>,
      dataIndex: "country",
      key: "name",
      align: "center",
    },
    {
      title: <span className="headerTable">Nhóm</span>,
      dataIndex: "group",
      key: "name",
      align: "center",
    },
    {
      title: <span className="headerTable">URL</span>,
      dataIndex: "url",
      key: "name",
      align: "center",
    },
    {
      title: "",
      dataIndex: "",
      key: "name",
      align: "center",
      width: 10,
      render: () => <ViewIcon />,
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      name: "Tin tức tổng hợp",
      country: "Tin tức tổng hợp",
      group: "Tin tức tổng hợp",
      url: "Tin tức tổng hợp",
    });
  }

  return (
    <div className={"rootList"}>
      <div>
        <Row>
          <Col span={12}>
            <div className="inputHeaderSource">
              <Col span={5} offset={1}>
                <div></div>
              </Col>
            </div>
          </Col>
          <Col span={9} push={3}>
            <div>
              <Search className="buttonHeadSource" placeholder="Tìm kiếm" />
            </div>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};
