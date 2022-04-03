import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

type Profile = {
  pic?: File;
  email?: string;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: {},
  setProfile: () => null,
});

const ProfileProvider = ({
  children,
}: {
  children?: ReactNode;
}): JSX.Element => {
  const [profile, setProfile] = useState<Profile>({});
  const pkg = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);
  return (
    <ProfileContext.Provider value={pkg}>{children}</ProfileContext.Provider>
  );
};

const useProfile = () => useContext(ProfileContext);

export { ProfileProvider, ProfileContext, useProfile };
export default ProfileProvider;
