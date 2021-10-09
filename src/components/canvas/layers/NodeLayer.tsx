import {
  ComponentPropsWithoutRef,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import {
  Graph,
  GraphAction,
  Offset,
  Point,
  State as GraphState,
  useGraphAndGraphActions,
} from "../../data/graph";
import { State, StateRoot } from "../node/State";

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: absolute !important;
  inset: 0 auto auto 0;
  z-index: 10;
  box-sizing: border-box;

  & > ${StateRoot} {
    position: absolute;
    /* inset: -50% auto auto -50%; */
  }

  /* !!! DEBUG !!! */
  border: 5px solid yellow;
  /* !!! DEBUG !!! */
`;

type NodeLayerProps = ComponentPropsWithoutRef<"div">;

const useDragging = (
  graphOrSize: Graph | number
): {
  dragging: boolean[];
  setDragging: Dispatch<SetStateAction<boolean[]>>;
  startDragging: (i: number) => void;
  stopDragging: () => void;
} => {
  const toFalse = () => false;
  const createBoolArray = useCallback(
    () =>
      (typeof graphOrSize === "number"
        ? [...Array(graphOrSize).keys()]
        : graphOrSize.states
      ).map(toFalse),
    [graphOrSize]
  );
  const [dragging, setDragging] = useState<boolean[]>(createBoolArray());

  useEffect(
    () =>
      setDragging((d) =>
        createBoolArray().map((b, i) => (i < d.length ? d[i] : false))
      ),
    [setDragging, createBoolArray]
  );

  return useMemo(
    () => ({
      dragging,
      setDragging,
      startDragging: (i) =>
        setDragging((d) =>
          i >= 0 && i < d.length ? d.map((_, ii) => ii === i) : d
        ),
      stopDragging: () => setDragging((d) => d.map(toFalse)),
    }),
    [dragging, setDragging]
  );
};

const useAdjust = () =>
  useCallback((s: GraphState, p: Point) => {
    if (!s?.ref?.current) return;
    const coords = p;
    const me = s.ref.current;
    me.style.transform = `translate(
      calc(${coords.x}px - 50%),
      calc(${coords.y}px - 50%)
    )`;
  }, []);

const useMouseMove = ({
  graph,
  dragging,
  adjust,
  dispatch,
}: {
  graph: Graph;
  dragging: boolean[];
  adjust: (s: GraphState, p: Point) => void;
  dispatch: Dispatch<GraphAction>;
}) =>
  useCallback(
    (s: GraphState, i: number) => (e: MouseEvent<HTMLDivElement>) => {
      if (!dragging[i]) return;
      const coords = graph.eventToSvgCoords(e);
      adjust(s, coords);
      dispatch({ type: "ADD", state: { ...s, location: coords } });
    },
    [dragging, graph, adjust, dispatch]
  );

const usePassiveAdjust = (
  graph: Graph,
  adjust: (s: GraphState, p: Point) => void
) =>
  useEffect(() => {
    graph.states.forEach((s) => {
      adjust(s, s.location);
    });
  }, [graph, adjust]);

const NodeLayer = ({ ...props }: NodeLayerProps): JSX.Element => {
  // HOOKS
  const { graph, dispatch } = useGraphAndGraphActions();
  const { dragging, startDragging, stopDragging } = useDragging(graph);
  const adjust = useAdjust();
  const onMouseMove = useMouseMove({ graph, dispatch, dragging, adjust });
  const [stateAndIndex, setStateAndIndex] = useState<[GraphState, number]>([
    null,
    -1,
  ]);

  // EFFECTS
  usePassiveAdjust(graph, adjust);

  // RENDER
  return (
    <Root
      {...props}
      onMouseUp={stopDragging}
      onMouseMove={() => {
        if (
          stateAndIndex[0] &&
          stateAndIndex[1] >= 0 &&
          stateAndIndex[1] <= dragging.length
        ) {
          onMouseMove(...stateAndIndex);
        }
      }}
    >
      {graph.states.map((s, i) => (
        <State
          key={s.id}
          id={s.id}
          onMouseDown={() => {
            setStateAndIndex([s, i]);
            startDragging(i);
          }}
          style={{
            transform: `translate(
              calc(${s.location.x}px - 50%),
              calc(${s.location.y}px - 50%)
            )`,
          }}
        />
      ))}
    </Root>
  );
};

export default NodeLayer;
