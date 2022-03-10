import { Dispatch, useCallback } from "react";
import { Graph, GraphAction, origin } from "../../data/graph";

const useNewTransitionCallback = (
  id: string,
  graph: Graph,
  dispatch: Dispatch<GraphAction>
): (() => void) =>
  useCallback(() => {
    // TODO: refactor this check so that it is performed on the dispatch
    // TODO: side rather than here.
    if (
      id === null ||
      id === undefined ||
      graph?.transitionInProgress?.start?.state === null ||
      graph?.transitionInProgress?.start?.state === undefined ||
      graph.transitions.find(
        (t) =>
          t.start.state === graph?.transitionInProgress?.start?.state &&
          t.end.state === id
      )
    ) {
      return;
    }

    dispatch({
      type: "ADD",
      transition: {
        id: "t_",
        start: graph.transitionInProgress.start,
        ref: null,
        symbol: "",
        end: {
          state: id,
          offset: origin(),
        },
      },
    });
  }, [dispatch, graph, id]);

export { useNewTransitionCallback };
