import { Button } from "antd";
import { ComponentPropsWithoutRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { origin, ref, useGraph, useGraphActions } from "../data/graph";
import EdgeLayer from "./layers/EdgeLayer";
import NodeLayer from "./layers/NodeLayer";

const Root = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
`;

const Canvas = ({ ...props }: ComponentPropsWithoutRef<"div">): JSX.Element => {
  const { dispatch } = useGraphActions();
  const buttonRef = ref<HTMLButtonElement>(null);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch]);
  const add = useCallback(
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

  useEffect(() => {
    dispatch({
      type: "SET_SIZE",
      size: (s) => ({ ...s, width: 500, height: 300 }),
    });
    add();
    return clear;
  }, [clear, add, dispatch]);

  return (
    <Root {...props}>
      <Button
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
        onClick={add}
      >
        ADD
      </Button>

      <EdgeLayer />
      <NodeLayer />
    </Root>
  );
};

export default Canvas;
export { Canvas };
