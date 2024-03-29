import { DeleteOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { GetComponentProps } from "rc-table/lib/interface";
import {
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { loadMachine } from "../../service";
import { useGraph } from "../data/graph";

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
  closeModal?: () => void;
} & ComponentPropsWithoutRef<"div">;

const noop = () => null;
const FileStorageTable = ({
  dataSource = [],
  setDataSource = noop,
  deleteFile = noop,
  saveFile = noop,
  closeModal = noop,
  ...props
}: FileStorageTableProps) => {
  const { dispatch } = useGraph();

  const columns = useMemo(
    () => [
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
    ],
    [deleteFile]
  );

  const onRow = useCallback<GetComponentProps<Record>>(
    (record) => ({
      onDoubleClick(e) {
        loadMachine(record.name)
          .then((states) =>
            dispatch({
              type: "MANIPULATE",
              manipulation: (g) => ({ ...g, ...states }),
            })
          )
          .then(closeModal);
      },
    }),
    [closeModal, dispatch]
  );

  return (
    <div {...props}>
      <Table
        onRow={onRow}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FileStorageTable;
export type { Record, RecordUpload, noop };
