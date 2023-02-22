import { Col, Row } from "antd";
import React from "react";

import { GraphList } from "../graph-list/graph-list";
import { RelationshipGraph } from "../relationship-graph/relationship-graph";

export const InternationalRelationshipGraph = () => {
  return (
    <Row>
      <Col span={5}>
        <GraphList />
      </Col>
      <Col span={19}>
        <RelationshipGraph />
      </Col>
    </Row>
  );
};
