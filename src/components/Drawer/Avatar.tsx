import { Avatar, AvatarProps } from "antd";
import { PROFILE_PIC, useAvatarLetter, useEmail, useProfilePic } from "./hook";

const defaultProfilePic =
  "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";

type MeProps = Omit<AvatarProps, "src">;

/**
 * An Avatar containing either the user's profile pic, or the first letter of
 * the user's email capitalized.
 */
const Me = ({ ...props }: MeProps): JSX.Element => {
  const src = useProfilePic();
  const alt = useAvatarLetter();
  return src === null ? (
    <Avatar {...props}>{alt}</Avatar>
  ) : (
    <Avatar {...props} src={src} />
  );
};

export type { MeProps };
export { defaultProfilePic, Me, useProfilePic, useEmail, PROFILE_PIC };
