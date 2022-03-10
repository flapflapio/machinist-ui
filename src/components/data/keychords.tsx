import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type KeyChordsStore = {
  enabled: boolean;

  control: boolean;
  shift: boolean;
  alt: boolean;
  scroll: number;
  scrollDirection: "Up" | "Down" | "Neutral";
};

type KeyChordAction = {
  key: "Control" | "Shift" | "Alt";
  enabled: boolean;
};

type ScrollAction = {
  scroll: number;
  scrollDirection?: "Up" | "Down" | "Neutral";
};

type AnyObject = Record<string, unknown>;

type ChildrenProps = { children?: ReactNode };

const isScrollAction = (obj: AnyObject): obj is ScrollAction => "scroll" in obj;

const isKeyChordAction = (obj: AnyObject): obj is KeyChordAction =>
  "key" in obj && "enabled" in obj;

const blankStore = (): KeyChordsStore => ({
  enabled: false,
  control: false,
  shift: false,
  alt: false,
  scroll: 100,
  scrollDirection: "Neutral",
});

const KeyChordsStoreContext = createContext<
  [KeyChordsStore, Dispatch<KeyChordAction | ScrollAction>]
>([blankStore(), () => null]);

const reduceKeyChordAction = (
  state: KeyChordsStore,
  action: KeyChordAction
): KeyChordsStore =>
  action.key === "Control" || action.key === "Shift" || action.key === "Alt"
    ? state[action.key.toLowerCase()] !== action.enabled
      ? { ...state, [action.key.toLowerCase()]: action.enabled }
      : state
    : state;

const newScrollAmount = (
  currentScroll: number,
  deltaScroll: number
): number => {
  const maxScroll = 500;
  const minScroll = 25;

  const delta = deltaScroll / 5;
  const newScroll = currentScroll + delta;
  return Math.trunc(Math.min(maxScroll, Math.max(minScroll, newScroll)));
};

const reduceScrollAction = (
  state: KeyChordsStore,
  action: ScrollAction
): KeyChordsStore =>
  state.control && action.scroll !== 0
    ? {
        ...state,
        scroll:
          action.scroll !== 0
            ? newScrollAmount(state.scroll, action.scroll)
            : state.scroll,
        scrollDirection: action.scrollDirection ?? state.scrollDirection,
      }
    : action.scrollDirection && action.scrollDirection !== state.scrollDirection
    ? {
        ...state,
        scrollDirection: action.scrollDirection ?? state.scrollDirection,
      }
    : state;

const reducer = (
  state: KeyChordsStore,
  action: KeyChordAction | ScrollAction
): KeyChordsStore =>
  isKeyChordAction(action)
    ? reduceKeyChordAction(state, action)
    : isScrollAction(action)
    ? reduceScrollAction(state, action)
    : state;

const useKeyChordStore = (): [KeyChordsStore, Dispatch<KeyChordAction>] =>
  useContext(KeyChordsStoreContext);

const useKeyPressHook = (enabled: boolean): ((e: { key: string }) => void) => {
  const dispatch = useKeyChordStore()[1];
  return useCallback(
    (e) =>
      (e.key === "Control" || e.key === "Alt" || e.key === "Shift") &&
      dispatch({ key: e.key, enabled }),
    [dispatch, enabled]
  );
};

const useKeyPressListener = (): void => {
  const keyup = useKeyPressHook(false);
  const keydown = useKeyPressHook(true);

  useEffect(() => {
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  }, [keyup, keydown]);
};

const useScrollListener = (): void => {
  const [store, dispatch] = useContext(KeyChordsStoreContext);

  const scrollValueListener = useCallback(
    (e: WheelEvent) => {
      if (store.enabled) e.preventDefault();
      dispatch({
        scroll: e.deltaY,
        scrollDirection:
          e.deltaY < 0 ? "Down" : e.deltaY > 0 ? "Up" : "Neutral",
      });
    },
    [dispatch, store]
  );

  useEffect(() => {
    window.addEventListener("wheel", scrollValueListener, { passive: false });
    return () => {
      window.removeEventListener("wheel", scrollValueListener);
    };
  }, [scrollValueListener]);

  useEffect(() => {
    const interval = setInterval(
      () => dispatch({ scroll: 0, scrollDirection: "Neutral" }),
      50
    );
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);
};

const KeyChordsListener = ({ children }: ChildrenProps): JSX.Element => {
  useKeyPressListener();
  useScrollListener();
  return <>{children}</>;
};

const KeyChordsProvider = ({
  enabled = false,
  children,
}: ChildrenProps & { enabled?: boolean }): JSX.Element => {
  const [store, dispatch] = useReducer(reducer, null, () => ({
    ...blankStore(),
    enabled,
  }));

  const pkg = useMemo<[KeyChordsStore, Dispatch<KeyChordAction>]>(
    () => [store, dispatch],
    [store, dispatch]
  );

  return (
    <KeyChordsStoreContext.Provider value={pkg}>
      <KeyChordsListener>{children}</KeyChordsListener>
    </KeyChordsStoreContext.Provider>
  );
};

export { KeyChordsProvider, KeyChordsStoreContext, useKeyChordStore };
export type { KeyChordsStore, KeyChordAction, ScrollAction, ChildrenProps };
