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

/**
 * This generic type does the same thing as {@link Partial} (it makes all the
 * properties in `T` optional) except that it excludes the types specified by
 * `K`
 */
type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

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
  /**
   * If id is "q_", the state is unassigned to the graph. If you try and insert
   * such a state into the store, it will be assigned the next available id
   * computed from the existing states.
   */
  id: "q_" | string;

  ending: boolean;
  location: Point;
  ref: MutableRefObject<HTMLDivElement>;
};

type Transition = {
  /**
   * If id is "t_", the transition is unassigned to the graph. If you try and
   * insert such a transition into the store, it will be assigned the next
   * available id computed from the existing transitions.
   */
  id: "t_" | string;

  start: { state: string; offset: Offset };
  end: { state: string; offset: Offset };
  symbol: string;
  ref: MutableRefObject<SVGLineElement>;
};

/**
 * This type is the same as the {@link Transition Transition type} except that
 * it maps from a state to the user's mouse location.
 *
 * This object is used for when the user is drawing a new state.
 */
type TransitionInProgress = Omit<Transition, "id" | "end" | "symbol"> & {
  id: "tINPROGRESS";
  active: boolean;
  end: Point;
};

type Graph = {
  // STATE
  root: MutableRefObject<SVGSVGElement>;
  size: Size;
  starting: string;
  states: State[];
  transitions: Transition[];
  transitionInProgress: TransitionInProgress;

  // METHODS
  vb: () => string;
  pointForState: (id: string) => Point;
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
  transitionInProgress?: Partial<TransitionInProgress>;
  manipulation?: (graph: Graph) => Graph;
  root?: MutableRefObject<SVGSVGElement>;
  size?: Size | ((s: Size) => Size);
};

type GraphActionsContextType = {
  dispatch: Dispatch<GraphAction>;
  setSize: (size: Size) => void;
  setRoot: (root: MutableRefObject<SVGSVGElement>) => void;
  deleteElement: (id: string) => void;
  modifyState: (partialState: PartialExcept<State, "id">) => void;
  setStartState: (state: string | PartialExcept<State, "id">) => void;
  modifyTransition: (
    partialTransition: PartialExcept<Transition, "id">
  ) => void;
};

const origin = (): Point => ({ x: 0, y: 0 });

const midPoint = (p1: Point, p2: Point): Point => ({
  x: Math.min(p2.x, p1.x) + Math.abs(p2.x - p1.x) / 2,
  y: Math.min(p2.y, p1.y) + Math.abs(p2.y - p1.y) / 2,
});

const computeLine = (p1: Point, p2: Point): { a: number; b: number } => {
  const deltaX = p2.x - p1.x;

  // BE CAREFUL OF DIVIDE BY ZERO!
  const a = (p2.y - p1.y) / (deltaX === 0 ? 1 : deltaX);

  const b = p1.y - a * p1.x;
  return { a, b };
};

const computeThirdPoint = (
  radius: number,
  line: { a: number; b: number },
  p1: Point,
  p2: Point
): Point => {
  // These are 3 coefficients for a quadratic equation:
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
  transitionInProgress: {
    id: "tINPROGRESS",
    active: false,
    end: origin(),
    ref: null,
    start: null,
  },

  vb() {
    return (
      `${this?.size?.minX} ` +
      `${this?.size?.minY} ` +
      `${this?.size?.width} ` +
      `${this?.size?.height}`
    );
  },

  clientCoordsToSvgCoords({ x, y }) {
    const ctm = this?.root?.current?.getScreenCTM();
    if (!ctm) return origin();
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
    const scaling = scalingFactor ?? 0.9;
    return (this as Graph).clientCoordsToSvgCoords({
      x: scaling * pointThree.x,
      y: scaling * pointThree.y,
    });
  },

  pointForState(id) {
    return (this as Graph)?.states?.find((s) => s.id === id)?.location;
  },
});

const nullf = () => null;

const GraphContext = createContext<Graph>(blankGraph());
const GraphActionsContext = createContext<GraphActionsContextType>({
  dispatch: nullf,
  modifyState: nullf,
  modifyTransition: nullf,
  deleteElement: nullf,
  setRoot: nullf,
  setSize: nullf,
  setStartState: nullf,
});

/**
 * A namespace for some utility functions
 */
