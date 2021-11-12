import clsx from "clsx";
import {
  ComponentPropsWithRef,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { theme } from "../../../util/styles";
import { useGraph } from "../../data/graph";
import { useSelectedNode } from "../../data/selectedstate";
import { useNewTransitionCallback } from "./hooks";
import { Arrow } from "./Transition";
import { TransitionCreatorRing } from "./TransitionCreatorRing";

const Rotating = styled.span<{ $rotating?: boolean; $speed?: number }>`
  display: inline-block;

  ${({ $rotating, $speed }) =>
    $rotating &&
    css`
      animation: ${$speed ?? 25}s linear infinite rotating;
    `}

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SecondaryBorder = styled.div`
  transition: all 300ms cubic-bezier(0.75, 0, 0.25, 1);

  border-radius: 50%;
  border: 2px dashed rgb(173, 216, 230);
  width: 5em;
  height: 5em;

  transform: scale(0.1);
  visibility: hidden;
`;

const unselectable = theme.mixins.unselectable();
const Text = styled.p<{ theme: DefaultTheme }>`
  font-size: 1.75em;
  font-weight: bold;
  font-style: italic;
  color: #7b8892;

  inset: 50% auto auto 50%;
  transform: translate(-55%, -55%);

  ${unselectable}
`;

const active = (scale = 1) => css`
  transform: scale(1.1);
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(140, 149, 159, 0.322);
  ${SecondaryBorder} {
    transform: scale(${scale});
    visibility: visible;
  }
`;

const circleStyle = (size: string) => css`
  position: relative;
  background: white;
  border-radius: 50%;
  border: 2px solid #d0d7de;
  box-sizing: border-box;
  width: ${size};
  height: ${size};
`;

const small = "4rem";
const FirstCircle = styled.div`
  ${circleStyle("4rem")}
`;

const SecondCircle = styled.div`
  ${circleStyle("4.5rem")}
`;

const StateRoot = styled.div<{ $active?: boolean; $ending?: boolean }>`
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1),
    box-shadow 1s cubic-bezier(0.19, 1, 0.22, 1), transform 0ms linear;

  background: white;

  position: relative;
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;

  border-radius: 50%;
  box-sizing: border-box;
  width: ${small};
  height: ${small};

  & > * {
    position: absolute;
  }

  & > ${Rotating} {
    z-index: 10;
  }

  & > ${Text} {
    z-index: 20;
  }

  & > ${FirstCircle} {
    z-index: 10;
  }

  & > ${SecondCircle} {
    z-index: 5;
  }

  & > svg {
    position: relative;
    transform: scale(1.15);
    inset: auto auto auto ${({ $ending }) => ($ending ? -80 : -75)}%;
    z-index: 20;
  }

  /* "active" styling can be triggered by prop or by hover */
  ${({ $active, $ending }) => $active && active($ending ? 1.12 : 1)}
  :hover {
    ${({ $ending }) => active($ending ? 1.12 : 1)}
  }
`;

type StateProps = ComponentPropsWithRef<"div"> & {
  id?: string;
  activeOverride?: boolean;
};

const State = memo(
  (
    {
      id,
      className,
      activeOverride,
      onMouseDown: propsMouseDown,
      onMouseUp: propsMouseUp,
      onMouseMove: propsMouseMove,
      ...props
    }: StateProps = { id: "q0" }
  ): JSX.Element => {
    const { modifyState, dispatch, graph } = useGraph();
    const me = useRef<HTMLDivElement>(null);
    const moved = useRef(false);
    const createNewTransition = useNewTransitionCallback(id, graph, dispatch);
    const { state: selected, prev, unset } = useSelectedNode();

    const imSelected = useMemo(() => selected?.id === id, [selected, id]);
    const imPrev = useMemo(() => prev?.state?.id === id, [prev, id]);
    const imStarting = useMemo(() => graph.starting === id, [graph, id]);
    const imEnding = useMemo(
      () => graph.states.find((s) => s.id === id)?.ending,
      [graph, id]
    );

    const onMouseUp = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (imPrev && !moved.current) unset();
        createNewTransition();
        if (propsMouseUp) propsMouseUp(e);
      },
      [createNewTransition, moved, unset, propsMouseUp, imPrev]
    );

    const onMouseDown = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        moved.current = false;
        if (propsMouseDown) propsMouseDown(e);
      },
      [moved, propsMouseDown]
    );

    const onMouseMove = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        moved.current = true;
        if (propsMouseMove) propsMouseMove(e);
      },
      [moved, propsMouseMove]
    );

    // When the node gets rendered, it registers itself in the GraphStore
    // When the node gets unrendered, it removes its reference from the store
    useEffect(() => {
      modifyState({ id, ref: me });
      // return () => modifyState({ id, ref: null });
    }, []);

    return (
      <StateRoot
        {...props}
        ref={me}
        className={clsx(className, "state")}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        $active={activeOverride ?? imSelected}
        $ending={imEnding}
      >
        {imStarting && <Arrow />}
        <FirstCircle />
        {imEnding && <SecondCircle />}
        <Text>{id}</Text>
        <Rotating $rotating $speed={25}>
          <SecondaryBorder />
        </Rotating>
        <TransitionCreatorRing id={id} scalingFactor={imEnding ? 0.85 : 0.7} />
      </StateRoot>
    );
  }
);

State.displayName = "State";

export { State, StateRoot, Text };
