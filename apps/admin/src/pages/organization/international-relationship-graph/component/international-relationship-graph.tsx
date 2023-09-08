import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { CaretDownFilled, CaretRightOutlined, CaretUpFilled, LineOutlined } from "@ant-design/icons";
import { Checkbox, Col, Collapse, DatePicker, Empty, Row, Select, Tooltip } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import {
  CACHE_KEYS,
  OBJECT_TYPE,
  useGetKhachTheAndChuThe,
  useInfiniteuseGetEventBaseOnKTAndCT,
  useMutationDrawGraph,
  useMutationMappingGraph,
  useObjectList,
} from "../../organizations.loader";
import styles from "./international-relationship.module.less";
import "./international-relationship.less"
import { ArrowLeftRightIcon, ArrowRightIcon } from "@/assets/svg";
import { Stage, Layer, Circle, Arrow, Text, Rect, Line } from "react-konva";
import useImage from "use-image";
import { FundFlowGraph } from '@ant-design/graphs';
import G6 from "@antv/g6";
import ReactDOM from "react-dom";
import Graph from "../../components/organizations-graph";

export const InternationalRelationshipGraph = () => {
  const [filterEvent, setFilterEvent] = useState<Record<string, string>>({});
  const [dataDraw, setDataDraw] = useState<any>(
      {
      // nodes: [
      //   { 
      //     id: "node1",
      //     // label: "1",
      //     img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/225px-Flag_of_Vietnam.svg.png'
      //   },
      //   { 
      //     id: "node2", 
      //     // label: "2",
      //     img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAACWCAMAAADUtKzmAAAAclBMVEWyIjT///88O27WiJK4M0TQeIO+RFPKZnPEVWNbQWxGRXXz8/ZEQ3RJSHg/PnBwb5VjYotWVYHLy9h9fJ7f3+eMjKpbW4Xs7PGsrMJ0c5i4uMpOTXz4+PqenbeXlrKxscXDw9PKytiCgqLa2uSkpLvb2+QUHNzpAAAEN0lEQVR4nO2da5eaWBBFvTczyQwgIk+f0Vb7///FgCDNI1Nr1cSyrLXO/kA651OdTatc+tK98C9nYQjYoYAdin7o/byHTKTdmEM/9HneSCbSbszhMXPpymkhoUi7MYf7wEmW7dwuy5KvOnKRdmMO94GDnWs4L78ayUXajTl0BX7W0/8cvxikIu3GHPrxD/NGMpF2Yw7dyNfT8nYdN5KKtBtzaCcOtvVhG9y/jiLRyH+zw2+ulbNMNPLODr+xs9uJRobtBKvVKgzrQyASGbfjL4cmPRRCkXE7fl05V63FIuN24tC5MBaLjNtZVdtVtRKLrNppr0x8tvd+n4lFVu1spudYKtKuzKC3s3azt0+hSLsyg9ZOmSQ3d0uSwU0ruUi7MoPWzjq9/+c6OOVy0V926F5Z8aaefjP68BWLtNfdHLr5i3r8yUWtVKTdmEM3cpqW549xI6lIuzGHduKgObFFu1yMY9HIoJ0hq9nV7VMj43ZO82u5Z0aG7UTr9bqq6kMkEhm3Ex/by6DBB/IzI+N2mnW1c7Ol9vMi43Z800gwsm0nORTFIRGLav62w5ed7t3hUrcpL2KRN7gKbZj8bFcu0q7MoLezPMw2bAlF2pUZtHaWy2Xhivo4qCMWaVdm0NppPnprqu1XI7no1RX/gO6VtTy78YYkwUizLpPH+86l/vriR0hFmnWZPOyc8yyf7BSVirQrM+jsRKfIR7fRdgCxSLsyg8d95cExSUQjg3aG3G6ikXE7+Xzh+MzIf7fD9O7XKWz2TYSnSCS6o73u5jA9s8VhtiHpmZFxOz53LheMbNsp3WYzeQjkmZFxO0XmfVaIRVbtXNp/4v4gEhm1E4WTjbNikXZjDo+ZMzfbli4UaTfmcB949ZmHLsw/Bz9dkYu0G3No5y+v9XVzPvp4EYu0G3Pov/Pd9OUgFf2ww8POLjyGkyc+pCKdBeX/4nEH47z3+914N5tUpF2ZwePuVzN53C4Xy1I0MmhnyPEoGhm383kVjQzbCU7X+sP3ej0FIpFxO92WpNGGpGdGxu1435xvwci2nbVL08lDIM+MjNspjrEvCrHIqp1uV8CyP4hERu3E1ewBTqHoHzv0drZuO20kFGmvuzm0s3+kucvTj0EpuUi7MYd2/vv+o2p0xsUi7cYcuvlfeH9HuzGHbuTNYXeYPPEhFWk35tBOHKeJT9LxPRmpSLsxh3biqFkpBqPtAGKRdmMO/uVoN+YAOxSwQ/Hvy9FeHjBY6CzvjAA7FLBDATsUsEMBOxSwQwE7FLBDATsUsEOx0N589tZoL4IBAAAAAAB4W7QfiH9rsAqlgB0K2KGAHQrYoYAdCtihgB0K2KGAHQrYoVho/4Lnt0Z7EQwAAAAAAMDbov1HJ98arEIpYIcCdihghwJ2KGCHAnYoYIcCdihghwJ2KBbfwH+jvQgGAAAAAAAAWOQXSUw20+VREl0AAAAASUVORK5CYII="
      //   },
      //   { 
      //     id: "node3",
      //     // label: "3",
      //     img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARQAAAC3CAMAAADkUVG/AAABLFBMVEXuHCX//wHvHCXuHCf9/wDtHSP//QPwGSj81CPsHiPrHiTdIQ/sHSf4/wDxGirrHyD1Fy/nISD/9x31/wDoHyboIRvvHSD/+wntGyzyHB31FyzrHx3uGjHvHhnzGSflIh381h//3yP/8SDnIBD0SS73FTXytynsfCLdQiDfGA/iBRbrnhrlaBL5nEf2pznUZBTUHRDRHQDlghfsTiDXQBP/7zHqciTrZCDbmg7+6A3TNADebxL6yRzigCLVTgDxizT/yDz93zXsjh77nijiXRfzayDOfAX3XUHvnhfmVBXulB3qORvnkynpWCX+0Q74bDf/l036si3ITAXOKhjAKwD9fDn/wEP7SDz/8Tn6FxTxFjv6vR/SFijmbzDaKwDoOCT2ihv+whrFPwb9qyMdeqpiAAALz0lEQVR4nO2cC1fbRhbHpRmNZI2kmZGsx1iSR7ZZw1qwiSGQrsGbpoS2GJJ008fuNm5J0nz/77AjA9tAKRHtEhDM7+SQnFhwrv66c18zQtMUCoVCobgTgMUXANBNG3KLIMwutNQSonCFsPhNm3M7cLnW6WZhiHwmlgolygKasTwsKIXM+cuS7d60ObcDbDOm+XzIRssrYljctDm3g+ivo1iknJeryRph1k2bczsY/e3Bw7EdrW8E3iOM05s253qpm2HR5lbSelx+NkiCQxcjdJXvbRiQRBnm5ON3B1j490D3JpPEmGwO06UIEtf37U9g4g3gAgE5rPHIoea0EsNIPLO3TQgVqYWxDL13EdtNBcE2+PiVgJGdgW6YphlM/+GEec5pt9O5fgtvANsVI8u3xcevFKm73veMtpTFCPr7TxxqQXQ3g4pNR58XvlbDUxAdrQam0W7ruuHpg6c/yGKOh9du4E1g09kXY5zGH7+SjnYTM1ksn/7y27Vtx3Vpll2/hTeAXT4z97SPiQKlo1hfJoYMKYmRrK7LQJQy6Pt3LdAiTBixKRj1jdVRDC+5EtsaIXbx2WQyfb72VeCZK1ZB75gap2BIZPEl9gKjNwKXiWJLUSwaff1ie2ylo2emsZMW9h0t8yG2bSsF+2YSzBi+7EpbsyCOIhjmRHQf9b09ZhP6qcz8tBAaUfnke0Zi7F/e9CINSgVjkXPUReFB8ohp7I52yXJFgDSbJUli9K3o8mvl6sJxR5A4Zmz96aEF764oNBXOcz0xjWR2afFWBRwI7aibUWwj+iKikPmfyMpPjEURE+tPjapCPUirhhf8Tg23EMXiORAsB50h9GUzeNIJAluuLKmYZmMEL4vWDcGimNtHSdKWPd7LEkW56PBLw+fxPVe6/Vrco2/eDIvQzVHkR2zY/Ogr74zjDd1sm0E7OBRxHnf4lVuZ9OCl3YlRJoa+k2LnOuz8lGA/tUg51XXPTNrJc5HmWcyuvADEmjl3YiZEufbPMm589MU+S+lmYBiGXEHetBzyAqVXF2Uz0Kdj5Hw53XoYicaXuTgk6WhDdjMy0HreYDYkBRFXbnrj7a0kebUzHbSnDojJdRj6SeG2cKamocvko+vmrit8Jq6caG2nZwRJYLSDtZQUjQq0VpU0AdLQB0MhwiOxOahGAVXra04LEQ7FmaBw6YwF2RokULPKXrtaf8mrIrZ5janM7SElnDPREXFGXQCsBSQV/m6QmPoxk29jlp5+BoAgLhRAJm1O4IXDab/gwzx0Hr9MPN2UjrKHBSSN6hL9KIr88XejkeOMnVPW17+fmt6JJubWhhM5HzJy1o8i2+XkYo8Rado92ugNzHbbTHQj2I1SljdpgxnEcbz0w9N+r9Vq9aovC6bTlowFxrEohjf48LNWv9+btv7170ir/Obinxk9evAfoxo7VaKYycHox6Um1f7I569zZ6Uv76C6f/3UO2SINZITUSp1Tt2mmsEanjl/MsookFz0M90wLJzttYPlViADdWK0k92SNSr7+JjIjPtoKkNIkpjHyFwsn7N5Isqv/199JAOvubW/jilF6GJNNMgZS4Wg482+4U2mvX4QPB83KdCCtNPtdvzx9sHArBx+gRRikXlOvcbw5D+PP6oGsf2dEvouBADhCwdQKMu63UwWweOeYa6Ox4d7G88eNSrQsjAMeSrS8GG/igHHS0jqIG/e+1UU6R96tcJM3TPm2wXmQ04sYF8sCnQxxi6PxU9TY3I4FBlFsdukQFtRzeO7eX70KvDkSlm4xYeYp1Emqf4MNsah6IAa94hBuGzu+q+rg3CNnBzAnHb973b7RpUukkS/QJZqPXlGa+b4edqhNYp+bKGD/vc0v37rrwmY2yjPi1lLN36riYwwi3Ajm+b5USyGOclwDVFCrfPz5+O4SRH2LKjLc9gR+dH7wDB047wqC1E8o7/iUJJyHlJYI8O6oPPmzWtRY4PxlgI6kGfdmIhyZdL2fuMqxqI3nB4K6kPfL3zbqiFKlZ7c13FzRdFgHCMX01xkT6ZBcD6kyBIsGOw7AlnE9ynFENS4VSt23ZjEzT0rCV3XIozA0I9FdHBOk2p+kEy+KqNC+gchliAkrrF7bnVCV9YrTcvFv8FiEYBZGZwTperr5j+5S3gYd08efJ2TPLLiRbLsvV6Trx8rpQRms+S3onj9Me+6+f9EuUcAZDEQL58LtKYsaL1gj1kup+gKjR1ccH3WfiIQZSx2JuY5UWTu8fRVjXHXh1foYdwFjVcFZSnJHp5LPlUtK0XpO5ih0K1xAu4UXLVAuPmiUAuUq+erFD2p0nKw56exC+ufeUS2hNp34DgtQk7/NKSYp9VsUqXlZHWcCl5LlCrpIJtmGc2+jm2w2Ept7llJyGlnz5OdcjXENw2zPx9ISYzjwUHPQSmt8+4XEDRD2He6gHy2LDiwscsvHnE3A5do+wu3SPTE9N5thjsToxo4VROVwQwQAmrs38hKEKaMCcHC5cm2T3HIa53bvqWgbFj0gkoF02sHbwufk+25uRimSPZLOPzYEZ4Kl3MXIhRDNp4EK9iXKcimjdoMOwPqDmdyrbQ96Rr9vZhlXZGOd/tVoWK2jd6I1hLFRgTKrhG7bC9I5iVhqR3R5ha2KIOrepK0217w6hBkFHKXdjqzlteuppODJxHTajzxSkrbZwxZu6Y32ASiHI3SYWNVQVrZq6az5mCjZDZCLg9xp4O2XwWGjLXJamnVOQ9qU2K/WNvbW1t7qbfbrfn83fTpDzU87JaC+SyoAsp0VtLCJbEQyM/zkJUrkyoxtwpq13jtC+b86GAgQ3VQbR/Jv5PBgdOoaf4ZYHhQDaifVa1tlS4WGztyDWH/0Vxmo2AWuzVEsVKblrNpIL9BOp3h6V88LllzX3SBo6lnTDZkaf5hBoU+JnR7Xz73t6lbZxnIvJ2OftkfeNVusmFMZyMrbO7y0eTqeXfYOTeVppHNhsDZ+cJo+bxOEYZ9zFg2fih9RVY8k1/cDg+bO3Kgu8HB0jA9Jwqg1GIsRdvTwRNe45gWdKVrpUxsy7hiJnrwkPwY8uH1WHz9wOjBWrl0/qUUaElVELQYP9r9uU7TCwmUjSCmb2V4GkhnWcadrLhCd33LQIdjPy2Kc8FUqhJnVKM5Gx3yGrEBYQhohMt3XjL/dj/wJkfDrGjuUJ/S1z4jfvdMoYV9KGKKCBoT4g8vyyJAwxqwpJsAARBx+sH+2Cr3WuZGGPHmesoJv1N8frSns6wwjAUJq+kStB5vPR4hW1hHqw/Wh3VeurubABy6qEMrUSCG3zx0hEVtka2/cDqgudnnT0IxI6AbwYWnYBqlQ+JjIfI8W7Ibv/3zR8GcZSLOUrwAEkaqucHi14g0f/vnjwJZtGmnlB2LspiiYBIW3Q7ndfZZ7yYw3X71hhXkRBRMM2RBV8si7DZ4RvtHQVSziGbz8v3WZl4AG1UjSZcgJAQFjIdZjO9doAVvHs/KoRvyFbP/JqcExzHJ+b2T4RzRs635zlE5G7T7TuSEeWjTuHNvo8gJ6VLfM3vve4Y3zYYdwmU4ieuc67nTWPZOkBh6kui9cZ6mHSkIypt7AvD/g+s6+0a7eo05mO9sFzTPRTdr7qbG/wccMqdvGO3q1EbQW33yXahE0ShJdwbHh/gNXR88/bJA4t4vH6hV7yYY1Wx7Mj2YLY182SXf28L+hLSYVmN7wzTn2+PXw4ji5p/V+bOA0XsZSt4vS1GeLWVCoOoQ08UvM9wjvnm6uncU+3PdOOChExEI770oyCKFY+X58LBvHAxzlxBLQ7JJvmm7bhghUhEvddOd5K2IuwKCGKF7L0rhs4KwSJTzFRH+lAMUx4Dc+1B7TOgffp3lNX4D533CDZeWaE7ue3t8Fs6zLuL3cMh2GZCAGEAlylms6sUnpckZEHUhipUoZ7Az7NoqzCoUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBT3lf8CbIIPs4pAnfgAAAAASUVORK5CYII="
      //   },
      // ],
      // edges: [
      //   { source: "node1", target: "node2", label: "8 sự kiện: 3 tích cực, 2 tiêu cực, 3 trung tính" },
      //   { source: "node2", target: "node1", label: "8 sự kiện: 3 tích cực, 2 tiêu cực, 3 trung tính" },
      //   { source: "node3", target: "node2", label: "8 sự kiện: 3 tích cực, 2 tiêu cực, 3 trung tính" },
      // ],
      }
    );

  const [eventContent, setEventContent] = useState<any>();    
  const [selectedOptions, setSelectedOptions] = React.useState<any>([]);
  const [selectedLabelOptions, setSelectedLabelOptions] = React.useState<any>([]);
  const [dirty, setDirty] = React.useState(false);
  
  const {data: countries} = useObjectList(OBJECT_TYPE.QUOC_GIA, { name: "", limit: 10000 });

  const {mutate: mutateDrawGraph} = useMutationDrawGraph();
  const {mutate: mutateMappingGraph} = useMutationMappingGraph();

  const handleChange = (value: string[], text: any) => {
    if(value.length === 0) setEventContent([]); setSelectedLabelOptions([]);
    setSelectedOptions(value);
    setDirty(true);

    // const data = text.map((item: any) => item.label.props.children);
    const data = value;
    mutateDrawGraph({data, filterEvent}, {
      onSuccess: (res) => {
        const combined = res.edges.map((edge:any) => ({
          source: edge.source, 
          target: edge.target,
          // label: `${edge.total} sự kiện: ${edge.positive} tích cực, ${edge.negative} tiêu cực, ${edge.normal} trung tính`
          label: `${edge.total} sự kiện`
        }));

        const combinedNodes = res.nodes.map((node:any) => ({
          id: node.id,
          img: node.img,
          label: node.id
        }))

        res.nodes = combinedNodes;
        res.edges = combined;
        setDataDraw(res)
      },
      onError: (err) => {}
    })
  };

  const handleChooseEdge = (source:any, target:any) => {
    // const data = [source.id, target.id];
    const data = { source: source.id, target: target.id };
    setSelectedLabelOptions([source, target]);
    mutateMappingGraph({data, filterEvent}, {
      onSuccess: (res) => {

        setEventContent(res)
      },
      onError: (err) => {console.log(err); }
    })
  }
  const handleChangeFilterTime = (value: any) => {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterEvent({ ...filterEvent, start_date: start_date, end_date: end_date });
    const filter = { ...filterEvent, start_date: start_date, end_date: end_date };
    // setEventContent([]);
    setSelectedLabelOptions([]);
    mutateDrawGraph({data: selectedOptions, filterEvent: filter}, {
      onSuccess: (res) => {
        const combined = res.edges.map((edge:any) => ({
          source: edge.source, 
          target: edge.target,
          label: `${edge.total} sự kiện: ${edge.positive} tích cực, ${edge.negative} tiêu cực, ${edge.normal} trung tính`
        }));

        const combinedNodes = res.nodes.map((node:any) => ({
          id: node.id,
          img: node.img,
          label: node.id
        }))

        res.nodes = combinedNodes;
        res.edges = combined;
        setDataDraw(res)
      },
      onError: (err) => {}
    })


    if(selectedLabelOptions.length > 0) {
      const data = {source: selectedLabelOptions[0]?.id, target: selectedLabelOptions[1]?.id}
      mutateMappingGraph({data: data, filterEvent: filter}, {
        onSuccess: (res) => {setEventContent(res)},
        onError: (err) => {console.log(err); }
      })
    }
  }

  const searchInput = document.querySelector(".ant-select-multiple .ant-select-selector");
  if(selectedOptions.length > 0 && searchInput) searchInput.classList.add("hide");
  if(selectedOptions.length === 0 && searchInput) searchInput.classList.remove("hide");
  
  return (
    <Row>
      <Col span={24}>
        <div className="graph-wrap">
          <div className={styles.titleContainer}>
            <div className={styles.container1}>
              {/* <button onClick={() => setSelectedDefault([])}>Clear</button> */}
              <span className={styles.titleSelect} style={{marginRight: "5px"}}>Chọn quốc gia:</span>
              <Select
                placeholder="Chọn quốc gia"
                defaultValue={[]}
                allowClear
                //@ts-ignore
                onChange={(e, text) => handleChange(e, text)}
                onMouseDown={(e) => {
                  setDirty(false);
                  e.stopPropagation();
                }}
                style={{ width: 150 }}
                mode="multiple"
                options={
                countries?.data?.map((country: any) => ({
                  value: country._id,
                  label: (
                    <Checkbox
                      onClick={(e) => {
                        if (dirty) {
                          e.stopPropagation();
                        }
                        setDirty(false);
                      }}
                      checked={selectedOptions.includes(country._id)}
                    >
                      {country.name}
                    </Checkbox>
                  )
                }))
              }
            />
            </div>
            <DatePicker.RangePicker
              inputReadOnly
              format={"DD/MM/YYYY"}
              onChange={handleChangeFilterTime}
            />
          </div>
          <div style={{marginTop: "15px", padding: "10px"}}>
            <Row gutter={15}>
              <Col span={14}>
                <div className="graph-header">
                  <h3>ĐỒ THỊ QUAN HỆ QUỐC TẾ</h3>
                </div>
                <div className="graph-body">
                  <div className="graph-body-relation">
                    {dataDraw && <Graph data={dataDraw} handleChooseEdge={(source:any, target:any) => handleChooseEdge(source, target)}/>}
                  </div>
                </div>
              </Col>
              <Col span={10}>
                <div className="graph-header">
                  <h3>THÔNG TIN SỰ KIỆN</h3>
                </div>
                <div className="graph-body">
                  {selectedLabelOptions.length > 0 && selectedOptions.length > 0 && (
                    <div className="graph-item">
                      <div className="graph-item-header">
                        <div>
                          <img src={selectedLabelOptions[0].img} alt="" className="item-header-img" />
                          <span>{selectedLabelOptions[0].id}</span>
                        </div>
                        <ArrowRightIcon />
                        <div>
                          <img src={selectedLabelOptions[1].img} alt="" className="item-header-img" />
                          <span>{selectedLabelOptions[1].id}</span>
                        </div>
                      </div>
                      <div className="graph-item-content">
                      {eventContent && eventContent[1] && (
                          <div className="graph-content-box negative">
                            <div className="box-shade">
                              <div className="box-shade-icon">
                                <Tooltip title="Tiêu cực">
                                  <CaretUpFilled className={styles.goodIcon} />
                                </Tooltip>
                              </div>
                              Tích cực ({eventContent[1].length})
                              </div>
                            <div className="box-collapse">
                            { 
                            eventContent[1].map((event:any, index:any) => (
                              <Collapse
                                expandIcon={({ isActive }) => (
                                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                )}
                                ghost
                                onChange={(value) => {
                                }}
                              >
                                <Collapse.Panel header={event.event_name} key="1">
                                  <div >
                                    {event.event_content}
                                  </div>
                                </Collapse.Panel>
                              </Collapse>
                            ))}
                          
                            </div>
                          </div>
                        )}
                        {eventContent && eventContent[2] && (
                          <div className="graph-content-box negative">
                            <div className="box-shade">
                              <div className="box-shade-icon">
                                <Tooltip title="Tiêu cực">
                                  <CaretDownFilled className={styles.badIcon}/>
                                </Tooltip>
                              </div>
                              Tiêu cực ({eventContent[2].length})
                              </div>
                            <div className="box-collapse">
                            { 
                            eventContent[2].map((event:any, index:any) => (
                              <Collapse
                                expandIcon={({ isActive }) => (
                                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                )}
                                ghost
                                onChange={(value) => {
                                }}
                              >
                                <Collapse.Panel header={event.event_name} key="1">
                                  <div >
                                    {event.event_content}
                                  </div>
                                </Collapse.Panel>
                              </Collapse>
                            ))}
                          
                            </div>
                          </div>
                        )}
                        {eventContent && eventContent[0] && (
                          <div className="graph-content-box neutral">
                            <div className="box-shade">
                              <div className="box-shade-icon">
                                <Tooltip title="Trung tính">
                                  <LineOutlined className={styles.normalIcon} />
                                </Tooltip>
                              </div>
                              Trung tính ({eventContent[0].length})
                            </div>
                            <div className="box-collapse">
                              {
                                eventContent[0].map((event:any, index:any) => (
                                  <Collapse
                                    expandIcon={({ isActive }) => (
                                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                                    )}
                                    ghost
                                    onChange={(value) => {
                                    }}
                                  >
                                    <Collapse.Panel header={event.event_name} key="1">
                                      <div >
                                        {event.event_content}
                                      </div>
                                    </Collapse.Panel>
                                  </Collapse>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      
      </Col>
    </Row>
  );
};

