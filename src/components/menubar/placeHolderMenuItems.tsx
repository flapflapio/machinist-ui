import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { ReactNode } from "react";

// ! Hack to prevent "`className` did not match errors for the ant components"
const IconWrapper = ({ children }: { children?: ReactNode }): JSX.Element => (
  <>{children}</>
);

const placeHolderMenuItems = ({
  openDebugger = () => null,
  openRunInputMenu = () => null,
  icons = {},
}: {
  openDebugger?: () => void;
  openRunInputMenu?: () => void;
  icons?: { sub1?: JSX.Element; sub2?: JSX.Element };
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
    <SubMenu
      key="sub1"
      icon={<IconWrapper>{icons?.sub1 ?? <MailOutlined />}</IconWrapper>}
      title="Navigation One"
    >
      <Menu.Item key="5">Option 5</Menu.Item>
      <Menu.Item key="6">Option 6</Menu.Item>
      <Menu.Item key="7">Option 7</Menu.Item>
      <Menu.Item key="8">Option 8</Menu.Item>
    </SubMenu>
    <SubMenu
      key="sub2"
      icon={<IconWrapper>{icons?.sub2 ?? <AppstoreOutlined />}</IconWrapper>}
      title="Navigation Two"
    >
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
