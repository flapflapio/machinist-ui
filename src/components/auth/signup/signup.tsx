import { Button, Input } from "antd";
import styled from "styled-components";
import { SignupModal } from "./signupmodal";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 20em;
  margin: auto;
  margin-top: 5em;
`;

const SignupUp = (): JSX.Element => (
  <Root>
    asdasd
    <Input placeholder="Email" />
    <Button>Click Me</Button>
    <SignupModal />
  </Root>
);

export { SignupUp };
