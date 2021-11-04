import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { ComponentPropsWithoutRef, useCallback, useState } from "react";
import styled from "styled-components";
import theme from "../../util/styles";
import placeHolderMenuItems from "./placeHolderMenuItems";

const Root = styled.div``;

const ToggleButton = styled(Button)`
  margin-bottom: 2px;
  width: 100%;
`;

const ToggleIcon = styled(DoubleLeftOutlined)<{ $collapsed?: boolean }>`
  transform: rotate(90deg);
  &&& {
    transition: transform 0.3s ${theme.transitions.atndMenuBarBezier};
  }
  ${({ $collapsed }) => $collapsed && `transform: rotate(-90deg)`}
`;

const Toggle = ({
  collapsed,
  toggle,
}: {
  collapsed?: boolean;
  toggle?: () => void;
} & ComponentPropsWithoutRef<"div">) => (
  <ToggleButton type="primary" onClick={toggle ?? (() => null)}>
    <ToggleIcon $collapsed={collapsed} />
  </ToggleButton>
);

type MenuBarProps = ComponentPropsWithoutRef<"div">;

const MenuBar = ({ ...props }: MenuBarProps): JSX.Element => {
  const [state, setState] = useState({ collapsed: false });
  const toggle = useCallback(
    () => setState((s) => ({ ...s, collapsed: !s.collapsed })),
    [setState]
  );

  return (
    <Root {...props}>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={state.collapsed}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
      >
        <Toggle collapsed={state.collapsed} toggle={toggle} />
        {placeHolderMenuItems()}
      </Menu>
    </Root>
  );
};

export default MenuBar;
export type { MenuBarProps };
