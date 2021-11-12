import styled, { css } from "styled-components";

const SubMenu = styled.div.attrs<{ $center?: boolean }>(({ $center }) => ({
  $center: $center ?? true,
}))<{ $center?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-top: 0.5em;
  width: 100%;
  padding: 0 1em;

  ${({ $center }) =>
    $center &&
    css`
      place-content: center;
      place-items: center;
    `}

  & > * {
    margin: 0.3em 0.2em;
  }
`;

export default SubMenu;
