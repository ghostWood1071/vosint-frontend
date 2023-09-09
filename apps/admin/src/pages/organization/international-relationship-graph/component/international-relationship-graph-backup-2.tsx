import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { CaretRightOutlined } from "@ant-design/icons";
import { Checkbox, Col, Collapse, DatePicker, Empty, Row, Select } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import {
  CACHE_KEYS,
  useGetKhachTheAndChuThe,
  useInfiniteuseGetEventBaseOnKTAndCT,
} from "../../organizations.loader";
import styles from "./international-relationship.module.less";
import "./international-relationship.less"
import { ArrowLeftRightIcon, ArrowRightIcon } from "@/assets/svg";
import { Stage, Layer, Circle, Arrow, Text, Rect, Line } from "react-konva";
import useImage from "use-image";
import { FundFlowGraph } from '@ant-design/graphs';
import G6 from "@antv/g6";

const GraphRelation = () => {
  const data = {
    nodes: [
      {
        id: '1',
        value: {
          text: 'Việt Nam',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAACZCAMAAAAMwLadAAAAclBMVEXaJR3//wDztgrtkg7qhBD//QDvoQ3bKxz86gP65ATiURf53gT52gX2ywfdNxv99AHwqAziVxbhSxjsjg/41gXfQxn30Qb1xwjodRLumQ7cMxv++QHyrwvncBP98ALkYRXpgBHlZxT1wQjunQ3zugnmbBRmEZDwAAADBUlEQVR4nO3a6XaCQAwFYAd3tO47blX7/q9YkSrb6IASMqH3+23PyT3NYWCSWg0AAAAAAAAAAAAAAAAACtVuc1dQiu9v7gpKsd1yV1CG9n7/H7r2oNSBu4YSjJQacddQgo5SHe4a6I3V1Zi7CnItP2aLuwpyXT9m5bv21rPV79pzEPPMXQexbhCzy10HLVf9cbkrIbW+x1xzV0Kqd4/Z466E0kQ9TLhrIVQPY9a5ayHUD2P2uWuhM1fqP3TtNBpzyl0NmVk05oy7GiqxnlVqzl0PkWk8ZoO7HiKLeMwFdz00Biqhml3bSMasZtd+JWN+cVdEYdBMxmwOuGsicEymVOrIXROBZTrmkrum4qV7VmLXuo5B6gF0ewiZ/sq6uxS3q8vxma6F95wbp+iUlw13Jq3VsMiQnrVvD5OZufqs+hZ/drfXmufpW0Z2T7QPnSJC7q3fwhicPk+5lHCeNrzPQjaF3G26PXOW52w8LPU22/dTOnYelnq7/Xshh0fuyvOZa99hTRby7k3q+Y/Qlt2HpV7eI7QjdPkr3xEq4rDUy36ESjks9SZ9c0Jfz7rv53zarSwptxKfPXE741focMddYxGMD9xKrLaNzT0r5i32hbM5ZhVW2zLc+FVgtc01p6zCatvaHLIKq22ZPrHFr7ZNzBl9Ft9WZlI3R/SJfqOtxdbXXhG+2jY3J6xC107NAQOyV9s0QxWvoRspiV5t0/SsPwLSjZTkXXaF0j0bjIA0IyVrx3wZJNbXIiOg1H2Y4NW25Ppa9FYrdR8mt2vj62vJW63EfZjcro3dvKdHQPGRktjVttgqkG4EFBspyVsS+hNZX3s2AoqOlJ78xHrh+trzEVBkpCR0tS3s2ZcjoMdISWjX3nvWNAJ6HKGrcuoq2Cl9WOrdj9BTGVUVbePpDku94AhtSprH3638yrOOgIKRksSuvag8I6DbSOlCWQ+Na88Oc/13fvbKk9e1u9z7EtcjVN5ozHljX6LuEBRC6615gfwhAwAAAAAAAAAAAAAAAAAAAACADX4B/Swcmld280IAAAAASUVORK5CYII=',
        },
      },
      {
        id: '2',
        value: { text: 'Nga' },
      },
      {
        id: '3',
        value: { text: 'Mỹ' },
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        value: { text: '100,000 Yuan', subText: '2019-08-03' },
      },
      {
        source: '2',
        target: '1',
        value: { text: '100,000 Yuan', subText: '2019-08-03' },
      },
      {
        source: '1',
        target: '3',
        value: { text: '100,000 Yuan', subText: '2019-08-03' },
      },
      {
        source: '3',
        target: '1',
        value: { text: '100,000 Yuan', subText: '2019-08-03' },
      },
    ],
  };

  const colorMap:any = {
    A: '#FFAA15',
    B: '#72CC4A',
  };

  const config:any = {
    data,
    edgeCfg: {

      // type: 'line',
      endArrow: (edge: any) => {
        const { value } = edge;
        return {
          fill: colorMap[value.extraKey] || '#40a9ff',
        };
      },
      style: (edge: any) => {
        const { value } = edge;
        return {
          stroke: colorMap[value.extraKey] || '#40a9ff',
        };
      },
      edgeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
          endArrow: {
            fill: '#1890ff',
          },
        },
        items: {
            width: 50,
            height: 50
        }
      },
    },
    markerCfg: (cfg: any) => {
      const { edges } = data;
      return {
        position: 'right',
        show: edges.find((item) => item.source === cfg.id),
      };
    },
   
  };

  return <FundFlowGraph {...config} />;
};

