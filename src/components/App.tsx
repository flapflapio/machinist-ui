import Draggable from "react-draggable";
import styled from "styled-components";
import Canvas from "./canvas/Canvas";
import { FloatingNodeMenu } from "./canvas/node/nodemenu/FloatingNodeMenu";
import { DebuggerContextProvider } from "./data/debugger";
import { GraphProvider } from "./data/graph";
import { KeyChordsProvider } from "./data/keychords";
import { SelectedNodeProvider } from "./data/selectedstate";
import GraphStoreDebugger from "./debug/GraphStoreDebugger";
import MenuBar from "./menubar/MenuBar";
import Login from "./auth/login";

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

const MenuBarWithDebugger = () => (
  <DebuggerContextProvider>
    <FloatingMenuBar />
    <Draggable allowAnyClick>
      <GraphStoreDebugger />
    </Draggable>
  </DebuggerContextProvider>
);

const App = (): JSX.Element => (
  <KeyChordsProvider>
    <GraphProvider>
      <SelectedNodeProvider>
        <Main>
          <FullscreenCanvas />
          <MenuBarWithDebugger />
          <FloatingNodeMenu />
        </Main>
      </SelectedNodeProvider>
    </GraphProvider>
  </KeyChordsProvider>
);

export default App;
