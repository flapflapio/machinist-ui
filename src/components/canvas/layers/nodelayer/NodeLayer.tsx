import { ComponentPropsWithoutRef, MouseEvent, useCallback } from "react";
import styled from "styled-components";
import { useGraphAndGraphActions } from "../../../data/graph";
import {
  useListOfSelectedNodeState,
  useSelectedNode,
} from "../../../data/selectedstate";
import { Labels } from "../../labels/Labels";
import { StateRoot } from "../../node/State";
import {
  useAdjust,
  useDoubleClicker,
  useDragging,
  useMouseDown,
  useMouseMove,
  usePassiveAdjust,
  useStateMapper,
} from "./hooks";

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: absolute !important;
  inset: 0 auto auto 0;
  z-index: 10;
  box-sizing: border-box;

  & > ${StateRoot} {
    position: absolute;
  }
`;

type NodeLayerProps = ComponentPropsWithoutRef<"div">;

const NodeLayer = ({ ...props }: NodeLayerProps): JSX.Element => {
  const { graph, dispatch } = useGraphAndGraphActions();
  const { dragging, startDragging, stopDragging } = useDragging(graph);
  const adjust = useAdjust();
  const mouseMove = useMouseMove({ graph, dispatch, dragging, adjust });
  const [stateAndIndex, setStateAndIndex] = useListOfSelectedNodeState();
  const { unset } = useSelectedNode();

  const onMouseDown = useMouseDown(setStateAndIndex, startDragging);
  const onMouseUp = useCallback(() => {
    stopDragging();
    dispatch({
      type: "ADD",
      transitionInProgress: {
        active: false,
        start: null,
        end: null,
      },
    });
    // Process any new transitions that are in the process of being created
  }, [stopDragging, dispatch]);

  const stateAndIndexToElement = useStateMapper(onMouseDown);
  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (graph.transitionInProgress.active) {
        dispatch({
          type: "ADD",
          transitionInProgress: {
            end: { x: e.clientX, y: e.clientY },
          },
        });
      }

      if (
        stateAndIndex[0] &&
        stateAndIndex[1] >= 0 &&
        stateAndIndex[1] < dragging.length
      ) {
        mouseMove(...stateAndIndex)(e);
      }
    },
    [
      stateAndIndex,
      mouseMove,
      dragging,
      dispatch,
      graph.transitionInProgress.active,
    ]
  );

  const doubleClick = useDoubleClicker(
    useCallback(
      (e: MouseEvent<HTMLDivElement>) =>
        dispatch({
          type: "ADD",
          state: {
            id: "q_",
            ending: false,
            location: graph.eventToSvgCoords(e),
            ref: null,
          },
        }),
      [dispatch, graph]
    ),
    unset
  );

  usePassiveAdjust(graph, adjust);
  return (
    <Root
      {...props}
      onClick={doubleClick}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <Labels />
      {graph.states.map(stateAndIndexToElement)}
    </Root>
  );
};

export default NodeLayer;
export { NodeLayer };
