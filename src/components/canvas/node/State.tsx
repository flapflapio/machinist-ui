import { ComponentPropsWithRef, memo, useEffect, useRef } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { useGraphActions } from "../../data/graph";
import { TransitionCreatorRing } from "./TransitionCreatorRing";

type StateProps = ComponentPropsWithRef<"div"> & {
  id?: string;
};

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

const Text = styled.p<{ theme: DefaultTheme }>`
  font-size: 1.75em;
  font-weight: bold;
  font-style: italic;
  color: #7b8892;

  inset: 50% auto auto 50%;
  transform: translate(-55%, -55%);

  ${({ theme }) => theme?.mixins?.unselectable()}
`;

const size = "4rem";

const StateRoot = styled.div<{ theme?: DefaultTheme }>`
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1),
    box-shadow 1s cubic-bezier(0.19, 1, 0.22, 1)

    /* !!! DEBUG !!! */
    /* ; */
    , transform 0ms linear;
    /* !!! DEBUG !!! */

  position: relative;
  display: flex;
  flex-direction: column;

  place-items: center;
  place-content: center;

  border-radius: 50%;
  border: 2px solid #d0d7de;
  box-sizing: border-box;
  width: ${size};
  height: ${size};

  :hover {
    transform: scale(1.1);
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(140, 149, 159, 0.322);
  }

  & > * {
    position: absolute;
  }

  &:hover ${SecondaryBorder} {
    transform: scale(1);
    visibility: visible;
  }

  & > ${Rotating} {
    z-index: 10;
  }

  & > ${Text} {
    z-index: 20;
  }
`;

const State = memo(
  ({ id, ...props }: StateProps = { id: "q0" }): JSX.Element => {
    const { modifyState } = useGraphActions();
    const me = useRef<HTMLDivElement>(null);

    // When the node gets rendered, it registers itself in the GraphStore
    // When the node gets unrendered, it removes its reference from the store
    useEffect(() => {
      modifyState({ id, ref: me });
      // return () => modifyState({ id, ref: null });
    }, []);

    return (
      <StateRoot {...props} ref={me}>
        <Text>{id}</Text>
        <Rotating $rotating $speed={25}>
          <SecondaryBorder />
        </Rotating>
        <TransitionCreatorRing />
      </StateRoot>
    );
  }
);

State.displayName = "State";

export { State, StateRoot };
