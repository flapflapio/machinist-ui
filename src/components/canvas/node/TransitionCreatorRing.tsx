import { MouseEvent, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  computeLine,
  computeThirdPoint,
  pointIsAtEdgeOfCircle,
} from "../../data/graph";

const Root = styled.div`
  transition: all 500ms cubic-bezier(0.75, 0, 0.25, 1);

  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
  border-radius: 50%;
  box-sizing: border-box;
  width: 5.1em;
  height: 5.1em;
  z-index: 49;
`;

const Ball = styled.div<{ $active?: boolean; $x?: number; $y?: number }>`
  box-sizing: border-box;
  transition: background-color 200ms cubic-bezier(0.19, 1, 0.22, 1);
  height: 1em;
  width: 1em;
  background-color: rgba(173, 216, 230, 0);
  border-radius: 50%;

  z-index: 50;
  position: absolute;

  ${({ $active }) =>
    $active &&
    css`
      background-color: rgba(173, 216, 230, 1);
    `}
`;

const TransitionCreatorRing = ({ ...props } = {}): JSX.Element => {
  const [hovering, setHovering] = useState(false);
  const [ballPos, setBallPos] = useState({ $x: 0, $y: 0 });
  const root = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!root.current || !ball.current) return;
    const rect = root.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerPoint = { x: rect.left + radius, y: rect.top + radius };
    const mousePoint = { x: e.clientX, y: e.clientY };

    setHovering(pointIsAtEdgeOfCircle(centerPoint, mousePoint, radius, 0.7));

    const line = computeLine(centerPoint, mousePoint);
    const pointThree = computeThirdPoint(radius, line, centerPoint, mousePoint);
    const scalingFactor = 0.9;

    ball.current.style.transform = `translate(
      ${scalingFactor * (pointThree.x - centerPoint.x)}px,
      ${scalingFactor * (pointThree.y - centerPoint.y)}px
    )`;
  };

  const handleMouseEnter = () => {
    // setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <Root
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={root}
    >
      <Ball ref={ball} $active={hovering} {...ballPos} />
    </Root>
  );
};

export {
  TransitionCreatorRing,
  pointIsAtEdgeOfCircle,
  computeLine,
  computeThirdPoint,
};
