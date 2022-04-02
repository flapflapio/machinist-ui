import { useState } from "react";
import { Button, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const FileStorageTable = () => {
  const [dataSource, setDataSource] = useState([
    {
      name: "first.json",
      user: "user1",
      lastaccess: "01-01-2022",
    },
    {
      name: "second.json",
      user: "user1",
      lastaccess: "01-01-2022",
    },
  ]);

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Last Access",
      dataIndex: "lastaccess",
      key: "lastaccess",
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => {
                onDeleteFile(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const onUploadNewFile = () => {
    const newEntry = {
      name: "new.json",
      user: "user1",
      lastaccess: "01-01-2022",
    };
    setDataSource((pre) => {
      return [...pre, newEntry];
    });
  };
  const onDeleteFile = (record) => {
    setDataSource((pre) => {
      return pre.filter((file) => file.name !== record.name);
    });
  };
  return (
    <div>
      <button onClick={onUploadNewFile}>Upload new file</button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      ></Table>
    </div>
  );
};

export default FileStorageTable;
