import { Input } from "antd";
import React, {
  ChangeEvent,
  ComponentPropsWithoutRef,
  useCallback,
  useMemo,
} from "react";
import styled from "styled-components";
import { Graph, Transition, useGraph } from "../../../data/graph";

const useCurrent = (graph: Graph, id: string) =>
  useMemo(() => graph.transitions.find((t) => t.id === id), [graph, id]);

const useEditTransitionCallback = (
  dispatch: React.Dispatch<
    import("/home/ethanbenabou/git/490/machinist-ui/src/components/data/graph").GraphAction
  >,
  current: Transition
) =>
  useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: "ADD",
        transition: {
          ...current,
          symbol: e.target.value,
        },
      }),
    [dispatch, current]
  );

const EditableTransitionRoot = styled.div`
  display: flex;

  & input {
    margin-left: 0.5em;
    width: 65%;
  }
`;

type EditableTransitionProps = ComponentPropsWithoutRef<"div"> & {
  id: string;
  from: string;
  to: string;
};

const EditableTransition = ({
  id,
  from,
  to,
  ...props
}: EditableTransitionProps): JSX.Element => {
  const { graph, dispatch } = useGraph();
  const current = useCurrent(graph, id);
  const editTransition = useEditTransitionCallback(dispatch, current);

  return (
    <EditableTransitionRoot {...props}>
      <span>
        {from} → {to}
      </span>
      <Input
        size="small"
        onChange={editTransition}
        placeholder="Symbol"
        value={current.symbol}
      />
    </EditableTransitionRoot>
  );
};

export default EditableTransition;
