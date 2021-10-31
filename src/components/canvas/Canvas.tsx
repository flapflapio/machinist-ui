import { ComponentPropsWithoutRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { origin, ref, useGraphActions } from "../data/graph";
import EdgeLayer from "./layers/EdgeLayer";
import NodeLayer from "./layers/NodeLayer";

const Root = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
`;

type CanvasProps = ComponentPropsWithoutRef<"div">;

const Canvas = ({ ...props }: CanvasProps): JSX.Element => {
  const { dispatch } = useGraphActions();
  const buttonRef = ref<HTMLButtonElement>(null);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch]);

  const addInitial = useCallback(
    () =>
      dispatch({
        type: "ADD",
        states: [
          {
            id: "q0",
            ending: false,
            location: { x: 50, y: 50 },
            ref: null,
          },
          {
            id: "q1",
            ending: false,
            location: { x: 200, y: 175 },
            ref: null,
          },
        ],
        transitions: [
          {
            id: "t0",
            symbol: "a",
            start: { state: "q0", offset: origin() },
            end: { state: "q1", offset: origin() },
            ref: null,
          },
        ],
      }),
    [dispatch]
  );

  const addFresh = useCallback(
    () =>
      dispatch({
        type: "ADD",
        state: {
          id: "q_",
          ending: false,
          location: { x: 0, y: 0 },
          ref: null,
        },
      }),
    [dispatch]
  );

  useEffect(() => {
    addInitial();
    return () =>
      dispatch({
        type: "REMOVE",
        ids: ["q0", "q1", "t0"],
      });
  }, [clear, addInitial, dispatch]);

  return (
    <Root {...props}>
      {/* TODO: FLAP-71 - Move this buttons to the sidebar */}
      {/* <Button
        ref={buttonRef}
        style={{
          display: "relative",
          inset: "-50px auto auto 0",
        }}
        onClick={clear}
      >
        REMOVE
      </Button>
      <Button
        style={{
          display: "relative",
          inset: "-50px auto auto 100px",
        }}
        onClick={addFresh}
      >
        ADD
      </Button> */}
      <EdgeLayer />
      <NodeLayer />
    </Root>
  );
};

export default Canvas;
export type { CanvasProps };
