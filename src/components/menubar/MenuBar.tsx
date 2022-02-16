import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Menu } from "antd";
import React, { ComponentPropsWithoutRef, useCallback, useState } from "react";
import styled from "styled-components";
import { theme } from "../../util/styles";
import { useDebuggerState } from "../data/debugger";
import { RunInputsModal, useModalState } from "../runinputs/RunInputsModal";
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

type ToggleProps = {
  collapsed?: boolean;
  toggle?: () => void;
} & ComponentPropsWithoutRef<"div">;

const Toggle = ({ collapsed, toggle }: ToggleProps) => (
  <ToggleButton type="primary" onClick={toggle ?? (() => null)}>
    <ToggleIcon $collapsed={collapsed} />
  </ToggleButton>
);

const useToggle = (initialValue = true): [boolean, () => void] => {
  const [collapsed, setCollapsed] = useState(initialValue);
  const toggle = useCallback(() => setCollapsed((s) => !s), [setCollapsed]);
  return [collapsed, toggle];
};

const SmallDivider = () => <Divider style={{ margin: "0.1em" }} />;

type MenuBarProps = ComponentPropsWithoutRef<"div">;
const MenuBar = ({ ...props }: MenuBarProps): JSX.Element => {
  const [collapsed, toggle] = useToggle();
  const debugToggle = useDebuggerState()[2];
  const modalControls = useModalState();

  return (
    <Root {...props}>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        selectedKeys={[]}
      >
        <RunInputsModal {...modalControls} />
        <Toggle collapsed={collapsed} toggle={toggle} />
        <SmallDivider />
        {placeHolderMenuItems({
          openDebugger: debugToggle,
          openRunInputMenu: modalControls.show,
        })}
      </Menu>
    </Root>
  );
};

export default MenuBar;
export type { MenuBarProps };
