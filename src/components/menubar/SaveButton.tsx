import { Button, Input, Modal } from "antd";
import { ChangeEvent, useCallback, useState } from "react";
import { saveMachine } from "../../service";
import { useGraph } from "../data/graph";

const SaveButton = () => {
  const { graph } = useGraph();
  const [modalVisible, setModalVisible] = useState(false);

  const [filename, setFilename] = useState("");
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilename(e.target.value),
    [setFilename]
  );

  const toggle = useCallback(
    () => setModalVisible((vis) => !vis),
    [setModalVisible]
  );

  const handleOk = useCallback(() => {
    setModalVisible(false);
    saveMachine(filename, graph);
  }, [setModalVisible, filename, graph]);

  const handleCancel = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  return (
    <>
      <Button type="primary" onClick={toggle}>
        Save
      </Button>
      <Modal visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
        <h3>Enter filename:</h3>
        <Input value={filename} onChange={handleChange} />
      </Modal>
    </>
  );
};

export { SaveButton };
export default SaveButton;
