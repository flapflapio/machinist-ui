import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Graph,
  GraphAction,
  Point,
  State as GraphState,
} from "../../../data/graph";
import { State } from "../../node/State";

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

const useAdjust = (): ((s: GraphState, p: Point) => void) =>
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
}): ((s: GraphState, i: number) => (e: MouseEvent<HTMLDivElement>) => void) =>
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
): void =>
  useEffect(() => graph.states.forEach((s) => adjust(s, s.location)), [
    graph,
    adjust,
  ]);

const useStateMapper = (
  onMouseDown: (s: GraphState, i: number) => void
): ((s: GraphState, i: number) => JSX.Element) =>
  useCallback(
    (s: GraphState, i: number) => (
      <State
        key={s.id}
        id={s.id}

        // We want the state to remain selected even after moving it. There is
        // an onClick handler in the NodeLayer such that if you click once on
        // the bare canvas, the currently selected node is deselected.
        onClick={(e) => e.stopPropagation()}

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
): ((s: GraphState, i: number) => void) =>
  useCallback(
    (s: GraphState, i: number) => {
      setStateAndIndex([s, i]);
      startDragging(i);
    },
    [setStateAndIndex, startDragging]
  );

const useDoubleClicker = <T,>(
  onDouble: (e: MouseEvent<T>) => void,
  onSingle: (e: MouseEvent<T>) => void = () => null,
  numberOfClicks = 2,
  timeout = 200
): ((e: MouseEvent<T>) => void) => {
  const count = useRef(0);
  return useCallback(
    (e: MouseEvent<T>) => {
      count.current += 1;
      if (count.current >= numberOfClicks) {
        onDouble(e);
      } else {
        onSingle(e);
      }
      setTimeout(() => {
        count.current = 0;
      }, timeout);
    },
    [count, onDouble, onSingle, numberOfClicks, timeout]
  );
};

export {
  useAdjust,
  useCallback,
  useDoubleClicker,
  useDragging,
  usePassiveAdjust,
  useMouseDown,
  useMouseMove,
  useStateMapper,
};
