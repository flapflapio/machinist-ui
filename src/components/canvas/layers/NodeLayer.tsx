import {
  ComponentPropsWithoutRef,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import {
  Graph,
  GraphAction,
  origin,
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
  }
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
  useEffect(() => graph.states.forEach((s) => adjust(s, s.location)), [
    graph,
    adjust,
  ]);

const useStateMapper = (onMouseDown: (s: GraphState, i: number) => void) =>
  useCallback(
    (s: GraphState, i: number) => (
      <State
        key={s.id}
        id={s.id}
        onMouseDown={() => onMouseDown(s, i)}
        style={{
          transform: `translate(
            calc(${s.location.x}px - 50%),
            calc(${s.location.y}px - 50%)
          )`,
        }}
      />
    ),
    [onMouseDown]
  );

const useMouseDown = (
  setStateAndIndex: Dispatch<SetStateAction<[GraphState, number]>>,
  startDragging: (i: number) => void
) =>
  useCallback(
    (s: GraphState, i: number) => {
      setStateAndIndex([s, i]);
      startDragging(i);
    },
    [setStateAndIndex, startDragging]
  );

const useDoubleClicker = <T,>(
  callback: (e: MouseEvent<T>) => void,
  numberOfClicks = 2,
  timeout = 200
): ((e: MouseEvent<T>) => void) => {
  const count = useRef(0);
  return useCallback(
    (e: MouseEvent<T>) => {
      count.current += 1;
      if (count.current >= numberOfClicks) callback(e);
      setTimeout(() => {
        count.current = 0;
      }, timeout);
    },
    [count, callback, numberOfClicks, timeout]
  );
};

const NodeLayer = ({ ...props }: NodeLayerProps): JSX.Element => {
  const { graph, dispatch } = useGraphAndGraphActions();
  const { dragging, startDragging, stopDragging } = useDragging(graph);
  const adjust = useAdjust();
  const mouseMove = useMouseMove({ graph, dispatch, dragging, adjust });
  const [stateAndIndex, setStateAndIndex] = useState<[GraphState, number]>([
    null,
    -1,
  ]);
  const onMouseDown = useMouseDown(setStateAndIndex, startDragging);
  const stateAndIndexToElement = useStateMapper(onMouseDown);
  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (
        stateAndIndex[0] &&
        stateAndIndex[1] >= 0 &&
        stateAndIndex[1] < dragging.length
      ) {
        mouseMove(...stateAndIndex)(e);
      }
    },
    [stateAndIndex, mouseMove, dragging]
  );

  const doubleClick = useDoubleClicker(
    useCallback(
      (e: MouseEvent<HTMLDivElement>) =>
        dispatch({
          type: "ADD",
          state: {
            id: "q_",
            ending: false,
            location: graph.eventToSvgCoords(e),
            ref: null,
          },
        }),
      [dispatch, graph]
    )
  );

  usePassiveAdjust(graph, adjust);

  return (
    <Root
      {...props}
      onClick={doubleClick}
      onMouseUp={stopDragging}
      onMouseMove={onMouseMove}
    >
      {graph.states.map(stateAndIndexToElement)}
    </Root>
  );
};

export default NodeLayer;
