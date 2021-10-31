import styled from "styled-components";
import { useGraph } from "../data/graph";

const DemoGraphViewerRoot = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  place-items: center;

  & > div {
    width: 50%;
    word-wrap: break-word;
  }
`;

const GraphStoreDebugger = (): JSX.Element => {
  const graph = useGraph();

  return (
    <DemoGraphViewerRoot>
      <h1>GRAPH STORE:</h1>
      <div>
        <pre>
          {JSON.stringify(
            graph.states.map((s) => ({
              ...s,
              ref: s.ref?.current?.tagName
                ? `Ref: <${s.ref?.current?.tagName.toLowerCase()}>`
                : null,
            })),
            null,
            2
          )}
        </pre>
      </div>
    </DemoGraphViewerRoot>
  );
};

export default GraphStoreDebugger;
