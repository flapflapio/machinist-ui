import { EditOutlined } from "@ant-design/icons";
import { Storage } from "aws-amplify";
import { ChangeEvent, ComponentPropsWithoutRef, useCallback } from "react";
import styled from "styled-components";
import { PROFILE_PIC } from "./hook";
import Me, { MeProps } from "./Me";
import { useProfile } from "./ProfileProvider";

const PROFILE_UPLOAD = "profile-upload";

const BigMeRoot = styled.div`
  position: relative;
`;

const ScaledMe = styled(Me)`
  transform: scale(5);
  margin: 5rem;
`;

const EditMeRoot = styled.button`
  position: absolute;
  background: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 0.25em 0.5em;
  top: 75%;
  left: 1em;
  &:hover,
  & label {
    cursor: pointer;
  }
`;

const EditMe = ({
  onFileChange,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <EditMeRoot {...props}>
    <label htmlFor={PROFILE_UPLOAD}>
      <EditOutlined style={{ marginRight: "0.25em" }} />
      Edit
    </label>
    <input
      id={PROFILE_UPLOAD}
      style={{ display: "none" }}
      type="file"
      onChange={onFileChange}
      accept=".png,.jpg"
    />
  </EditMeRoot>
);

const BigMe = ({ ...props }: MeProps): JSX.Element => {
  const {
    profile: { pic },
    setProfile,
  } = useProfile();

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files[0];
      setProfile((p) => ({ ...p, pic: f }));
      Storage.put(PROFILE_PIC, f).then(console.log);
    },
    [setProfile]
  );

  return (
    <BigMeRoot {...props}>
      <ScaledMe pic={pic} />
      <EditMe onFileChange={onFileChange} />
    </BigMeRoot>
  );
};

export default BigMe;
export { BigMe };
