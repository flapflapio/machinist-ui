import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

const placeHolderMenuItems = ({
  openDebugger = () => null,
  openRunInputMenu = () => null,
}: {
  openDebugger?: () => void;
  openRunInputMenu?: () => void;
} = {}): JSX.Element => (
  <>
    <Menu.Item key="1" onClick={openDebugger} icon={<PieChartOutlined />}>
      Debug
    </Menu.Item>
    <Menu.Item key="2" onClick={openRunInputMenu} icon={<DesktopOutlined />}>
      Run Input
    </Menu.Item>
    <Menu.Item key="3" icon={<ContainerOutlined />}>
      Option 3
    </Menu.Item>
    <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
      <Menu.Item key="5">Option 5</Menu.Item>
      <Menu.Item key="6">Option 6</Menu.Item>
      <Menu.Item key="7">Option 7</Menu.Item>
      <Menu.Item key="8">Option 8</Menu.Item>
    </SubMenu>
    <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
      <Menu.Item key="9">Option 9</Menu.Item>
      <Menu.Item key="10">Option 10</Menu.Item>
      <SubMenu key="sub3" title="Submenu">
        <Menu.Item key="11">Option 11</Menu.Item>
        <Menu.Item key="12">Option 12</Menu.Item>
      </SubMenu>
    </SubMenu>
  </>
);

export default placeHolderMenuItems;
