import styled from "styled-components";
import { useMemo } from "react";
import { useSelectedNode } from "../../../data/selectedstate";
import { NodeMenu, NodeMenuProps } from "./NodeMenu";
import { State } from "../../../data/graph";

const NodeMenuRoot = styled.section`
  position: absolute;
  inset: 100% auto auto 100%;
  transform: translate(-115%, -115%);
  z-index: 999;
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
