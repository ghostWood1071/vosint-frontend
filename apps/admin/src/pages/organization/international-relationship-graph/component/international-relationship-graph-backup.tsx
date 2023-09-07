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

const BLUE_DEFAULTS:any = {
  x: 100,
  y: 100,
  // fill: "blue",
  width: 150,
  height: 150,
  draggable: true
};

const RED_DEFAULTS:any = {
  x: 100,
  y: 300,
  // fill: "red",
  width: 150,
  height: 150,
  draggable: true
};


const WHITE_DEFAULTS:any = {
  x: 100,
  y: 300,
  // fill: "red",
  width: 150,
  height: 150,
  draggable: true
};

const Edge = ({ node1, node2 } : {node1: any, node2: any}) => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  let angle = Math.atan2(-dy, dx);

  const radius = 20;
  const curvePower = 30;

  const arrowStart = {
    x: node2.x + -radius * Math.cos(angle + Math.PI),
    y: node2.y + radius * Math.sin(angle + Math.PI)
  };

  const arrowEnd = {
    x: node1.x + -radius * Math.cos(angle),
    y: node1.y + radius * Math.sin(angle)
  };

  const arrowCurve = {
    x:
      (arrowStart.x + arrowEnd.x) / 2 +
      curvePower * Math.cos(angle + Math.PI / 2),
    y:
      (arrowStart.y + arrowEnd.y) / 2 +
      curvePower * Math.sin(angle - Math.PI / 2)
  };

  return (
    <>
    <Arrow
      tension={1.5}
      points={[
        arrowStart.x,
        arrowStart.y,
        arrowCurve.x,
        arrowCurve.y,
        arrowEnd.x,
        arrowEnd.y
      ]}
      stroke="#000"
      fill="#000"
      strokeWidth={3}
      pointerWidth={6}
    />
    {/* <Text
      x={arrowStart.x - 35} 
      y={(arrowEnd.y - arrowCurve.y) / 2}
      text={"123"}
      fontSize={12}
    /> */}
    {/* <Text
      x={arrowCurve.x} 
      y={(arrowCurve.y - arrowStart.y)}
      text={"123"}
      fontSize={12}
      />   */}
    </>
  );
};


