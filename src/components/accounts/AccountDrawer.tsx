import { Button, Drawer, Form, Input, Space } from "antd";
import { Auth } from "aws-amplify";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import BigMe from "./BigMe";
import { Me } from "./Me";

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  height: 100%;
`;

type FormValues = {};

/**
 * State management hook for all the drawer state.
 */
const useAccountDrawerState = () => {
  const [state, setState] = useState<{
    visible: boolean;
  }>({
    visible: false,
  });

  const visible = useMemo(() => state.visible, [state.visible]);

  const show = useCallback(
    () => setState((s) => ({ ...s, visible: true })),
    [setState]
  );

  const hide = useCallback(
    () => setState((s) => ({ ...s, visible: false })),
    [setState]
  );

  const submit = useCallback((values: FormValues) => {
    console.log(`Success: ${values}`);
  }, []);

  const submitFailed = useCallback((errorInfo) => {
    console.log(`Failed: ${errorInfo}`);
  }, []);

  const signOut = useCallback(() => Auth.signOut().catch(console.log), []);

  return useMemo(
    () => ({
      signOut,
      submitFailed,
      show,
      hide,
      state,
      visible,
      setState,
      submit,
    }),
    [show, hide, state, setState, visible, submit, submitFailed, signOut]
  );
};

const AccountDrawer = () => {
  const { show, hide, visible, submit, submitFailed, signOut } =
    useAccountDrawerState();

  return (
    <>
      <Space>
        <div onClick={show}>
          <Me />
        </div>
      </Space>
      <Drawer
        title={"Account"}
        placement="right"
        size="default"
        onClose={hide}
        visible={visible}
        extra={
          <Space>
            <Me />
          </Space>
        }
      >
        <FormRoot>
          <BigMe />
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={submit}
            onFinishFailed={submitFailed}
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
          <Button
            onClick={signOut}
            type="primary"
            shape="round"
            size={"large"}
            style={{ marginTop: "auto" }}
          >
            Sign out
          </Button>
        </FormRoot>
      </Drawer>
    </>
  );
};

export default AccountDrawer;
export { AccountDrawer };
