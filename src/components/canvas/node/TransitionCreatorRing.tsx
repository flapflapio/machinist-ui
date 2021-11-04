import { ComponentPropsWithoutRef, MouseEvent, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  computeLine,
  computeThirdPoint,
  origin,
  pointIsAtEdgeOfCircle,
  useGraphAndGraphActions,
} from "../../data/graph";
import { useSelectedNode } from "../../data/selectedstate";

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

const Ball = styled.div<{ $active?: boolean }>`
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

type TransitionCreatorRingProps = {
  id: string;
  scalingFactor?: number;
} & ComponentPropsWithoutRef<"div">;

const TransitionCreatorRing = ({
  id,
  scalingFactor = 0.7,
  ...props
}: TransitionCreatorRingProps): JSX.Element => {
  const [hovering, setHovering] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const { dispatch } = useGraphAndGraphActions();
  const { setState: setSelected } = useSelectedNode();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!root.current || !ball.current) return;
    const rect = root.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerPoint = { x: rect.left + radius, y: rect.top + radius };
    const mousePoint = { x: e.clientX, y: e.clientY };

    setHovering(
      pointIsAtEdgeOfCircle(centerPoint, mousePoint, radius, scalingFactor)
    );

    const line = computeLine(centerPoint, mousePoint);
    const pointThree = computeThirdPoint(radius, line, centerPoint, mousePoint);

    ball.current.style.transform = `translate(
      ${(scalingFactor + 0.2) * (pointThree.x - centerPoint.x)}px,
      ${(scalingFactor + 0.2) * (pointThree.y - centerPoint.y)}px
    )`;
  };

  const handleMouseEnter = () => {
    // setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const onBallMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop clicks from reaching the NodeLayer

    setSelected({ id });
    dispatch({
      type: "ADD",
      transitionInProgress: {
        active: true,
        end: { x: e.clientX, y: e.clientY },
        start: { state: id, offset: origin() },
      },
    });
  };

  return (
    <Root
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={root}
    >
      <Ball ref={ball} onMouseDown={onBallMouseDown} $active={hovering} />
    </Root>
  );
};

export {
  TransitionCreatorRing,
  pointIsAtEdgeOfCircle,
  computeLine,
  computeThirdPoint,
};
