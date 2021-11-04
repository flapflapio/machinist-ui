import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PartialExcept, State, useGraphAndGraphActions } from "./graph";

type SelectedNodeContextType = {
  state: State;
  index: number;

  /**
   * Captures the previously selected node
   */
  prev: {
    state: State;
    index: number;
  };

  setState: Dispatch<SetStateAction<PartialExcept<State, "id">>>;
  setIndex: Dispatch<SetStateAction<number>>;
  unset: () => void;
};

const dummyFunc = () => null;

const blankStore = (): SelectedNodeContextType => ({
  state: null,
  index: -1,
  prev: null,
  setIndex: dummyFunc,
  setState: dummyFunc,
  unset: dummyFunc,
});

const SelectedNodeContext = createContext<SelectedNodeContextType>(
  blankStore()
);

const SelectedNodeProvider = ({
  children,
}: {
  children?: ReactNode;
}): JSX.Element => {
  const [state, setState] = useState("q_");
  const [index, setIndex] = useState(blankStore().index);
  const [prev, setPrev] = useState<{ state: State; index: number }>({
    state: null,
    index: -1,
  });

  const { graph } = useGraphAndGraphActions();
  const node = useMemo(() => graph.states.find((s) => s.id === state) ?? null, [
    graph,
    state,
  ]);

  const setNode = useCallback(
    (s: PartialExcept<State, "id">) => {
      setPrev({
        state: node,
        index,
      });
      setState(s.id);
    },
    [setState, index, node]
  );

  const unset = useCallback(() => {
    setState("q_");
    setIndex(-1);
  }, [setState, setIndex]);

  const pkg = useMemo(
    () => ({ state: node, index, prev, setState: setNode, setIndex, unset }),
    [node, index, setIndex, setNode, unset, prev]
  );

  return (
    <SelectedNodeContext.Provider value={pkg}>
      {children}
    </SelectedNodeContext.Provider>
  );
};

const useSelectedNode = (): SelectedNodeContextType =>
  useContext(SelectedNodeContext);

/**
 * This is an adapter hook for use in the NodeLayer. The hook repackages the
 * {@link SelectedNodeContext} into a different format (a list of the state +
 * index, plus a setter for the state and index).
 *
 * @returns A tuple of (state+index, setter(state+index))
 */
const useListOfSelectedNodeState = (): [
  [State, number],
  Dispatch<SetStateAction<[State, number]>>
] => {
  const { state, index, setState, setIndex } = useContext(SelectedNodeContext);
  const setter = useCallback<Dispatch<SetStateAction<[State, number]>>>(
    ([s, i]: [State, number]) => {
      setState(s);
      setIndex(i);
    },
    [setState, setIndex]
  );
  return useMemo(() => [[state, index], setter], [state, index, setter]);
};

export type { SelectedNodeContextType };
export {
  SelectedNodeContext,
  SelectedNodeProvider,
  blankStore,
  useSelectedNode,
  useListOfSelectedNodeState,
};
