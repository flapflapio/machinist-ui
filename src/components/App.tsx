import styled from "styled-components";
import Canvas from "./canvas/Canvas";
import { GraphProvider } from "./data/graph";
import { KeyChordsProvider } from "./data/keychords";
import MenuBar from "./menubar/MenuBar";

// const canvasBackgroundColor = "#F6F8FA";

const Main = styled.main`
  height: 100vh;
  width: 100vw;
`;

const FullscreenCanvas = styled(Canvas)`
  width: 100%;
  height: 100%;
`;

const FloatingMenuBar = styled(MenuBar)`
  position: absolute;
  inset: 30% auto auto 1rem;
  z-index: 100;
`;

const App = (): JSX.Element => (
  <KeyChordsProvider>
    <GraphProvider>
      <Main>
        <FullscreenCanvas />
        <FloatingMenuBar />
        {/* <GraphStoreDebugger /> */}
      </Main>
    </GraphProvider>
  </KeyChordsProvider>
);

export default App;
