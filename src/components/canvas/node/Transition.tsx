import { ComponentPropsWithoutRef, memo, useEffect, useRef } from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import {
  Graph,
  Offset,
  Point,
  Transition as GraphTransition,
  useGraphActions,
  computeLine,
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

/**
 * These are some notes that I am taking while implementing the auto-adjustment
 * for the transitions.
 *
 * The auto-adjust should work something like:
 *
 *
 */
const Transition = memo(
  ({ id, transition, graph, ...props }: TransitionProps): JSX.Element => {
    const me = useRef<SVGLineElement>(null);
    const { modifyTransition } = useGraphActions();

    useEffect(() => {
      modifyTransition({ id, ref: me });
      // return () => modifyTransition({ id, ref: null });
    }, []);

    const point = (
      s: { state: string; offset?: Offset; point?: Point },
      scalingFactor = 1
    ): Point =>
      graph.throwPointToStateEdge({
        stateId: s.state,
        offset: s.offset,
        point: s.point,
        scalingFactor,
      });

    const midPoint = (p1: Point, p2: Point): Point => ({
      x: Math.min(p2.x, p1.x) + Math.abs(p2.x - p1.x) / 2,
      y: Math.min(p2.y, p1.y) + Math.abs(p2.y - p1.y) / 2,
    });

    const startState = graph.pointForState(transition.start.state);
    const endState = graph.pointForState(transition.end.state);
    const mid = midPoint(startState, endState);
    const offsetPoint = (state: string) =>
      point({
        state,
        point: mid,
      });

    const start = offsetPoint(transition.start.state);
    const end = offsetPoint(transition.end.state);

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
export { svgNs, Line };
export type { TransitionProps };
