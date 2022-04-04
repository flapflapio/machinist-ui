import { Menu } from "antd";
import { ComponentPropsWithoutRef } from "react";
import styled from "styled-components";
import AccountDrawer from "../accounts/AccountDrawer";
import FileStorage from "../fileStorage/FileStorage";
import SaveButton from "./SaveButton";

const TopBarRoot = styled.div`
  min-width: 17em;
`;

const StyledMenu = styled(Menu)`
  border: 1px solid lightgray;
  border-radius: 5px;
`;

type TopBarProps = ComponentPropsWithoutRef<"div">;
const TopBar = ({ ...props }: TopBarProps) => {
  return (
    <TopBarRoot {...props}>
      <StyledMenu mode="horizontal" selectedKeys={[]}>
        <Menu.Item>
          <SaveButton />
        </Menu.Item>
        <Menu.Item>
          <FileStorage />
        </Menu.Item>
        <Menu.Item>
          <AccountDrawer />
        </Menu.Item>
      </StyledMenu>
    </TopBarRoot>
  );
};

export { TopBar };
export type { TopBarProps };
export default TopBar;
