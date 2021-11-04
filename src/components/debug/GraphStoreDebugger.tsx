import { CloseCircleTwoTone } from "@ant-design/icons";
import { Button, Checkbox, Divider } from "antd";
import { MutableRefObject, useCallback, useMemo, useState } from "react";
import Draggable from "react-draggable";
import styled, { createGlobalStyle, css } from "styled-components";
import { theme } from "../../util/styles";
import { useDebuggerState } from "../data/debugger";
import {
  State,
  Transition,
  TransitionInProgress,
  useGraph,
} from "../data/graph";
import { useSelectedNode } from "../data/selectedstate";

const GlobalStyling = createGlobalStyle<{ stateOpacity?: number }>`
  ${({ stateOpacity }) =>
    stateOpacity &&
    css`
      .state {
        opacity: ${stateOpacity}%;
      }
    `}
`;

const DemoGraphViewerRoot = styled.div`
  box-shadow: ${theme.shadows.medium};
  border: 1px solid rgba(128, 128, 128, 0.438);
  border-radius: 10px;

  position: absolute;
  inset: 0 auto auto 65%;
  background: white;
  z-index: 99999;

  width: 20rem;
  max-height: 50vh;

  display: flex;
  flex-direction: column;
  place-items: center;

  & > div {
    width: 95%;
    word-wrap: break-word;
  }

  & button {
    margin: auto;
  }
`;

const Content = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0 1rem;

  overflow: scroll;

  & > h1 {
    place-self: center;
    font-style: italic;
    font-size: 1.75rem;
    margin: 1rem 0 1rem 0;
    ${theme.mixins.unselectable()}
  }

  & > .controls {
    place-self: center;
    display: flex;
    flex-direction: column;
    place-items: center;
    margin: 0 0 1em 0;

    & > * {
      margin: 0 0 0.5em 0;
    }
  }

  & > .ant-divider {
    margin-top: 0;
  }
`;

const refToTagName = (ref: MutableRefObject<Element>): string =>
  ref?.current?.tagName
    ? `Ref: <${ref?.current?.tagName.toLowerCase()}>`
    : null;

/**
 * Removes cyclic references from the JSON of a State or Transition
 *
 * @param sOrT
 * @returns
 */
const withRefAsTagName = <T extends State | Transition | TransitionInProgress>(
  sOrT: T
): Omit<T, "ref"> & { ref: string } => ({
  ...sOrT,
  ref: refToTagName(sOrT?.ref),
});

const CloseDebuggerButton = styled(Button).attrs({
  type: "text",
  children: (
    <CloseCircleTwoTone
      style={{ transform: "scale(2)" }}
      twoToneColor="#eb2f96"
    />
  ),
})`
  &&& {
    position: absolute;
    width: 31px;
    height: 31px;
    inset: 0.5rem auto auto 100%;
    transform: translate(-140%);
    border-radius: 50%;

    display: flex;
    place-content: center;
    place-items: center;

    :hover {
      transform: translate(-140%) scale(1.1);
    }
  }
`;

const GraphStoreDebugger = (): JSX.Element => {
  const [enabled, _, toggle] = useDebuggerState();
  const [draggable, setDraggable] = useState(true);
  const toggleDraggable = useCallback(() => setDraggable((d) => !d), [
    setDraggable,
  ]);

  const [stateOpacity, setStateOpacity] = useState<number>(null);
  const seeThrough = useMemo(() => stateOpacity !== null, [stateOpacity]);
  const toggleOpacity = useCallback(
    () => setStateOpacity((o) => (o === null ? 50 : null)),
    [setStateOpacity]
  );

  const selectedNodeStore = useSelectedNode();
  const stringifiableSelectedNodeStore = useMemo(
    () => ({
      ...selectedNodeStore,
      state: !selectedNodeStore?.state
        ? null
        : withRefAsTagName(selectedNodeStore.state),
      prev: {
        ...selectedNodeStore?.prev,
        state: !selectedNodeStore?.prev?.state
          ? null
          : withRefAsTagName(selectedNodeStore.prev.state),
      },
    }),
    [selectedNodeStore]
  );

  const graph = useGraph();
  const stringifiableGraphStore = useMemo(
    () => ({
      root: refToTagName(graph.root),
      starting: graph.starting,
      transitionInProgress: withRefAsTagName(graph.transitionInProgress),
      states: graph.states.map(withRefAsTagName),
      transitions: graph.transitions.map(withRefAsTagName),
    }),
    [graph]
  );

  if (!enabled) return <></>;
  return (
    <Draggable disabled={!draggable} bounds="parent">
      <DemoGraphViewerRoot>
        <GlobalStyling stateOpacity={stateOpacity} />
        <Content>
          <CloseDebuggerButton onClick={toggle} />
          <h1>Debugger</h1>
          <div className="controls">
            <Button type="primary" danger={draggable} onClick={toggleDraggable}>
              Make {draggable ? "Undraggable" : "Draggable"}
            </Button>
            <Checkbox checked={seeThrough} onChange={toggleOpacity}>
              Transparent Nodes
            </Checkbox>
          </div>
          <Divider />
          <h2>Selected State Store</h2>
          <div>
            <pre>{JSON.stringify(stringifiableSelectedNodeStore, null, 2)}</pre>
          </div>
          <Divider />
          <h2>Graph Store</h2>
          <div>
            <pre>{JSON.stringify(stringifiableGraphStore, null, 2)}</pre>
          </div>
        </Content>
      </DemoGraphViewerRoot>
    </Draggable>
  );
};

export default GraphStoreDebugger;
