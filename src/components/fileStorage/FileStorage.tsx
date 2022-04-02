import { useCallback, useEffect, useState } from "react";
import { Modal, Button } from "antd";
import FileStorageTable, { Record, RecordUpload } from "./FileStorageTable";
import { Storage } from "aws-amplify";
import { prettySize } from "../../util/utils";

const FileStorage = () => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<Record[]>([]);

  const deleteFile = useCallback(
    (record: Record) => Storage.remove(record.name, { level: "private" }),
    []
  );

  const saveFile = useCallback(
    (record: RecordUpload) =>
      Storage.put(record.name, record.contents ?? "", {
        level: "private",
        contentType: "text/plain",
      }).then(console.log),
    []
  );

  useEffect(() => {
    const interval = setInterval(
      () =>
        Storage.list("", { level: "private" })
          .then((result) =>
            setDataSource(
              result.map((r) => ({
                name: r.key,
                size: prettySize(r.size),
                lastModified: r.lastModified.toTimeString().substring(0, 8),
              }))
            )
          )
          .catch((err) => {
            setDataSource([]);
            throw err;
          }),
      1000
    );
    return () => clearInterval(interval);
  }, [setDataSource]);

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
        <FileStorageTable
          dataSource={dataSource}
          setDataSource={setDataSource}
          deleteFile={deleteFile}
          saveFile={saveFile}
        />
      </Modal>
    </>
  );
};

export default FileStorage;
