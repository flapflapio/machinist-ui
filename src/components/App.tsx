import styled from "styled-components";
import { Canvas } from "./canvas/Canvas";
import { GraphProvider, useGraph } from "./data/graph";
import { KeyChordsProvider } from "./data/keychords";

const canvasBackgroundColor = "#F6F8FA";

const Content = styled.section``;

const DemoGraphViewerRoot = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  place-items: center;

  & > div {
    width: 50%;
  }
`;

const DemoGraphViewer = () => {
  const graph = useGraph();

  return (
    <DemoGraphViewerRoot>
      <h1>GRAPH STORE:</h1>
      <div>
        <pre>
          {JSON.stringify(
            graph.states.map((s) => ({ ...s, ref: null })),
            null,
            2
          )}
        </pre>
      </div>
    </DemoGraphViewerRoot>
  );
};

const Center = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;

  margin: 10em 0px;
`;

const App = (): JSX.Element => (
  <KeyChordsProvider>
    <GraphProvider>
      <main style={{ backgroundColor: canvasBackgroundColor, height: "100vh" }}>
        <Content>
          <Center>
            <div>
              {/* <State id="q1" /> */}
              <Canvas />
              {/* <MenuBar /> */}
              <DemoGraphViewer />
            </div>
          </Center>
        </Content>
      </main>
    </GraphProvider>
  </KeyChordsProvider>
);

export default App;
