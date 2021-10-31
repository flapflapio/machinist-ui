import { ComponentPropsWithoutRef, useEffect, useMemo, useRef } from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { useGraph, useGraphActions } from "../../data/graph";
import Transition, { svgNs } from "../node/Transition";

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

type EdgeLayerProps = ComponentPropsWithoutRef<"svg">;

const EdgeLayer = ({ ...props }: EdgeLayerProps): JSX.Element => {
  const graph = useGraph();
  const { setRoot } = useGraphActions();
  const root = useRef<SVGSVGElement>(null);
  const viewBox = useMemo(() => "0 0 100% 100%", []);

  useEffect(() => {
    setRoot(root);
    return () => setRoot(null);
  }, [root, setRoot]);

  return (
    <Root ref={root} viewBox={viewBox} {...props}>
      {graph.transitions.map((t, i) => (
        <Transition key={t.id} id={t.id} transition={t} graph={graph} />
      ))}
    </Root>
  );
};

export default EdgeLayer;
