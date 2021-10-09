import { ComponentPropsWithoutRef, memo, useEffect, useRef } from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import {
  Graph,
  Offset,
  Point,
  Transition as GraphTransition,
  useGraphActions,
} from "../../data/graph";

const svgNs = "http://www.w3.org/2000/svg";

const Line: StyledComponent<"line", DefaultTheme> = styled.line.attrs(
  ({ ...attrs }) => ({
    xmlns: svgNs,
  })
)``;

type TransitionProps = ComponentPropsWithoutRef<"line"> & {
  id: string;
  transition?: GraphTransition;
  graph?: Graph;
};

const Transition = memo(
  ({ id, transition, graph, ...props }: TransitionProps): JSX.Element => {
    const me = useRef<SVGLineElement>(null);
    const { modifyTransition } = useGraphActions();

    useEffect(() => {
      modifyTransition({ id, ref: me });
      return () => modifyTransition({ id, ref: null });
    }, []);

    const state = (
      s: { state: string; offset: Offset },
      scalingFactor = 1
    ): Point =>
      graph.throwPointToStateEdge({
        stateId: s.state,
        offset: s.offset,
        scalingFactor,
      });

    const start: Point = state(transition.start);
    const end: Point = state({ ...transition.end, offset: { x: -1, y: -1 } });

    return (
      <Line
        ref={me}
        stroke="black"
        x1={`${start.x}`}
        y1={`${start.y}`}
        x2={`${end.x}`}
        y2={`${end.y}`}
        {...props}
      />
    );
  }
);

Transition.displayName = "Transition";

export default Transition;
export { svgNs };
export type { TransitionProps };
