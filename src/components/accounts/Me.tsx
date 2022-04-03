import { Avatar, AvatarProps } from "antd";
import styled from "styled-components";
import { PROFILE_PIC, useAvatarLetter, useEmail, useProfilePic } from "./hook";

const defaultProfilePic =
  "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";

type MeProps = Omit<AvatarProps, "src"> & { pic?: File };

const StyledAvatar = styled(Avatar)`
  border: 1px solid lightgray;
`;

/**
 * An Avatar containing either the user's profile pic, or the first letter of
 * the user's email capitalized.
 */
const Me = ({ pic, ...props }: MeProps): JSX.Element => {
  const src = useProfilePic();
  const alt = useAvatarLetter();
  return src === null ? (
    <StyledAvatar {...props}>{alt}</StyledAvatar>
  ) : (
    <StyledAvatar {...props} src={src} />
  );
};

export type { MeProps };
export { defaultProfilePic, Me, useProfilePic, useEmail, PROFILE_PIC };
export default Me;
