import { SettingOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import { Me } from "../Drawer/Avatar";

const TopBarRoot = styled.div`
  & svg {
    transform: scale(1.5);
  }
`;

type TopBarProps = ComponentPropsWithoutRef<"div">;

const TopBar = ({ ...props }: TopBarProps) => {
  return (
    <TopBarRoot {...props}>
      <Menu mode="horizontal" selectedKeys={[]}>
        <Menu.Item>
          <SettingOutlined />
        </Menu.Item>
        <Menu.Item>
          <Me />
        </Menu.Item>
      </Menu>
    </TopBarRoot>
  );
};

export type { TopBarProps };
export { TopBar };
export default TopBar;
