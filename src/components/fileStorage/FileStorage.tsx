import { ProfileOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Storage } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { prettySize } from "../../util/utils";
import FileStorageTable, { Record, RecordUpload } from "./FileStorageTable";

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
      3000
    );
    return () => clearInterval(interval);
  }, [setDataSource]);

  return (
    <>
      <ProfileOutlined
        style={{ transform: "scale(2)" }}
        onClick={() => setVisible(true)}
      />
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
          closeModal={() => setVisible(false)}
        />
      </Modal>
    </>
  );
};

export default FileStorage;
export { FileStorage };
