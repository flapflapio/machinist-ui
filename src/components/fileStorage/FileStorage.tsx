import { useState } from "react";
import { Modal, Button } from "antd";
import FileStorageTable from "./FileStorageTable";

const FileStorage = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button shape="circle" type="primary" onClick={() => setVisible(true)}>
        Open File Manager
      </Button>
      <Modal
        title="File Manager"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <FileStorageTable />
      </Modal>
    </>
  );
};

export default FileStorage;
