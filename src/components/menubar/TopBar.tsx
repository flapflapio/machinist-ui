import { Menu } from "antd";
import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import AccountDrawer from "../accounts/AccountDrawer";
import { Me } from "../accounts/Avatar";

const TopBarRoot = styled.div``;

const AccountManagement = () => {
  return (
    <>
      <AccountDrawer />
      <Me />
    </>
  );
};

type TopBarProps = ComponentPropsWithoutRef<"div">;
const TopBar = ({ ...props }: TopBarProps) => {
  return (
    <TopBarRoot {...props}>
      <Menu mode="horizontal" selectedKeys={[]}>
        <Menu.Item>
          <AccountManagement />
        </Menu.Item>
      </Menu>
    </TopBarRoot>
  );
};

export type { TopBarProps };
export { TopBar };
export default TopBar;
