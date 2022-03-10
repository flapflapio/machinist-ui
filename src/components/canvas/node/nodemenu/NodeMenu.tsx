import { Button, Checkbox, Divider, Input } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  useCallback,
  useMemo,
} from "react";
import styled, { css } from "styled-components";
import { theme } from "../../../../util/styles";
import {
  State as GraphState,
  useGraph,
} from "../../../data/graph";
import { State } from "../State";

const borderColour = "rgba(128, 128, 128, 0.466)";
const NodeMenuRoot = styled.div`
  transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);

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

const NodeStage = ({
  state,
  activeOverride,
  ...props
}: {
  state: GraphState;
  activeOverride?: boolean;
} & ComponentPropsWithoutRef<"div">) => (
  <div {...props}>
    {state && (
      <State
        activeOverride={activeOverride}
        style={{ transform: "none !important" }}
        id={state.id}
      />
    )}
  </div>
);

const StyledNodeStage = styled(NodeStage)`
  ${theme.mixins.unselectable()}

  display: flex;
  place-content: center;
  place-items: center;
  width: 100%;
  padding: 0.75em;

  & > .state {
    transform: none !important;
  }
`;

const SubMenu = styled.div.attrs<{ $center?: boolean }>(({ $center }) => ({
  $center: $center ?? true,
}))<{ $center?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-top: 0.5em;
  width: 100%;
  padding: 0 1em;

  ${({ $center }) =>
    $center &&
    css`
      place-content: center;
      place-items: center;
    `}

  &&& > * {
    margin: 0.3em 0.2em;
  }
`;

const DeleteButton = styled(Button).attrs({
  children: "Delete",
  type: "primary",
  danger: true,
})`
  width: fit-content;
`;

const EditableTransitionRoot = styled.div`
  display: flex;

  & input {
    margin-left: 0.5em;
    width: 65%;
  }
`;

const EditableTransition = ({
  id,
  from,
  to,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  id: string;
  from: string;
  to: string;
}): JSX.Element => {
  const { graph, dispatch } = useGraph();
  const current = useMemo(() => graph.transitions.find((t) => t.id === id), [
    graph,
    id,
  ]);

  const editTransition = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: "ADD",
        transition: {
          ...current,
          symbol: e.target.value,
        },
      }),
    [dispatch, current]
  );

  return (
    <EditableTransitionRoot {...props}>
      <span>
        {from} → {to}
      </span>
      <Input
        size="small"
        onChange={editTransition}
        placeholder="Symbol"
        value={current.symbol}
      />
    </EditableTransitionRoot>
  );
};

const Heading = styled.h3`
  &&& {
    transform: translate(-1em);
    font-style: italic;
    color: rgba(128, 128, 128, 0.719);
  }
`;

type NodeMenuProps = ComponentPropsWithoutRef<"div"> & {
  node: string | GraphState;
};

const NodeMenu = ({ node, ...props }: NodeMenuProps): JSX.Element => {
  const {
    graph,
    deleteElement,
    modifyState,
    setStartState,
  } = useGraph();

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

  const toggleEndState = useCallback(
    (e: CheckboxChangeEvent) =>
      modifyState({ id: state?.id, ending: e.target.checked }),
    [modifyState, state]
  );

  const toggleStartState = useCallback(
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

  const transitionMenu = useMemo(
    () =>
      graph.transitions
        .filter(
          (t) =>
            state && (t.start.state === state.id || t.end.state === state.id)
        )
        .map((t) => ({
          id: t.id,
          from: t.start.state,
          to: t.end.state,
        }))
        .map((p, i) => <EditableTransition key={`${p.id}_${i}`} {...p} />),
    [graph, state]
  );

  return (
    <NodeMenuRoot {...props}>
      <StyledNodeStage activeOverride={active} state={state} />
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
          {transitionMenu.length > 0 ? (
            transitionMenu
          ) : (
            <Heading style={{ fontSize: "1.5em", transform: "translate(35%)" }}>
              N/A
            </Heading>
          )}
        </SubMenu>
      </SubMenu>
    </NodeMenuRoot>
  );
};

export { NodeMenu };
export type { NodeMenuProps };
