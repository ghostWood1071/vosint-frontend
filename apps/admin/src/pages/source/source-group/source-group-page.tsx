import { AddIcon, DelIcon, ViewIcon } from "@/assets/svg";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Grid, Input, Modal, Row, Table, TableColumnsType } from "antd";
import layout from "antd/lib/layout";
import React, { useState } from "react";

import "./source-group-page.less";

interface DataType {
  key: React.Key;
  name: string;
}

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
}

export const ViewList = () => {
  const { Search } = Input;
  const [name_user, setNameUser] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [checkPass, setCheckPass] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const { useBreakpoint } = Grid;

  const [form] = Form.useForm();

  const handleFinish = (values: any) => {};

  const handlevalNameUser = (values: any) => {
    console.log(values.target.value);
    setNameUser(values.target.value);
  };
  const handlevalName = (values: any) => {
    setName(values.target.value);
    console.log(values.target.value);
  };
  const handlevalPass = (values: any) => {
    setPass(values.target.value);
    console.log(values.target.value);
  };
  const handleOk = (event: any) => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };
  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };
  const handleOpenAddModal2 = () => {
    setIsModal2Open(true);
  };

  const expandedRowRender = () => {
    const columns: TableColumnsType<ExpandedDataType> = [
      {
        title: <span className="headerTable">Tên nguồn tin</span>,
        dataIndex: "date",
        key: "date",
        align: "center",
      },
      {
        title: <span className="headerTable">Quốc gia</span>,
        dataIndex: "name",
        key: "name",
        align: "center",
      },
      {
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Row gutter={7}>
            <Col push={13}>
              <DelIcon />
              <ViewIcon />
            </Col>
          </Row>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 4; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const screens = useBreakpoint();

  const columns: TableColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name", width: 380 },
    {
      title: "icon",
      key: "icon",
      render: () => (
        <>
          {screens.xl && !screens.xxl && (
            <Row>
              <Col push={19}>
                <AddIcon onClick={handleOpenAddModal2} />
                <DelIcon />
                <ViewIcon />
              </Col>
            </Row>
          )}
          {screens.xxl && (
            <Row>
              <Col push={20}>
                <AddIcon onClick={handleOpenAddModal2} />
                <DelIcon />
                <ViewIcon />
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      name: "Tin tức tổng hợp",
    });
  }

  return (
    <div className={"rootList"}>
      <div>
        <Row>
          <Col span={12}>
            <div className="inputHeaderSource">
              <Col span={5} offset={1}>
                <div>
                  <Button
                    onClick={handleOpenAdd}
                    className="buttonHeadSource colorBlueButton"
                    type="primary"
                  >
                    <PlusCircleOutlined />
                    Thêm nguồn
                  </Button>
                </div>
              </Col>
            </div>
          </Col>
          <Col span={9} push={3}>
            <div>
              <Search className="buttonHeadSource" placeholder="Tim kiem" />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
          dataSource={data}
          showHeader={false}
        />
      </div>
      <Modal
        className=""
        title="Thêm mới nhóm nguồn tin"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
          <Form.Item
            label="Tên nhóm nguồn tin:"
            name="name_user"
            getValueFromEvent={handlevalNameUser}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Tên nguồn tin:" name="fullName" getValueFromEvent={handlevalName}>
            <Input />
          </Form.Item>
          <Form.Item label="Quốc gia:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
          <Form.Item label="Nhóm:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
          <Form.Item label="URL:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        className=""
        title="Thêm mới nguồn tin"
        open={isModal2Open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
          <Form.Item
            label="Tên nhóm nguồn tin:"
            name="name_user"
            getValueFromEvent={handlevalNameUser}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Tên nguồn tin:" name="fullName" getValueFromEvent={handlevalName}>
            <Input />
          </Form.Item>
          <Form.Item label="Quốc gia:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
          <Form.Item label="Nhóm:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
          <Form.Item label="URL:" name="pass" getValueFromEvent={handlevalPass}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
