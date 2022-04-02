import { DeleteOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { ComponentPropsWithoutRef, Dispatch, SetStateAction } from "react";

type Record = {
  name: string;
  size: string;
  lastModified: string;
};

type RecordUpload = Partial<Record> & {
  name: string;
  contents?: string;
};

type FileStorageTableProps = {
  dataSource?: Record[];
  setDataSource?: Dispatch<SetStateAction<Record[]>>;
  deleteFile?: (record: Record) => void;
  saveFile?: (upload: RecordUpload) => void;
} & ComponentPropsWithoutRef<"div">;

const FileStorageTable = ({
  dataSource = [],
  setDataSource = () => null,
  deleteFile = () => null,
  saveFile = () => null,
  ...props
}: FileStorageTableProps) => {
  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: 150,
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
      width: 150,
    },
    {
      title: "Actions",
      width: 150,
      render: (record: Record) => (
        <>
          <DeleteOutlined
            onClick={() => deleteFile(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  return (
    <div {...props}>
      <button
        onClick={() => {
          const name = Math.random().toString(36).substring(2, 7);
          return saveFile({
            name,
            contents: `My file: ${name}`.repeat(1 << 10),
          });
        }}
      >
        Upload new file
      </button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FileStorageTable;
export type { Record, RecordUpload };
