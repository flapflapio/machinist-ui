import { useState } from "react";
import {
  Drawer as Drawerant,
  Button,
  Space,
  Form,
  Input,
  Checkbox,
} from "antd";
import { DownloadOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import styled from "styled-components";

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  height: 100%;
`;

const SignOutButton = ()=> {
  return(
    <Button
    type="primary"
    shape="round"
    size={"large"}
    style={{ marginTop: "auto" }}
  >
    Sign out
  </Button>
  )
};
const AvatarSpace = () =>{
  return(
  <Space>
  <Avatar
    size="large"
    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
  />
  </Space>)
};

const BigAvatar = styled(Avatar)`
  width: 10em;
  height: 10em;
`;

const SettingsButton = ({ onClick }) => {
  return (
    <Button
      type="primary"
      shape="circle"
      icon={<SettingOutlined />}
      size={"large"}
      onClick={onClick}
    ></Button>
  );
};

const Drawer = () => {
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<"default" | "large">("default");

  const showDefaultDrawer = () => {
    setSize("default");
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Space>
        <SettingsButton onClick={showDefaultDrawer} />
        <div onClick={showDefaultDrawer}>
          <Avatar
            size="large"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            //onClick={showDefaultDrawer}
          />
        </div>
      </Space>
      <Drawerant
        title={`User accounts`}
        placement="right"
        size={size}
        onClose={onClose}
        visible={visible}
        extra={
          <AvatarSpace />
        }
      >
        <div></div>
        <FormRoot>
          <BigAvatar
            size="large"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Modify
              </Button>
            </Form.Item>
          </Form>
              <SignOutButton />
        </FormRoot>
      </Drawerant>
    </>
  );
};

export default Drawer;
