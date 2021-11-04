import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, ModalProps } from "antd";
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { simulate } from "../../service";
import { useGraphAndGraphActions } from "../data/graph";

const useModalState = (): {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
} => {
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), [setVisible]);
  const hide = useCallback(() => setVisible(false), [setVisible]);
  const toggle = useCallback(() => setVisible((v) => !v), [setVisible]);
  return useMemo(() => ({ visible, setVisible, show, hide, toggle }), [
    visible,
    setVisible,
    show,
    hide,
    toggle,
  ]);
};

const TapeEntryRoot = styled.div`
  display: flex;
  place-items: center;
  & > * {
    margin: 0 0.5em;
  }
`;

type TapeEntryProps = ComponentPropsWithoutRef<"div"> & {
  setMsg: (text: string) => void;
};
const TapeEntry = ({ setMsg, ...props }: TapeEntryProps) => {
  const { graph } = useGraphAndGraphActions();
  const [loading, setLoading] = useState(false);
  const [tape, setTape] = useState("");
  const [success, setSuccess] = useState<boolean>(null);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setTape(e.target.value),
    [setTape]
  );

  const onSubmit = useCallback(() => {
    setLoading(true);
    simulate(graph, tape)
      .then((r) => {
        setMsg(JSON.stringify(r));
        setSuccess(r.Accepted);
      })
      .catch((err) => {
        setMsg(`${err}`);
        setSuccess(false);
      })
      .finally(() => setLoading(false));
  }, [tape, setLoading, graph, setMsg]);

  return (
    <TapeEntryRoot {...props}>
      <span>Tape:</span>
      <Input
        placeholder="Write your input tape here"
        value={tape}
        onChange={onChange}
      />
      <span style={{ transform: "scale(1.4)" }}>
        {loading ? (
          <LoadingOutlined />
        ) : (
          success !== null &&
          (success ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#eb2f2f" />
          ))
        )}
      </span>
      <Button type="primary" onClick={onSubmit}>
        Submit
      </Button>
    </TapeEntryRoot>
  );
};

type RunInputsModalProps = ModalProps & {
  visible?: boolean;
  show?: () => void;
  hide?: () => void;
};

const RunInputsModal = ({
  hide,
  ...props
}: RunInputsModalProps): JSX.Element => {
  const [responseMessage, setResponseMessage] = useState<string>(null);

  return (
    <Modal title="Run Inputs" onOk={hide} onCancel={hide} {...props}>
      <TapeEntry setMsg={setResponseMessage} />
      <p
        style={{
          marginTop: "1.2em",
          color: responseMessage?.includes("Error") ? "red" : "",
        }}
      >
        {responseMessage}
      </p>
    </Modal>
  );
};

export { RunInputsModal, useModalState };
