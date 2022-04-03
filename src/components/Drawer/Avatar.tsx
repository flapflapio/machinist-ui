import { Avatar } from "antd";

const defaultProfilePic =
  "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";

const defaultAvatar = (
  <Avatar
    size="large"
    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    //onClick={showDefaultDrawer}
  />
);

const DefaultAvatar = ({ src }: { src?: string }) => (
  <Avatar size="large" src={src ?? defaultProfilePic} />
);

export { defaultAvatar, DefaultAvatar, defaultProfilePic };
