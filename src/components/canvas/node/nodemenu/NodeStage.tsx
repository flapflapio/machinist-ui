import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import { theme } from "../../../../util/styles";
import { State as GraphState } from "../../../data/graph";
import { State } from "../State";

const Base = ({
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

const NodeStage = styled(Base)`
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

export default NodeStage;
