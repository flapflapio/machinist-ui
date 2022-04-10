import { CloseOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import { Storage } from "aws-amplify";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled, { css } from "styled-components";

const hoverscale = (scale: number = 1.3) => css`
  transition: transform 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    transform: scale(${scale});
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;

  margin: 0;
  padding: 0;

  width: 100vw;
  height: 100vh;

  place-content: center;
  place-items: center;
`;

type UploadFileFunction = ({
  filename,
  text,
}: {
  filename?: string;
  text?: string;
}) => void;

type FormData = {
  filename: string;
  text: string;
};

const blankForm = () => ({
  filename: "",
  text: "",
});

const useForm = (onSubmit: UploadFileFunction) => {
  const [data, setData] = useState(blankForm());

  const submit = useCallback(
    (d: FormData) => {
      onSubmit(d);
      setData(blankForm());
    },
    [onSubmit, setData]
  );

  return useMemo(
    () => ({
      data,
      setData,
      submit: () => submit(data),
      onFilenameChange: (e: ChangeEvent<HTMLInputElement>) =>
        setData((d) => ({ ...d, filename: e.target.value })),
      onTextAreaChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
        setData((d) => ({ ...d, text: e.target.value })),
    }),
    [data, setData, submit]
  );
};

const Form = ({ onSubmit, ...props }: { onSubmit?: UploadFileFunction }) => {
  const { data, onFilenameChange, submit, onTextAreaChange } =
    useForm(onSubmit);

  return (
    <div {...props}>
      <h2>Type in some text to upload a file</h2>
      <Input value={data.filename} onChange={onFilenameChange} />
      <TextArea rows={5} value={data.text} onChange={onTextAreaChange} />
      <Button onClick={submit}>Upload</Button>
      <FileListing />
    </div>
  );
};

const StyledForm = styled(Form)`
  width: 40em;

  & > * {
    margin: 0.5em;
  }
`;

const FileEntryText = styled(Text)``;

const FileEntryRoot = styled(Button).attrs((props) => ({
  type: "text",
  ...props,
}))`
  display: flex;
  justify-content: space-between;
  height: 2em;
  flex-direction: row;
  width: 100%;

  & > * {
    place-self: center;
  }

  ${hoverscale(1.025)}
`;

const DeleteFileButton = styled(Button)`
  ${hoverscale()}
`;

type ModalType = {
  enabled: boolean;
  title: string;
  contents: string;
};

const useModal = (filename: string = "") => {
  const [modal, setModal] = useState({
    enabled: false,
    title: filename ?? "",
    contents: "",
  });

  useEffect(() => {
    if (!modal.title || modal.title === "") {
      setModal((m) => ({ ...m, contents: "" }));
      return;
    }
    Storage.get(modal.title, { level: "private", download: true })
      // .then((data) => "")
      .then((data) => data?.Body?.text?.())
      .then((contents) => setModal((m) => ({ ...m, contents })))
      .catch((err) => setModal((m) => ({ ...m, title: "", contents: err })));
  }, [modal, setModal]);

  return useMemo(
    () => ({
      modal,
      setModal,
      showModal: () => setModal((m) => ({ ...m, enabled: true })),
      handleOk: () => setModal((m) => ({ ...m, enabled: false, title: "" })),
      handleCancel: () =>
        setModal((m) => ({ ...m, enabled: false, title: "" })),
    }),
    [modal, setModal]
  );
};

const FileEntry = ({
  filename,
  setModal,
}: {
  filename: string;
  setModal?: Dispatch<SetStateAction<ModalType>>;
}) => {
  const remove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      Storage.remove(filename, { level: "private" });
    },
    [filename]
  );

  const show = useCallback(
    () => setModal((m) => ({ ...m, enabled: true, title: filename })),
    [filename, setModal]
  );

  return (
    <FileEntryRoot onClick={show}>
      <FileEntryText>{filename}</FileEntryText>
      <DeleteFileButton type="text" onClick={remove}>
        <CloseOutlined />
      </DeleteFileButton>
    </FileEntryRoot>
  );
};

const FileListingRoot = styled.div`
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 0.5em;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileListing = ({ ...props }) => {
  const [files, setFiles] = useState<string[]>([]);
  const { modal, setModal, handleOk, handleCancel } = useModal();

  useEffect(() => {
    const interval = setInterval(
      () =>
        Storage.list("", { level: "private" })
          .then((result) => {
            setFiles(result.map((r) => r.key));
          })
          .catch((_err) => {
            setFiles([]);
          }),
      500
    );

    return () => clearInterval(interval);
  }, [setFiles]);

  return (
    <FileListingRoot {...props} style={{}}>
      <Modal
        title={modal.title}
        visible={modal.enabled}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modal.contents}
      </Modal>
      <h2>File Listing</h2>
      {files.length === 0 ? (
        <div>...</div>
      ) : (
        files.map((f, i) => (
          <FileEntry key={`${f}-${i}`} filename={f} setModal={setModal} />
        ))
      )}
    </FileListingRoot>
  );
};

/**
 * A demo of how to use user storage
 */
const StorageDemo = () => {
  const onSubmit = useCallback<UploadFileFunction>(({ filename, text }) => {
    Storage.put(filename, text, {
      level: "private",
      contentType: "text/plain",
    })
      .then(console.log)
      .catch(console.log);
  }, []);

  return (
    <Root>
      <StyledForm onSubmit={onSubmit} />
    </Root>
  );
};

export default StorageDemo;
