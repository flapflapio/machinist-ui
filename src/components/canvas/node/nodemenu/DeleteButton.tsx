import { Button } from "antd";
import styled from "styled-components";

const DeleteButton = styled(Button).attrs({
  children: "Delete",
  type: "primary",
  danger: true,
})`
  width: fit-content;
`;

export default DeleteButton;