export const InternationalRelationshipGraph = () => {
  const [filterEvent, setFilterEvent] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = React.useState<any>([]);
  const [dirty, setDirty] = React.useState(false);


  const handleChange = (value: string[]) => {
    // console.log(selectedOptions);
    // if(selectedOptions.length <= 2) {
      setSelectedOptions(value);
      setDirty(true);
    // }
    
  };
  
  const handleChangeFilterTime = (value: any) => {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterEvent({ ...filterEvent, start_date: start_date, end_date: end_date });
  }
  
  
  return (
    <Row>
      <Col span={24}>
        <div className="graph-wrap">
          <div className={styles.titleContainer}>
            <div className={styles.container1}>
              {/* <button onClick={() => setSelectData([])}>Clear</button> */}
              <span className={styles.titleSelect} style={{marginRight: "5px"}}>Chọn quốc gia:</span>
              <Select
              placeholder="Chọn quốc gia"
              defaultValue={[]}
              allowClear
              //@ts-ignore
              onChange={handleChange}
              onMouseDown={(e) => {
                setDirty(false);
                e.stopPropagation();
              }}
              style={{ width: 150 }}
              mode="multiple"
              options={[
                {
                  value: "VN",
                  label: (
                    <Checkbox
                      onClick={(e) => {
                        if (dirty) {
                          e.stopPropagation();
                        }
                        setDirty(false);
                      }}
                      checked={selectedOptions.includes("john")}
                    >
                      Việt Nam
                    </Checkbox>
                  )
                },
                {
                  value: "TQ",
                  label: (
                    <Checkbox
                      onClick={(e) => {
                        if (dirty) {
                          e.stopPropagation();
                        }
                        setDirty(false);
                      }}
                      checked={selectedOptions.includes("john2")}
                    >
                      Trung Quốc
                    </Checkbox>
                  )
                },
                {
                  value: "HK",
                  label: (
                    <Checkbox
                      onClick={(e) => {
                        if (dirty) {
                          e.stopPropagation();
                        }
                        setDirty(false);
                      }}
                      checked={selectedOptions.includes("jim")}
                    >
                      Hoa Kỳ
                    </Checkbox>
                  )
                },
                {
                  value: "RS",
                  label: (
                    <Checkbox
                      onClick={(e) => {
                        if (dirty) {
                          e.stopPropagation();
                        }
                        setDirty(false);
                      }}
                      checked={selectedOptions.includes("johhny")}
                    >
                      Nga
                    </Checkbox>
                  )
                }
              ]}
            />
            </div>
            <DatePicker.RangePicker
              inputReadOnly
              format={"DD/MM/YYYY"}
              onChange={handleChangeFilterTime}
            />
          </div>
          <div style={{marginTop: "15px", padding: "10px"}}>
            <Row gutter={8}>
              <Col span={14}>
                <div className="graph-header">
                  <h3>ĐỒ THỊ QUAN HỆ QUỐC TẾ</h3>
                </div>
                <div className="graph-body">
                  <div className="graph-body-relation">
                  <GraphRelation />
                    {/* <div className="graph-country">
                      <div className="relation-circle">
                        <img className="circle-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEX///8AOabVKx7c3Ny6MijXKx36+/4ANqYAOaPRKx0YPJO/v7/Y2dsIOZQANqgAOagNPJG2MiijNi/vywmdAAABcklEQVR4nO3Q0VHCQABAwdNEo0EI0H+xMnzl5rWwW8KOy8LsMpbBbHESTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk5qGX/jm7PXyPW2cXa7jn07ONv2sR8fnB1Owkk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JS7xNm+7j/MLuPxy+zx1i/mK2vk0/OnJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpN4nzNbxXJk9/wEL1hiQSef+/AAAAABJRU5ErkJggg==" alt="" />
                      </div>
                      
                    </div>
                     <div className="graph-country">
                      <div className="relation-circle">
                        <img className="circle-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEX///8AOabVKx7c3Ny6MijXKx36+/4ANqYAOaPRKx0YPJO/v7/Y2dsIOZQANqgAOagNPJG2MiijNi/vywmdAAABcklEQVR4nO3Q0VHCQABAwdNEo0EI0H+xMnzl5rWwW8KOy8LsMpbBbHESTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk5qGX/jm7PXyPW2cXa7jn07ONv2sR8fnB1Owkk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JS7xNm+7j/MLuPxy+zx1i/mK2vk0/OnJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpN4nzNbxXJk9/wEL1hiQSef+/AAAAABJRU5ErkJggg==" alt="" />
                      </div>
                      
                    </div> */}
                   

                  </div>
                </div>
              </Col>
              <Col span={10}>
                <div className="graph-header">
                  <h3>THÔNG TIN SỰ KIỆN</h3>
                </div>
                <div className="graph-body">
                  <div className="graph-item">
                    <div className="graph-item-header">
                      <span>Trung Quốc</span>
                      <ArrowRightIcon />
                      <span>Hoa Kỳ</span>
                    </div>
                    <div className="graph-item-content">
                      <div className="graph-content-box positive">
                        <div className="box-shade">Tích cực</div>
                        <div className="box-collapse">
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="1">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="2">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                        </div>
                      </div>
                      <div className="graph-content-box negative">
                        <div className="box-shade">Tiêu cực</div>
                        <div className="box-collapse">
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="1">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="2">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                        </div>
                      </div>
                      <div className="graph-content-box neutral">
                        <div className="box-shade">Trung tính</div>
                        <div className="box-collapse">
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="1">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                            }}
                          >
                            <Collapse.Panel header={"Hoàng sa, Trường sa là của Việt Nam"} key="2">
                              <div >
                              Hoàng sa, Trường sa là của Việt Nam
                              </div>
                            </Collapse.Panel>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      
      </Col>
    </Row>
  );
};

