import { Checkbox, Divider } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import React, { ComponentPropsWithoutRef, useCallback, useMemo } from "react";
import styled from "styled-components";
import { theme } from "../../../../util/styles";
import {
  Graph,
  PartialExcept,
  State as GraphState,
  useGraph,
} from "../../../data/graph";
import DeleteButton from "./DeleteButton";
import Heading from "./Heading";
import NodeStage from "./NodeStage";
import SubMenu from "./SubMenu";
import TransitionMenu from "./TransitionMenu";

const useToggleEndState = (
  modifyState: (partialState: PartialExcept<GraphState, "id">) => void,
  state: GraphState
) =>
  useCallback(
    (e: CheckboxChangeEvent) =>
      modifyState({ id: state?.id, ending: e.target.checked }),
    [modifyState, state]
  );

const useToggleStartState = (
  state: GraphState,
  graph: Graph,
  setStartState: (state: string | PartialExcept<GraphState, "id">) => void
) =>
  useCallback(
    (e: CheckboxChangeEvent) => {
      const weAreTheStartState = state && graph.starting === state.id;
      const checked = e.target.checked;
      if (
        (!weAreTheStartState && checked) ||
        (weAreTheStartState && !checked)
      ) {
        setStartState(!weAreTheStartState && checked ? state : null);
      }
    },
    [state, graph, setStartState]
  );

const fast = (...attrs: string[]) =>
  `${attrs
    .map((attr) => `${attr} 0.5s cubic-bezier(0.19, 1, 0.22, 1)`)
    .reduce((acc, next) => `${acc}, ${next}`)};`;

const borderColour = "rgba(128, 128, 128, 0.466)";
const NodeMenuRoot = styled.div`
  transition: ${fast("opacity", "height")};

  display: flex;
  flex-direction: column;
  width: 15rem;
  min-height: 20rem;
  background: white;
  border: 1px solid ${borderColour};
  border-radius: 5px;
  box-shadow: ${theme.shadows.dark};

  & > .ant-divider {
    margin: 0 auto 0 auto;
    min-width: 85%;
    width: 85%;
    border-top-width: 2px;
  }
`;

type NodeMenuProps = ComponentPropsWithoutRef<"div"> & {
  node: string | GraphState;
};

const NodeMenu = ({ node, ...props }: NodeMenuProps): JSX.Element => {
  const { graph, deleteElement, modifyState, setStartState } = useGraph();

  const state = useMemo(
    () =>
      typeof node === "string" ? graph.states.find((s) => s.id === node) : node,
    [graph, node]
  );

  const active = useMemo(() => (state?.id === "q_" ? true : null), [state]);

  const deleteNode = useCallback(() => deleteElement(state?.id), [
    state,
    deleteElement,
  ]);

  const isStartState = useMemo(() => graph.starting === state?.id, [
    graph,
    state,
  ]);

  const toggleEndState = useToggleEndState(modifyState, state);
  const toggleStartState = useToggleStartState(state, graph, setStartState);

  return (
    <NodeMenuRoot {...props}>
      <NodeStage activeOverride={active} state={state} />
      <Divider />
      <SubMenu>
        <DeleteButton onClick={deleteNode} />
        <SubMenu $center={false}>
          <Heading>Toggles</Heading>
          <Checkbox checked={isStartState} onChange={toggleStartState}>
            Start state
          </Checkbox>
          <Checkbox checked={state.ending} onChange={toggleEndState}>
            End state
          </Checkbox>
        </SubMenu>
        <SubMenu $center={false} style={{ marginBottom: "1.1em" }}>
          <Heading>Transitions</Heading>
          <TransitionMenu graph={graph} state={state} />
        </SubMenu>
      </SubMenu>
    </NodeMenuRoot>
  );
};

export { NodeMenu };
export type { NodeMenuProps };
