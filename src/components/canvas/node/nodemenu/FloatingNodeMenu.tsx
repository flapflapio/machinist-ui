import styled from "styled-components";
import { useMemo } from "react";
import { useSelectedNode } from "../../../data/selectedstate";
import { NodeMenu, NodeMenuProps } from "./NodeMenu";
import { State } from "../../../data/graph";

const NodeMenuRoot = styled.section`
  position: fixed;
  inset: 100% auto auto 100%;
  transform: translate(calc(-100% - 1.5rem), calc(-100% - 1.5rem));
  z-index: 999;
  max-height: 30em;
`;

const FloatingNodeMenu = (props: Omit<NodeMenuProps, "node">): JSX.Element => {
  const { state } = useSelectedNode();
  const node = useMemo<State>(
    () => state ?? { id: "q_", ending: false, location: null, ref: null },
    [state]
  );
  const isDummyState = useMemo(() => node?.id === "q_", [node]);
  const style = useMemo(() => (isDummyState ? { opacity: "0%" } : {}), [
    isDummyState,
  ]);

  return (
    <NodeMenuRoot>
      <NodeMenu style={style} node={node} {...props} />
    </NodeMenuRoot>
  );
};

export { FloatingNodeMenu };
