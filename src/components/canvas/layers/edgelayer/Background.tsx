import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import styled from "styled-components";
import { useGraphSize } from "../../../data/graph";
import { Line } from "../../node/Transition";

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
  const [size, setSize] = useGraphSize();

  // const [size, setSize] = useState({ w: 1920, h: 1080 });
  useEffect(() => {
    const adjust = () =>
      setSize({
        width: window.innerWidth * 1.2,
        height: window.innerHeight * 1.2,
      });
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);

  // VERTICAL LINES
  const vertical = useMemo(
    () =>
      Object.keys([...Array(Math.round(size.width / hSpacing))]).map((_, i) => {
        const x = (i + 1) * hSpacing - hSpacing / 2;
        return {
          x1: `${x}px`,
          x2: `${x}px`,
          y1: "0px",
          y2: "100%",
        };
      }),
    [size, hSpacing]
  );

  // HORIZONTAL LINES
  const horizontal = useMemo(
    () =>
      Object.keys([...Array(Math.round(size.height / vSpacing))]).map(
        (_, i) => {
          const y = (i + 1) * vSpacing - vSpacing / 2;
          return {
            y1: `${y}px`,
            y2: `${y}px`,
            x1: "0%",
            x2: "100%",
          };
        }
      ),
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

export default Background;
export { Background };
