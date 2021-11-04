import { ComponentPropsWithoutRef, useMemo } from "react";
import styled from "styled-components";
import { midPoint, Point, useGraph } from "../../data/graph";
import { Text } from "../node/State";

type LabelRootProps = {
  $x?: number;
  $y?: number;
};

const LabelRoot = styled(Text).attrs<LabelRootProps>(({ $x, $y }) => ({
  style: {
    transform: `
      translate(calc(${$x ?? 0}px - 50%), calc(${$y ?? 0}px - 50%))
    `,
  },
}))<LabelRootProps>`
  position: absolute;
  inset: 0 auto auto 0;

  font-size: 1.25rem;
  height: 1.5em;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
`;

type LabelProps = ComponentPropsWithoutRef<"p"> & { point: Point };
const Label = ({
  children,
  point: { x, y },
  ...props
}: LabelProps): JSX.Element => (
  <LabelRoot $x={x} $y={y} {...props}>
    {children}
  </LabelRoot>
);

const Labels = (): JSX.Element => {
  const graph = useGraph();

  // The transitions store start and end states by state id, we need to search
  // the graph to find the locations for each state
  const transitions = useMemo(
    () =>
      graph.transitions.map((t) => ({
        ...t,
        start: graph.states.find((s) => s.id === t.start.state),
        end: graph.states.find((s) => s.id === t.end.state),
      })),
    [graph]
  );

  return (
    <>
      {}
      {transitions.map((t) => (
        <Label
          key={`transition-label_${t.id}_${t.symbol}`}
          point={midPoint(t.start.location, t.end.location)}
        >
          {t.symbol}
        </Label>
      ))}
    </>
  );
};

export { Labels, Label, LabelRoot };
export type { LabelProps };
