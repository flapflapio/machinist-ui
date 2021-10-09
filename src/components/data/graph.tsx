import {
  createContext,
  Dispatch,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

type Point = {
  x: number;
  y: number;
};

type Offset = Point;

/**
 * These values correspond to the attributes of the SVG `viewBox` property
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 */
type Size = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

type State = {
  id: string;
  ending: boolean;
  location: Point;
  ref: MutableRefObject<HTMLDivElement>;
};

type Transition = {
  id: string;
  start: { state: string; offset: Offset };
  end: { state: string; offset: Offset };
  symbol: string;
  ref: MutableRefObject<SVGLineElement>;
};

type Graph = {
  root: MutableRefObject<SVGSVGElement>;
  size: Size;
  starting: State;
  states: State[];
  transitions: Transition[];

  vb: () => string;
  clientCoordsToSvgCoords: (p: Point) => Point;
  svgCoordsToClientCoords: (p: Point) => Point;
  eventToSvgCoords: (e: MouseEvent<unknown>) => Point;
  throwPointToStateEdge: ({
    stateId,
    point,
    offset,
    scalingFactor,
  }: {
    stateId: string;
    point?: Point;
    offset?: Offset;
    scalingFactor?: number;
  }) => Point;
};

type GraphActionType =
  | "ADD"
  | "REMOVE"
  | "CLEAR"
  | "STEP"
  | "MANIPULATE"
  | "SET_ROOT"
  | "SET_SIZE";

type GraphAction = {
  type: GraphActionType;

  ids?: string[];
  state?: State;
  states?: State[];
  transition?: Transition;
  transitions?: Transition[];
  manipulation?: (graph: Graph) => Graph;
  root?: MutableRefObject<SVGSVGElement>;
  size?: Size | ((s: Size) => Size);
};

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

type GraphActionsContextType = {
  dispatch: Dispatch<GraphAction>;
  setSize: (size: Size) => void;
  setRoot: (root: MutableRefObject<SVGSVGElement>) => void;
  deleteElement: (id: string) => void;
  modifyState: (partialState: PartialExcept<State, "id">) => void;
  modifyTransition: (
    partialTransition: PartialExcept<Transition, "id">
  ) => void;
};

const origin = (): Point => ({ x: 0, y: 0 });

const computeLine = (p1: Point, p2: Point): { a: number; b: number } => {
  const a = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - a * p1.x;
  return { a, b };
};

const computeThirdPoint = (
  radius: number,
  line: { a: number; b: number },
  p1: Point,
  p2: Point
): Point => {
  // These are 3 coeffecients for a quadratic equation:
  // e * p3.x^2 + f * p3.x + g
  const e = line.a ** 2 + 1;
  const f = 2 * line.a * line.b - line.a * p1.y - line.a * p1.y - 2 * p1.x;
  const g =
    line.b ** 2 - 2 * line.b * p1.y + p1.y ** 2 + p1.x ** 2 - radius ** 2;

  const quadraticPlusOrMinusPiece = Math.sqrt(f ** 2 - 4 * e * g);
  const useMinus = p2.x < p1.x;

  // Finally, we compute the result
  const x =
    (useMinus
      ? -f - quadraticPlusOrMinusPiece
      : -f + quadraticPlusOrMinusPiece) /
    (2 * e);
  const y = line.a * x + line.b;
  return { x, y };
};

const pointIsAtEdgeOfCircle = (
  centerPoint: { x: number; y: number },
  mousePoint: { x: number; y: number },
  radius: number,
  scalingFactor: number
): boolean =>
  Math.sqrt(
    (mousePoint.x - centerPoint.x) ** 2 + (mousePoint.y - centerPoint.y) ** 2
  ) >
  scalingFactor * radius;

const blankGraph = (): Graph => ({
  size: { minX: 0, minY: 0, height: 200, width: 200 },

  root: null,
  starting: null,
  states: [],
  transitions: [],

  vb() {
    return (
      `${this?.size?.minX} ` +
      `${this?.size?.minY} ` +
      `${this?.size?.width} ` +
      `${this?.size?.height}`
    );
  },

  clientCoordsToSvgCoords({ x, y }) {
    if (!this?.root?.current) return origin();
    const ctm = this.root.current.getScreenCTM();
    return {
      x: (x - ctm.e) / ctm.a,
      y: (y - ctm.f) / ctm.d,
    };
  },

  eventToSvgCoords(e) {
    return (this as Graph)?.clientCoordsToSvgCoords({
      x: e.clientX,
      y: e.clientY,
    });
  },

  svgCoordsToClientCoords({ x, y }) {
    if (!this?.root?.current) return origin();
    const ctm = this.root.current.getScreenCTM();
    return {
      x: ctm.a * x + ctm.e,
      y: ctm.d * y + ctm.f,
    };
  },

  throwPointToStateEdge(
    { stateId, point, offset, scalingFactor } = { stateId: "q0" }
  ) {
    const state = (this?.states as State[])?.find((s) => s.id === stateId);

    if (!state || !state?.ref?.current) return origin();

    const rect = state.ref.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerPoint = { x: rect.left + radius, y: rect.top + radius };

    if (!point && !offset) return centerPoint || origin();

    const newPoint =
      point ||
      (offset
        ? {
            x: centerPoint.x + (offset.x === 0 ? 1 : offset.x),
            y: centerPoint.y + (offset.y === 0 ? 1 : offset.y),
          }
        : { x: centerPoint.x + 1, y: centerPoint.y + 1 });

    const line = computeLine(centerPoint, newPoint);
    const pointThree = computeThirdPoint(radius, line, centerPoint, newPoint);
    const scaling = scalingFactor || 0.9;
    return (this as Graph).clientCoordsToSvgCoords({
      x: scaling * pointThree.x,
      y: scaling * pointThree.y,
    });
  },
});

const GraphContext = createContext<Graph>(blankGraph());
const GraphActionsContext = createContext<GraphActionsContextType>({
  dispatch: () => null,
  modifyState: () => null,
  modifyTransition: () => null,
  deleteElement: () => null,
  setRoot: () => null,
  setSize: () => null,
});

const utils = {
  extractStates: (action: GraphAction): State[] =>
    action.state
      ? [...(action.states || []), action.state]
      : action.states || [],

  extractTransitions: (action: GraphAction): Transition[] =>
    action.transition
      ? [...(action.transitions || []), action.transition]
      : action.transitions || [],
};

const sizeEqualsSize = (size1: Size, size2: Size): boolean =>
  size1 === size2 ||
  (size1?.width === size2?.width &&
    size2?.height === size1?.height &&
    size2?.minX === size1?.minX &&
    size2?.minY === size1?.minY);

/**
 * Some reducers for handling each case in {@link GraphActionType}
 */
const reducers: {
  [A in GraphActionType]: (store: Graph, action: GraphAction) => Graph;
} = {
  ADD: (store, action) =>
    action.state || action.states || action.transition || action.transitions
      ? {
          ...store,
          states: (() => {
            const addMe = utils.extractStates(action);
            const brandNewStates = addMe.filter(
              (s) => !store.states.map((ss) => ss.id).includes(s.id)
            );
            return [
              ...store.states.map((s) => ({
                ...s,
                ...(addMe.find((ss) => ss.id === s.id) || {}),
              })),
              ...brandNewStates,
            ];
          })(),
          transitions: (() => {
            const addMe = utils.extractTransitions(action);
            const brandNewTransitions = addMe.filter(
              (t) => !store.transitions.map((tt) => tt.id).includes(t.id)
            );
            return [
              ...store.transitions.map((t) => ({
                ...t,
                ...(addMe.find((tt) => tt.id === t.id) || {}),
              })),
              ...brandNewTransitions,
            ];
          })(),
        }
      : store,

  REMOVE: (store, action) =>
    action.ids && action.ids.length > 0
      ? {
          ...store,
          states: store.states.filter((s) => !action.ids.includes(s.id)),
          transitions: store.transitions.filter(
            (t) => !action.ids.includes(t.id)
          ),
        }
      : store,

  CLEAR: (store) => ({ ...store, states: [], transitions: [] }),

  STEP: (store) => store,

  MANIPULATE: (store, action) =>
    action.manipulation ? action.manipulation(store) : store,

  SET_ROOT: (store, action) =>
    action.root !== store.root ? { ...store, root: action.root } : store,

  SET_SIZE: (store, action) =>
    action.size &&
    ((s): s is Size => typeof action.size !== "function")(action.size)
      ? !sizeEqualsSize(action.size, store.size)
        ? { ...store, size: action.size }
        : store
      : (() => {
          const size = (action.size as (s: Size) => Size)(store.size);
          return !sizeEqualsSize(size, store.size) ? { ...store, size } : store;
        })(),
};

const reducer = (store: Graph, action: GraphAction): Graph =>
  action && action.type in reducers
    ? reducers[action.type](store, action)
    : store;

const GraphProvider = ({
  children,
}: { children?: ReactNode } = {}): JSX.Element => {
  const [graph, dispatch] = useReducer(reducer, null, blankGraph);

  const deleteElement = useCallback(
    (id: string) => dispatch({ type: "REMOVE", ids: [id] }),
    [dispatch]
  );

  const modifyState = useCallback(
    (partialState: PartialExcept<State, "id">) =>
      dispatch({
        type: "ADD",
        state: {
          ...(graph.states.find((s) => s.id === partialState.id) || {
            ...partialState,
            ending: false,
            location: origin(),
            ref: null,
          }),
          ...partialState,
        },
      }),
    [graph, dispatch]
  );

  const modifyTransition = useCallback(
    (partialTransition: PartialExcept<Transition, "id">) =>
      dispatch({
        type: "ADD",
        transition: {
          ...(graph.transitions.find((t) => t.id === partialTransition.id) || {
            ...partialTransition,
            end: null,
            start: null,
            ref: null,
            symbol: null,
          }),
          ...partialTransition,
        },
      }),
    [graph, dispatch]
  );

  const setRoot = useCallback(
    (root: MutableRefObject<SVGSVGElement>) =>
      dispatch({ type: "SET_ROOT", root }),
    [dispatch]
  );

  const setSize = useCallback(
    (size: Size) => dispatch({ type: "SET_SIZE", size }),
    [dispatch]
  );

  const pkg = useMemo(
    () => ({
      dispatch,
      modifyState,
      modifyTransition,
      deleteElement,
      setRoot,
      setSize,
    }),
    [dispatch, modifyState, modifyTransition, deleteElement, setRoot, setSize]
  );

  return (
    <GraphActionsContext.Provider value={pkg}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </GraphActionsContext.Provider>
  );
};

const useGraph = (): Graph => useContext(GraphContext);

const useGraphActions = (): GraphActionsContextType =>
  useContext(GraphActionsContext);

const useGraphAndGraphActions = (): {
  graph: Graph;
} & GraphActionsContextType => {
  const graph = useGraph();
  const graphActions = useGraphActions();
  return useMemo(() => ({ graph, ...graphActions }), [graph, graphActions]);
};

/**
 * A non-hook based {@link React.MutableRefObject}.
 *
 * A custom implementation of a {@link React.useRef React ref} object. You may
 * be asking why we are using this instead of the ref return from `useRef` - the
 * answer is just that I wanted to store all my refs inside this graph data
 * store, but I needed an object that I could pass into
 * {@link React.ReactNode ReactNodes} as the `ref` prop. So my solution is just
 * to make my own object that can be used in place of
 * {@link React.MutableRefObject} and that doesn't need to be created with a
 * hook.
 *
 * @param initialValue The initial value stored inside your ref
 * @returns A new ref object that can be used in place of the `ref` returned by
 * {@link React.useRef useRef}
 */
const ref = <T,>(initialValue: T): MutableRefObject<T> =>
  (() => {
    let value = initialValue;

    // prettier-ignore
    return {
      get current() { return value; },
      set current(val) { value = val; },
    };
  })();

export {
  GraphActionsContext,
  GraphProvider,
  useGraph,
  useGraphActions,
  ref,
  blankGraph,
  origin,
  computeLine,
  computeThirdPoint,
  pointIsAtEdgeOfCircle,
  useGraphAndGraphActions,
};

export type {
  State,
  Size,
  Transition,
  Graph,
  GraphAction,
  GraphActionsContextType,
  GraphActionType,
  Point,
  Offset,
};
