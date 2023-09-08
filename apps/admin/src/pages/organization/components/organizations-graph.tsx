import G6 from "@antv/g6";
import { useEffect, useRef, useState } from "react";

// let graph:any = null;
const Graph = ({data, handleChooseEdge} : {data:any, handleChooseEdge:any}) => {
  const [data1, setData] = useState<any>({
    // nodes: [
    //   { 
    //     id: "node1",
    //     // label: "1",
    //     img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEX///8AOabVKx7c3Ny6MijXKx36+/4ANqYAOaPRKx0YPJO/v7/Y2dsIOZQANqgAOagNPJG2MiijNi/vywmdAAABcklEQVR4nO3Q0VHCQABAwdNEo0EI0H+xMnzl5rWwW8KOy8LsMpbBbHESTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk5qGX/jm7PXyPW2cXa7jn07ONv2sR8fnB1Owkk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JS7xNm+7j/MLuPxy+zx1i/mK2vk0/OnJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpN4nzNbxXJk9/wEL1hiQSef+/AAAAABJRU5ErkJggg=='
        
    //   },
    //   { 
    //     id: "node2", 
    //     // label: "2",
    //     img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAACWCAMAAADUtKzmAAAAclBMVEWyIjT///88O27WiJK4M0TQeIO+RFPKZnPEVWNbQWxGRXXz8/ZEQ3RJSHg/PnBwb5VjYotWVYHLy9h9fJ7f3+eMjKpbW4Xs7PGsrMJ0c5i4uMpOTXz4+PqenbeXlrKxscXDw9PKytiCgqLa2uSkpLvb2+QUHNzpAAAEN0lEQVR4nO2da5eaWBBFvTczyQwgIk+f0Vb7///FgCDNI1Nr1cSyrLXO/kA651OdTatc+tK98C9nYQjYoYAdin7o/byHTKTdmEM/9HneSCbSbszhMXPpymkhoUi7MYf7wEmW7dwuy5KvOnKRdmMO94GDnWs4L78ayUXajTl0BX7W0/8cvxikIu3GHPrxD/NGMpF2Yw7dyNfT8nYdN5KKtBtzaCcOtvVhG9y/jiLRyH+zw2+ulbNMNPLODr+xs9uJRobtBKvVKgzrQyASGbfjL4cmPRRCkXE7fl05V63FIuN24tC5MBaLjNtZVdtVtRKLrNppr0x8tvd+n4lFVu1spudYKtKuzKC3s3azt0+hSLsyg9ZOmSQ3d0uSwU0ruUi7MoPWzjq9/+c6OOVy0V926F5Z8aaefjP68BWLtNfdHLr5i3r8yUWtVKTdmEM3cpqW549xI6lIuzGHduKgObFFu1yMY9HIoJ0hq9nV7VMj43ZO82u5Z0aG7UTr9bqq6kMkEhm3Ex/by6DBB/IzI+N2mnW1c7Ol9vMi43Z800gwsm0nORTFIRGLav62w5ed7t3hUrcpL2KRN7gKbZj8bFcu0q7MoLezPMw2bAlF2pUZtHaWy2Xhivo4qCMWaVdm0NppPnprqu1XI7no1RX/gO6VtTy78YYkwUizLpPH+86l/vriR0hFmnWZPOyc8yyf7BSVirQrM+jsRKfIR7fRdgCxSLsyg8d95cExSUQjg3aG3G6ikXE7+Xzh+MzIf7fD9O7XKWz2TYSnSCS6o73u5jA9s8VhtiHpmZFxOz53LheMbNsp3WYzeQjkmZFxO0XmfVaIRVbtXNp/4v4gEhm1E4WTjbNikXZjDo+ZMzfbli4UaTfmcB949ZmHLsw/Bz9dkYu0G3No5y+v9XVzPvp4EYu0G3Pov/Pd9OUgFf2ww8POLjyGkyc+pCKdBeX/4nEH47z3+914N5tUpF2ZwePuVzN53C4Xy1I0MmhnyPEoGhm383kVjQzbCU7X+sP3ej0FIpFxO92WpNGGpGdGxu1435xvwci2nbVL08lDIM+MjNspjrEvCrHIqp1uV8CyP4hERu3E1ewBTqHoHzv0drZuO20kFGmvuzm0s3+kucvTj0EpuUi7MYd2/vv+o2p0xsUi7cYcuvlfeH9HuzGHbuTNYXeYPPEhFWk35tBOHKeJT9LxPRmpSLsxh3biqFkpBqPtAGKRdmMO/uVoN+YAOxSwQ/Hvy9FeHjBY6CzvjAA7FLBDATsUsEMBOxSwQwE7FLBDATsUsEOx0N589tZoL4IBAAAAAAB4W7QfiH9rsAqlgB0K2KGAHQrYoYAdCtihgB0K2KGAHQrYoVho/4Lnt0Z7EQwAAAAAAMDbov1HJ98arEIpYIcCdihghwJ2KGCHAnYoYIcCdihghwJ2KBbfwH+jvQgGAAAAAAAAWOQXSUw20+VREl0AAAAASUVORK5CYII="
    //   },
    //   { 
    //     id: "node3",
    //     // label: "3",
    //     img: "data:image/png;base64,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"
    //   },
    // ],
    // edges: [
    //   { source: "node1", target: "node2", label: "edge1" },
    //   { source: "node2", target: "node1", label: "edge2" },
    //   { source: "node3", target: "node2", label: "edge3" },
      
    // ],
  });
  
  const ref = useRef(null);

  const createGraph = (ref:React.MutableRefObject<any>, data:any) => {
    let graph:any = null;
    if (!graph) {
      graph = new G6.Graph({
        container: ref.current || "",
        animate: true,
        width: 650,
        height: 650,
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"],
        },
        defaultNode: {
          type: 'image',
          shape: "circle",
          size: [60],
          
          clipCfg: {
            show: true,
            type: 'circle',
            r: 30,
          },

          labelCfg: {
            style: {
              fontWeight: "bold"
            }
          },

          style: {
            cursor: 'pointer',
            shadowOffsetX: 10,
            shadowOffsetY: 10,
            shadowColor: "#d6d6d6",
            shadowBlur: 10,
            opacity: 0.8,
            // filter: "blur" 
          },
        },
        defaultEdge: {
          type: 'quadratic',
          // type: 'polyline',
          // type: "line",
          
          labelCfg: {
            refY: 10,
            refX: 40,

            style: {
              fontSize: 13,
              // fontWeight: "bold",
              // fill: "#008000"
            }
          },

          
          style: {
            lineWidth: 2,
            stroke: '#5172a9',
            // startArrow: {
            //   path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
            //   fill: '#234170',
            // },
            endArrow: {
              // path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
              path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
              fill: '#557bb9',
            },
          },
        },
        
      });
    }

    // Click an edge
    graph.on('edge:click', (e: any) => {
      // const source = e.item._cfg.source._cfg.id;
      // const target = e.item._cfg.target._cfg.id;
      const source = {id: e.item._cfg.source._cfg.id, img: e.item._cfg.source._cfg.model.img};
      const target = {id: e.item._cfg.target._cfg.id, img: e.item._cfg.target._cfg.model.img};
      handleChooseEdge(source, target);
    });

    // graph.refresh();
    graph.data(data);
    graph.render();

    return graph;
  }

  useEffect(() => {
    const graph = createGraph(ref,data);

    // return () => {
    //   graph.changeData(data);
    // };
    return () => {
      graph.destroy();
    };
  }, [data]);

  return <><div ref={ref}></div></>
};

export default Graph;