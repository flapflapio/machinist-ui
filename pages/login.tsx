import { Button, Menu } from "antd";
import placeHolderMenuItems from "../src/components/menubar/placeHolderMenuItems";

const Login = (): JSX.Element => (
  <div>
    <Menu>{placeHolderMenuItems({})}</Menu>
    <Button>Click me</Button>
  </div>
);

export default Login;
