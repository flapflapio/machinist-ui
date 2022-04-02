import React, { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import { EdgeLayer } from "./layers/edgelayer";
import { NodeLayer } from "./layers/nodelayer";

const Root = styled.div`
  position: relative;
`;

type CanvasProps = ComponentPropsWithoutRef<"div">;
const Canvas = ({ ...props }: CanvasProps): JSX.Element => (
  <Root {...props}>
    <EdgeLayer />
    <NodeLayer />
  </Root>
);

export default Canvas;
export type { CanvasProps };
