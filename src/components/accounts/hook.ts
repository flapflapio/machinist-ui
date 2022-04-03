import { Auth, Storage } from "aws-amplify";
import { useEffect, useMemo } from "react";
import { useProfile } from "./ProfileProvider";

/**
 * @returns The user's email
 */
const useEmail = (): string => {
  const { profile, setProfile } = useProfile();
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) =>
        setProfile((p) => ({ ...p, email: user?.attributes?.email }))
      )
      .catch(console.log);
  }, [setProfile]);
  return profile.email;
};

/**
 * @returns The first letter of the user's email capitalized. This can be used
 * as an alternative to displaying the user's profile pic
 */
const useAvatarLetter = (): string => {
  const email = useEmail();
  return useMemo(() => email?.charAt(0).toUpperCase() ?? "U", [email]);
};

const PROFILE_PIC = "profile.png";

/**
 * @returns A URL pointing to the profile pic, or null if the user has no
 * profile pic
 */
const useProfilePic = (): string => {
  const { profile, setProfile } = useProfile();
  const pic = useMemo(
    () =>
      profile.pic === null || profile.pic === undefined
        ? null
        : URL.createObjectURL(profile.pic),
    [profile.pic]
  );

  useEffect(() => {
    Storage.get(PROFILE_PIC, { download: true }).then((data) =>
      setProfile((p) => ({
        ...p,
        pic: new File([data.Body as unknown as Blob], PROFILE_PIC),
      }))
    );
  }, [setProfile]);

  return pic;
};

export { useProfilePic, useEmail, PROFILE_PIC, useAvatarLetter };
