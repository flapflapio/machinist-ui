import { Button, Drawer, Form, Input, Space } from "antd";
import { Auth } from "aws-amplify";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import BigMe from "./BigMe";
import { useEmail } from "./hook";
import { Me } from "./Me";

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  height: 100%;
`;

type FormValues = {
  email?: string;
};

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

  const email = useEmail();
  const prev = useMemo<FormValues>(() => ({ email }), [email]);
  const [current, setCurrent] = useState<FormValues>(prev);
  const changed = useMemo(() => current.email !== prev.email, [current, prev]);

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
              label="Email"
              name="email"
              rules={[{ required: false, message: "Please input your email!" }]}
            >
              <Input
                value={current?.email ?? ""}
                onChange={(e) =>
                  setCurrent((c) => ({ ...c, email: e.target.value }))
                }
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: false, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "10em",
                }}
              >
                <Button type="primary" htmlType="submit">
                  Update profile
                </Button>
                <Button
                  style={{ marginTop: "1em" }}
                  type="ghost"
                  disabled={!changed}
                  onClick={() => setCurrent(prev)}
                >
                  Cancel
                </Button>
              </div>
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