export const InternationalRelationshipGraphBackup = () => {
  const [filterEvent, setFilterEvent] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = React.useState<any>([]);
  const [dirty, setDirty] = React.useState(false);
  const [blueNode, updateBlueNode] = React.useState(BLUE_DEFAULTS);
  const [redNode, updateRedNode] = React.useState(RED_DEFAULTS);
  const [whiteNode, updateWhiteNode] = React.useState(WHITE_DEFAULTS);
  // const textRef = React.useRef();
  // const [calculatedTextSize, setCalculatedTextSize] = React.useState({width: 0, height: 0});

  // React.useLayoutEffect(() => {
  //   if (textRef.current) {
  //     setCalculatedTextSize({
  //       width: textRef.current.measureSize(text).width,
  //       height: textRef.current.measureSize(text).height
  //     }); 
  //   }   
  // }, [text]);

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

  const [image1] = useImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEX///8AOabVKx7c3Ny6MijXKx36+/4ANqYAOaPRKx0YPJO/v7/Y2dsIOZQANqgAOagNPJG2MiijNi/vywmdAAABcklEQVR4nO3Q0VHCQABAwdNEo0EI0H+xMnzl5rWwW8KOy8LsMpbBbHESTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk5qGX/jm7PXyPW2cXa7jn07ONv2sR8fnB1Owkk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JS7xNm+7j/MLuPxy+zx1i/mK2vk0/OnJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpN4nzNbxXJk9/wEL1hiQSef+/AAAAABJRU5ErkJggg==");
  const [image2] = useImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAACWCAMAAADUtKzmAAAAclBMVEWyIjT///88O27WiJK4M0TQeIO+RFPKZnPEVWNbQWxGRXXz8/ZEQ3RJSHg/PnBwb5VjYotWVYHLy9h9fJ7f3+eMjKpbW4Xs7PGsrMJ0c5i4uMpOTXz4+PqenbeXlrKxscXDw9PKytiCgqLa2uSkpLvb2+QUHNzpAAAEN0lEQVR4nO2da5eaWBBFvTczyQwgIk+f0Vb7///FgCDNI1Nr1cSyrLXO/kA651OdTatc+tK98C9nYQjYoYAdin7o/byHTKTdmEM/9HneSCbSbszhMXPpymkhoUi7MYf7wEmW7dwuy5KvOnKRdmMO94GDnWs4L78ayUXajTl0BX7W0/8cvxikIu3GHPrxD/NGMpF2Yw7dyNfT8nYdN5KKtBtzaCcOtvVhG9y/jiLRyH+zw2+ulbNMNPLODr+xs9uJRobtBKvVKgzrQyASGbfjL4cmPRRCkXE7fl05V63FIuN24tC5MBaLjNtZVdtVtRKLrNppr0x8tvd+n4lFVu1spudYKtKuzKC3s3azt0+hSLsyg9ZOmSQ3d0uSwU0ruUi7MoPWzjq9/+c6OOVy0V926F5Z8aaefjP68BWLtNfdHLr5i3r8yUWtVKTdmEM3cpqW549xI6lIuzGHduKgObFFu1yMY9HIoJ0hq9nV7VMj43ZO82u5Z0aG7UTr9bqq6kMkEhm3Ex/by6DBB/IzI+N2mnW1c7Ol9vMi43Z800gwsm0nORTFIRGLav62w5ed7t3hUrcpL2KRN7gKbZj8bFcu0q7MoLezPMw2bAlF2pUZtHaWy2Xhivo4qCMWaVdm0NppPnprqu1XI7no1RX/gO6VtTy78YYkwUizLpPH+86l/vriR0hFmnWZPOyc8yyf7BSVirQrM+jsRKfIR7fRdgCxSLsyg8d95cExSUQjg3aG3G6ikXE7+Xzh+MzIf7fD9O7XKWz2TYSnSCS6o73u5jA9s8VhtiHpmZFxOz53LheMbNsp3WYzeQjkmZFxO0XmfVaIRVbtXNp/4v4gEhm1E4WTjbNikXZjDo+ZMzfbli4UaTfmcB949ZmHLsw/Bz9dkYu0G3No5y+v9XVzPvp4EYu0G3Pov/Pd9OUgFf2ww8POLjyGkyc+pCKdBeX/4nEH47z3+914N5tUpF2ZwePuVzN53C4Xy1I0MmhnyPEoGhm383kVjQzbCU7X+sP3ej0FIpFxO92WpNGGpGdGxu1435xvwci2nbVL08lDIM+MjNspjrEvCrHIqp1uV8CyP4hERu3E1ewBTqHoHzv0drZuO20kFGmvuzm0s3+kucvTj0EpuUi7MYd2/vv+o2p0xsUi7cYcuvlfeH9HuzGHbuTNYXeYPPEhFWk35tBOHKeJT9LxPRmpSLsxh3biqFkpBqPtAGKRdmMO/uVoN+YAOxSwQ/Hvy9FeHjBY6CzvjAA7FLBDATsUsEMBOxSwQwE7FLBDATsUsEOx0N589tZoL4IBAAAAAAB4W7QfiH9rsAqlgB0K2KGAHQrYoYAdCtihgB0K2KGAHQrYoVho/4Lnt0Z7EQwAAAAAAMDbov1HJ98arEIpYIcCdihghwJ2KGCHAnYoYIcCdihghwJ2KBbfwH+jvQgGAAAAAAAAWOQXSUw20+VREl0AAAAASUVORK5CYII=");
  const [image3] = useImage("data:image/png;base64,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");
 
  image1?.classList.add("image-cover");
  image2?.classList.add("image-cover");
  image3?.classList.add("image-cover");
  
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
                    <Stage width={window.innerWidth} height={window.innerHeight}>
                      <Layer>
                        <Edge node1={blueNode} node2={redNode} />
                        <Edge node1={redNode} node2={blueNode} /> 
                        <Edge node1={whiteNode} node2={blueNode} /> 
                        <Edge node1={whiteNode} node2={redNode} /> 
                        <Circle
                          {...blueNode}
                          onDragMove={e => {
                            updateBlueNode({ ...blueNode, ...e.target.position() });
                          }}
                          fillPatternImage={image1}
                        />
                        <Circle
                          {...redNode}
                          onDragMove={e => {
                            updateRedNode({ ...redNode, ...e.target.position() });
                          }}
                          fillPatternImage={image2}

                        />
                          <Circle
                          {...whiteNode}
                          onDragMove={e => {
                            updateWhiteNode({ ...redNode, ...e.target.position() });
                          }}
                          fillPatternImage={image3}

                        />
                      </Layer>
                    </Stage>

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

