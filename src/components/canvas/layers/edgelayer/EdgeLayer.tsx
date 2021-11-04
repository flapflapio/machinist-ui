import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { useGraph, useGraphActions, useTipState } from "../../../data/graph";
import { useSelectedNode } from "../../../data/selectedstate";
import { Transition, TransitionInProgress, svgNs } from "../../node/Transition";
import { Background } from "./Background";

const Root: StyledComponent<"svg", DefaultTheme> = styled.svg.attrs(
  ({ viewBox }) => ({
    viewBox: viewBox ?? "0 0 200 200",
    xmlns: svgNs,
  })
)`
  width: 100%;
  height: 100%;
  position: absolute !important;
  inset: 0 auto auto 0;
  z-index: 1;
  box-sizing: border-box;

  text-align: center;
`;

const Transitions = () => {
  const graph = useGraph();
  return (
    <>
      {graph.transitions.map((t, i) => (
        <Transition key={`${t.id}-i`} id={t.id} transition={t} graph={graph} />
      ))}
    </>
  );
};

const TransInProg = () => {
  const graph = useGraph();
  const [tip] = useTipState();

  if (!tip.active) {
    return <></>;
  }

  return <TransitionInProgress transitionInProgress={tip} graph={graph} />;
};

type EdgeLayerProps = ComponentPropsWithoutRef<"svg">;
const EdgeLayer = ({ ...props }: EdgeLayerProps): JSX.Element => {
  const { setRoot } = useGraphActions();
  const root = useRef<SVGSVGElement>(null);
  const viewBox = useMemo(() => "0 0 100% 100%", []);

  useEffect(() => {
    setRoot(root);
    return () => setRoot(null);
  }, [root, setRoot]);

  return (
    <Root ref={root} viewBox={viewBox} {...props}>
      <Background />
      <Transitions />
      <TransInProg />
    </Root>
  );
};

export default EdgeLayer;
export { EdgeLayer };
