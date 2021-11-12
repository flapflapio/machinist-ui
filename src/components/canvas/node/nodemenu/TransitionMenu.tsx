import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { Graph, State as GraphState } from "../../../data/graph";
import EditableTransition from "./EditableTransition";
import Heading from "./Heading";

const useHasNoTransitions = (graph: Graph) =>
  useMemo(() => graph.transitions.length === 0, [graph.transitions]);

const NotApplicable = styled(Heading).attrs({ children: "N/A" })`
  font-size: 1.5em;
  transform: translate(35%);
`;

const Transitions = ({
  graph: { transitions },
  state,
}: {
  graph: Graph;
  state: GraphState;
}) => (
  <>
    {transitions
      .filter(
        (t) => state && (t.start.state === state.id || t.end.state === state.id)
      )
      .map((t) => ({
        id: t.id,
        from: t.start.state,
        to: t.end.state,
      }))
      .map((p, i) => (
        <EditableTransition key={`${p.id}_${i}`} {...p} />
      ))}
  </>
);

const Root = styled.div`
  max-height: 10em;
  overflow-y: scroll;
  & > * {
    margin: 0.3em 0;
  }
`;

const TransitionMenu = memo(
  ({ graph, state }: { graph: Graph; state: GraphState }) => {
    const hasNoTransitions = useHasNoTransitions(graph);
    return (
      <Root>
        {hasNoTransitions ? (
          <NotApplicable />
        ) : (
          <Transitions graph={graph} state={state} />
        )}
      </Root>
    );
  }
);

TransitionMenu.displayName = "TransitionMenu";

export default TransitionMenu;
