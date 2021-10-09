import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  DoubleLeftOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useCallback, useState } from "react";
import styled, { StyledComponent } from "styled-components";

const Root = styled.div`
  width: 256px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleButton = styled(Button)`
  margin-bottom: 16px;
`;

const ToggleIcon = styled(DoubleLeftOutlined)<{ $collapsed?: boolean }>`
  transform: rotate(90deg);
  transition: cubic-bezier(0.075, 0.82, 0.165, 1);
  ${({ $collapsed }) => $collapsed && `transform: rotate(-90deg)`}
`;

const MenuBar = (): JSX.Element => {
  const [state, setState] = useState({ collapsed: false });

  const toggle = useCallback(
    () => setState((s) => ({ ...s, collapsed: !s.collapsed })),
    [setState]
  );

  return (
    <Root>
      <ToggleButton type="primary" onClick={toggle}>
        <ToggleIcon $collapsed={state.collapsed} />
      </ToggleButton>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={state.collapsed}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
      >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
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
      </Menu>
    </Root>
  );
};

export default MenuBar;

export { MenuBar };
