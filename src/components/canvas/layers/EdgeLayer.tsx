import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { DefaultTheme, StyledComponent } from "styled-components";
import { useGraph, useGraphActions } from "../../data/graph";
import Transition, { Line, svgNs } from "../node/Transition";

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

const BackgroundLine = styled(Line)`
  filter: invert(98%) sepia(2%) saturate(253%) hue-rotate(258deg)
    brightness(116%) contrast(81%);
`;

/**
 * This component renders the background of the canvas. It senses the dimensions
 * of the canvas and draws the lines dynamically.
 */
const Lines = ({
  hSpacing = 25,
  vSpacing = 25,
  lineProps,
  ...props
}: ComponentPropsWithoutRef<"g"> & {
  lineProps?: ComponentPropsWithoutRef<"line">;
  vSpacing?: number;
  hSpacing?: number;
}) => {
  const [size, setSize] = useState({ w: 1920, h: 1080 });
  useEffect(() => {
    const adjust = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);

  // VERTICAL LINES
  const vertical = useMemo(
    () =>
      Object.keys([...Array(Math.round(size.w / hSpacing))]).map((_, i) => {
        const x = (i + 1) * hSpacing - hSpacing / 2;
        return {
          x1: `${x}px`,
          x2: `${x}px`,
          y1: "0%",
          y2: "100%",
        };
      }),
    [size, hSpacing]
  );

  // HORIZONTAL LINES
  const horizontal = useMemo(
    () =>
      Object.keys([...Array(Math.round(size.h / vSpacing))]).map((_, i) => {
        const y = (i + 1) * vSpacing - vSpacing / 2;
        return {
          y1: `${y}px`,
          y2: `${y}px`,
          x1: "0%",
          x2: "100%",
        };
      }),
    [size, vSpacing]
  );

  const toElements = useCallback(
    (l) => (
      <BackgroundLine
        stroke="black"
        {...lineProps}
        {...l}
        key={`background-line_${JSON.stringify(l)}`}
      />
    ),
    [lineProps]
  );

  return (
    <g {...props}>
      {vertical.map(toElements)}
      {horizontal.map(toElements)}
    </g>
  );
};

const Background = styled(Lines)`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0 auto auto 0;
  z-index: 0;
  box-sizing: border-box;
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
      <Background />
      {graph.transitions.map((t) => (
        <Transition key={t.id} id={t.id} transition={t} graph={graph} />
      ))}
    </Root>
  );
};

export default EdgeLayer;