const utils = {
  /**
   * Extracts the next available id from the given array of states or
   * transitions.
   *
   * @param stateOrTransition
   * @returns
   */
  nextAvailableId(
    statesOrTransitions: { id: string }[],
    prefix: string = null
  ): string {
    let pref = "q";

    const nextId =
      statesOrTransitions.reduce((acc, next) => {
        pref = next.id.substring(0, 1);
        const id = parseInt(next.id.slice(1), 10);
        return acc > id ? acc : id;
      }, -1) + 1;

    return `${prefix ?? pref}${nextId}`;
  },

  /**
   * Extract the states from a dispatched action
   *
   * @param action
   * @returns
   */
  extractStates: (action: GraphAction): State[] =>
    action.state
      ? [...(action.states || []), action.state]
      : action.states || [],

  /**
   * Extract the transitions from a dispatched action
   *
   * @param action
   * @returns
   */
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
  /**
   * Add new states to the store
   *
   * @param store
   * @param action
   * @returns
   */
  ADD: (store, action) =>
    action.state ||
    action.states ||
    action.transition ||
    action.transitions ||
    action.transitionInProgress
      ? {
          // OLD STORE
          ...store,

          // MODIFY STATES
          states: (() => {
            const addMe = utils.extractStates(action);
            const brandNewStates = (() => {
              const processed: State[] = [];
              return addMe
                .filter((s) => !store.states.map((ss) => ss.id).includes(s.id))
                .map((s) => {
                  const newState =
                    s.id === "q_"
                      ? {
                          ...s,
                          id: utils.nextAvailableId(
                            [...store.states, ...processed],
                            "q"
                          ),
                        }
                      : s;
                  processed.push(newState);
                  return newState;
                });
            })();
            return [
              ...store.states.map((s) => ({
                ...s,
                ...(addMe.find((ss) => ss.id === s.id) || {}),
              })),
              ...brandNewStates,
            ];
          })(),

          // MODIFY TRANSITIONS
          transitions: (() => {
            const addMe = utils.extractTransitions(action);
            const brandNewTransitions = (() => {
              const processed: Transition[] = [];
              return addMe
                .filter(
                  (t) => !store.transitions.map((tt) => tt.id).includes(t.id)
                )
                .map((t) => {
                  const newTransition =
                    t.id === "t_"
                      ? {
                          ...t,
                          id: utils.nextAvailableId(
                            [...store.transitions, ...processed],
                            "t"
                          ),
                        }
                      : t;
                  processed.push(newTransition);
                  return newTransition;
                });
            })();
            return [
              ...store.transitions.map((t) => ({
                ...t,
                ...(addMe.find((tt) => tt.id === t.id) || {}),
              })),
              ...brandNewTransitions,
            ];
          })(),

          transitionInProgress: {
            ...store.transitionInProgress,
            ...action.transitionInProgress,
          },
        }
      : store,

  /**
   * Remove states from the store
   *
   * @param store
   * @param action
   * @returns
   */
  REMOVE: (store, action) =>
    action.ids && action.ids.length > 0
      ? {
          ...store,
          starting: action.ids.includes(store.starting) ? null : store.starting,
          states: store.states.filter((s) => !action.ids.includes(s.id)),
          transitions: store.transitions.filter(
            (t) =>
              !action.ids.includes(t.id) &&
              !action.ids.includes(t.start?.state) &&
              !action.ids.includes(t.end?.state)
          ),
        }
      : store,

  /**
   * Empty the store
   *
   * @param store
   * @returns
   */
  CLEAR: (store) => ({ ...store, states: [], transitions: [] }),

  /**
   * TODO: currently this reducer is a noop
   *
   * @param store
   * @returns
   */
  STEP: (store) => store,

  /**
   * Call some arbitrary function on the store. This is just an escape hatch,
   * use the other reducers for most purposes.
   *
   * @param store
   * @param action
   * @returns
   */
  MANIPULATE: (store, action) =>
    action.manipulation ? action.manipulation(store) : store,

  /**
   * Set the root SVG element of the store
   *
   * @param store
   * @param action
   * @returns
   */
  SET_ROOT: (store, action) =>
    action.root !== store.root ? { ...store, root: action.root } : store,

  /**
   * Modify the size attribute of the store
   *
   * @param store
   * @param action
   * @returns
   */
  SET_SIZE: (store, action) =>
    action.size && typeof action.size !== "function"
      ? !sizeEqualsSize(action.size, store.size)
        ? { ...store, size: action.size }
        : store
      : (() => {
          const size = (action.size as (s: Size) => Size)(store.size);
          return !sizeEqualsSize(size, store.size) ? { ...store, size } : store;
        })(),
};

/**
 * This is the master reducer - dispatches parameters to the appropriate reducer
 * from the above map
 *
 * @param store
 * @param action
 * @returns
 */
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

  const setStartState = useCallback(
    (state: string | PartialExcept<State, "id">) =>
      dispatch({
        type: "MANIPULATE",
        manipulation: (g) => ({
          ...g,
          starting:
            state === null
              ? null
              : g.states?.find(
                  (s) => s.id === (typeof state === "string" ? state : state.id)
                )?.id,
        }),
      }),
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
      setStartState,
    }),
    [
      dispatch,
      modifyState,
      modifyTransition,
      deleteElement,
      setRoot,
      setSize,
      setStartState,
    ]
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

type TransitionInProgressSetter =
  | Partial<TransitionInProgress>
  | ((tip: TransitionInProgress) => TransitionInProgress);

const useTransitionInProgress = (): TransitionInProgress => {
  const graph = useGraph();
  return useMemo(() => graph.transitionInProgress, [graph]);
};

/**
 * @returns A setter function for the TransitionInProgress function of the graph
 */
const useSetTransitionInProgress = (): ((
  setter: TransitionInProgressSetter
) => void) => {
  const { dispatch, graph } = useGraphAndGraphActions();
  return (setter: TransitionInProgressSetter) =>
    dispatch({
      type: "ADD",
      transitionInProgress:
        typeof setter === "function"
          ? setter(graph.transitionInProgress)
          : { ...graph.transitionInProgress, ...setter },
    });
};

const useTipState = (): [
  TransitionInProgress,
  (setter: TransitionInProgressSetter) => void
] => {
  const tip = useTransitionInProgress();
  const setTip = useSetTransitionInProgress();
  return useMemo(() => [tip, setTip], [tip, setTip]);
};

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
  useTransitionInProgress,
  useSetTransitionInProgress,
  useTipState,
  midPoint,
};

export type {
  State,
  Size,
  Transition,
  TransitionInProgress,
  Graph,
  GraphAction,
  GraphActionsContextType,
  GraphActionType,
  Point,
  PartialExcept,
  Offset,
};
