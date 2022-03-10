import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type DebuggerContextType = [
  boolean,
  (set: boolean | ((current: boolean) => boolean)) => void,
  () => void
];

const DebuggerContext = createContext<DebuggerContextType>([
  false,
  () => null,
  () => null,
]);

const DebuggerContextProvider = ({
  children,
}: {
  children?: ReactNode;
}): JSX.Element => {
  const [enabled, setEnabled] = useState(false);
  const toggle = useCallback(() => setEnabled((e) => !e), [setEnabled]);
  const pkg = useMemo<DebuggerContextType>(
    () => [enabled, setEnabled, toggle],
    [enabled, setEnabled, toggle]
  );

  return (
    <DebuggerContext.Provider value={pkg}>{children}</DebuggerContext.Provider>
  );
};

const useDebuggerState = (): DebuggerContextType => useContext(DebuggerContext);

export { useDebuggerState, DebuggerContextProvider, DebuggerContext };
export type { DebuggerContextType };
