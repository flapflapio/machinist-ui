import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  FC,
  forwardRef,
  memo,
  useEffect,
  useRef,
} from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import {
  Graph,
  midPoint,
  Offset,
  Point,
  Transition as GraphTransition,
  TransitionInProgress as GraphTransitionInProgress,
  useGraph,
} from "../../data/graph";

const svgNs = "http://www.w3.org/2000/svg";

const Line: StyledComponent<"line", DefaultTheme> = styled.line.attrs(() => ({
  xmlns: svgNs,
  style: { fill: "yellow" },
}))``;

type TransitionProps = ComponentPropsWithoutRef<"line"> & {
  id: string;
  transition?: GraphTransition;
  graph?: Graph;
};

type TransitionInProgressProps = ComponentPropsWithoutRef<"line"> & {
  transitionInProgress: GraphTransitionInProgress;
  graph: Graph;
};

const point = ({
  graph,
  state,
  scalingFactor = 1,
}: {
  graph: Graph;
  state: { state: string; offset?: Offset; point?: Point };
  scalingFactor?: number;
}): Point =>
  graph.throwPointToStateEdge({
    stateId: state.state,
    offset: state.offset,
    point: state.point,
    scalingFactor,
  });

/**
 * TODO| this component is coded in a very hacky way. It needs a major
 * TODO| refactoring.
 */
const ArrowTransition: FC<
  Omit<ComponentPropsWithRef<"line">, "start" | "end"> & {
    start: Point;
    end: Point;
    endState?: string;
    graph: Graph;
  }
> = forwardRef(
  ({ start, end, endState, graph, ...props }, ref): JSX.Element => {
    const mid = midPoint(start, end);
    // const line = computeLine(end, mid);
    // const angleBetweenLines = Math.atan((line.a * line.b) / line.b ** 2);
    const stateEdgeTransform = !endState
      ? { x: 0, y: 0 }
      : (() => {
          const edge = point({
            graph,
            state: { state: endState, point: mid },
          });
          return {
            x: edge.x - end.x,
            y: edge.y - end.y,
          };
        })();

    // const arrow = (
    //   <path
    //     style={{
    //       position: "absolute",
    //       inset: "0 auto auto 0",
    //       transform: `
    //         translate(
    //           calc(${end.x}px - 3em + ${stateEdgeTransform.x}px),
    //           calc(${end.y}px - 7px + ${stateEdgeTransform.y}px)
    //         )
    //         scale(1.1)
    //       `,
    //     }}
    //     d="M 35.88 7 L 28.88 10.5 L 30.63 7 L 28.88 3.5 Z"
    //     fill="rgba(0, 0, 0, 1)"
    //     stroke="rgba(0, 0, 0, 1)"
    //     strokeMiterlimit="10"
    //     pointerEvents="all"
    //   />
    // );

    // TODO: This is a temporary "arrow" - it is just a circle
    const arrow = (
      <circle
        cx="0"
        cy="0"
        r="6"
        style={{
          position: "absolute",
          inset: "0 auto auto 0",
          transform: `
            translate(
              calc(${end.x}px + ${stateEdgeTransform.x}px),
              calc(${end.y}px + ${stateEdgeTransform.y}px)
            )
            scale(1.1)
          `,
        }}
      />
    );

    return (
      <g>
        <Line
          ref={ref}
          stroke="#0390fc"
          strokeWidth={5}
          x1={`${start.x}`}
          y1={`${start.y}`}
          x2={`${end.x}`}
          y2={`${end.y}`}
          {...props}
        />
        {arrow}
      </g>
    );
  }
);

ArrowTransition.displayName = "DrawnLine";

const TransitionInProgress = memo(
  ({
    transitionInProgress: {
      end,
      start: { state },
    },
    graph,
    ...props
  }: TransitionInProgressProps): JSX.Element => {
    const me = useRef<SVGLineElement>(null);
    const { dispatch } = useGraph();

    useEffect(
      () =>
        dispatch({
          type: "ADD",
          transitionInProgress: {
            ref: me,
          },
        }),
      [dispatch]
    );

    // ??? For now, we will attach the transitions to the center of each state
    // const start = point({
    //   graph,
    //   state: {
    //     state,
    //     point: midPoint(graph.pointForState(state), end),
    //   },
    // });

    const start = graph.pointForState(state);
    return (
      <ArrowTransition
        graph={graph}
        ref={me}
        start={start}
        end={end as any}
        {...props}
      />
    );
  }
);

/**
 * TODO| refactor this arrow so that it is dynamic and looks identical to the
 * TODO| transitions
 */
const Arrow = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="46px"
    height="16px"
    viewBox="-0.5 -0.5 46 16"
  >
    <defs />
    <g>
      <path
        d="M 7 7 L 30.63 7"
        fill="none"
        stroke="rgba(0, 0, 0, 1)"
        strokeMiterlimit="10"
        pointerEvents="stroke"
      />
      <path
        d="M 35.88 7 L 28.88 10.5 L 30.63 7 L 28.88 3.5 Z"
        fill="rgba(0, 0, 0, 1)"
        stroke="rgba(0, 0, 0, 1)"
        strokeMiterlimit="10"
        pointerEvents="all"
      />
    </g>
  </svg>
);

const Transition = memo(
  ({ id, transition, graph, ...props }: TransitionProps): JSX.Element => {
    const me = useRef<SVGLineElement>(null);
    const { modifyTransition } = useGraph();

    useEffect(() => {
      modifyTransition({ id, ref: me });
      // return () => modifyTransition({ id, ref: null });
    }, []);

    const startState = graph.pointForState(transition.start.state);
    const endState = graph.pointForState(transition.end.state);
    const mid = midPoint(startState, endState);
    const offsetPoint = (state: string) =>
      point({
        graph,
        state: { state, point: mid },
      });

    // ??? For now, we will attach the transitions to the center of each state
    // const start = offsetPoint(transition.start.state);
    // const end = offsetPoint(transition.end.state);

    const start = startState;
    const end = endState;
    return (
      <ArrowTransition
        graph={graph}
        endState={transition.end.state}
        ref={me}
        start={start}
        end={end as any}
        {...props}
      />
    );
  }
);

Transition.displayName = "Transition";
TransitionInProgress.displayName = "TransitionInProgress";

export default Transition;
export { svgNs, Line, Transition, TransitionInProgress, Arrow };
export type { TransitionProps };
