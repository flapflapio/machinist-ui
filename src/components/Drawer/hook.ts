import { Auth, Storage } from "aws-amplify";
import { useState, useEffect, useMemo } from "react";

/**
 * @returns The user's email
 */
const useEmail = (): string => {
  const [email, setEmail] = useState("U");
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setEmail(user?.attributes?.email))
      .catch(console.log);
  }, []);
  return email;
};

/**
 * @returns The first letter of the user's email capitalized. This can be used
 * as an alternative to displaying the user's profile pic
 */
const useAvatarLetter = (): string => {
  const email = useEmail();
  return useMemo(() => email.charAt(0).toUpperCase(), [email]);
};

const PROFILE_PIC = "profile.png";

/**
 * @returns A URL pointing to the profile pic, or null if the user has no
 * profile pic
 */
const useProfilePic = (): string => {
  const [pic, setPic] = useState<string>(null);
  useEffect(() => {
    Storage.get(PROFILE_PIC, { download: true })
      .then((data) => setPic(URL.createObjectURL(data as unknown as Blob)))
      .catch(() => setPic(null));
  }, []);
  return pic;
};

export { useProfilePic, useEmail, PROFILE_PIC, useAvatarLetter };
