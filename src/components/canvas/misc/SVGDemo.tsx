import { Button } from "antd";
import { MouseEvent, useCallback, useRef } from "react";
import styled from "styled-components";
import { Graph, Offset, Point } from "../../data/graph";

/**
 * TODO: REMOVE THIS HOOK
 *
 * @deprecated This adjust hook uses manual adjusting of the transitions, use
 * below instead (let React do the adjusting)
 */
const useAdjustOLD = (graph: Graph) =>
  useCallback(
    (s, p: Point) => {
      if (!s?.ref?.current) return;
      const coords = p;
      const me = s.ref.current;
      me.style.transform = `translate(
       calc(${coords.x}px - 50%),
       calc(${coords.y}px - 50%)
     )`;

      graph.transitions.forEach((t) => {
        if (!t?.ref?.current) return;
        const tt = t.ref.current;
        const point = (
          ss: { state: string; offset: Offset },
          scalingFactor = 1
        ): Point =>
          graph.throwPointToStateEdge({
            stateId: ss.state,
            offset: ss.offset,
            scalingFactor,
          });

        const start = point(t.start);
        const end: Point = point({
          ...t.end,
          offset: { x: -1, y: -1 },
        });

        if (t.start.state === s.id) {
          tt.setAttribute("x1", `${start.x}`);
          tt.setAttribute("y1", `${start.y}`);
        }

        if (t.end.state === s.id) {
          tt.setAttribute("x2", `${end.x}`);
          tt.setAttribute("y2", `${end.y}`);
        }
      });
    },
    [graph]
  );

const newSVGLine = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
} = {}): SVGLineElement => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.style.display = "block";
  line.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  line.setAttribute("x1", `${x1 ?? "0"}`);
  line.setAttribute("y1", `${y1 ?? "0"}`);
  line.setAttribute("x2", `${x2 ?? "0"}`);
  line.setAttribute("y2", `${y2 ?? "0"}`);
  line.setAttribute("stroke", "black");
  return line;
};

const newSVGCircle = (): SVGCircleElement => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  circle.setAttribute("cx", "10");
  circle.setAttribute("cy", "10");
  circle.setAttribute("r", "10");
  circle.setAttribute("stroke", "black");
  return circle;
};

const SelectableSVG = styled.svg.attrs({
  viewBox: "0 0 200 200",
  xmlns: "http://www.w3.org/2000/svg",
})<{ $selected?: boolean }>`
  ${({ $selected }) =>
    $selected &&
    `
      border: 1px solid black;
    `}
`;

const Demo = (): JSX.Element => {
  const root = useRef<SVGSVGElement>(null);
  const active = useRef<SVGElement>(null);

  const getCoords = (e: MouseEvent<SVGSVGElement>) => {
    if (!root.current) return null;
    const ctm = root.current.getScreenCTM();
    return {
      x: (e.clientX - ctm.e) / ctm.a,
      y: (e.clientY - ctm.f) / ctm.d,
    };
  };

  return (
    <>
      <SelectableSVG
        $selected
        ref={root}
        onMouseDown={(e) => {
          if (!root.current) return;
          const coords = getCoords(e);
          active.current = newSVGLine({
            x1: coords.x,
            y1: coords.y,
            x2: coords.x,
            y2: coords.y,
          });
          root.current.appendChild(active.current);
        }}
        onMouseUp={(e) => {
          active.current = null;
        }}
        onMouseMove={(e) => {
          if (!active.current || !root.current) return;
          const coords = getCoords(e);
          active.current.setAttribute("x2", `${coords.x}`);
          active.current.setAttribute("y2", `${coords.y}`);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          if (!root.current) return;
          while (root.current.lastElementChild) {
            root.current.removeChild(root.current.lastElementChild);
          }
        }}
      >
        CLEAR
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: "5px" }}
        onClick={() => {
          if (!root.current) return;
          const circle = newSVGCircle();
          root.current.appendChild(circle);
        }}
      >
        NEW NODE
      </Button>
    </>
  );
};

export default Demo;
export { newSVGLine, newSVGCircle, SelectableSVG };
