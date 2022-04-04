import { Button, Drawer, Form, Input, Modal, Space } from "antd";
import { Auth } from "aws-amplify";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import BigMe from "./BigMe";
import { useEmail } from "./hook";
import { Me } from "./Me";
import { useProfile } from "./ProfileProvider";

const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  height: 100%;
  & > * {
    margin: 0.5em auto;
  }
`;

type FormValues = {
  email?: string;
};

const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
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

  const signOut = useCallback(() => Auth.signOut().catch(console.log), []);

  return useMemo(
    () => ({
      signOut,
      show,
      hide,
      state,
      visible,
      setState,
    }),
    [show, hide, state, setState, visible, signOut]
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AccountDrawer = () => {
  const { setProfile } = useProfile();
  const { show, hide, visible, signOut } = useAccountDrawerState();
  const email = useEmail();
  const prev = useMemo<FormValues>(() => ({ email }), [email]);
  const [current, setCurrent] = useState<FormValues>(prev);
  const changed = useMemo(() => current.email !== prev.email, [current, prev]);
  const [emailErr, setEmailErr] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        const email = user?.attributes?.email;
        setProfile((p) => ({ ...p, email }));
        setCurrent((c) => ({ ...c, email }));
      })
      .catch(console.log);
  }, []);

  const cancel = useCallback(() => {
    setCurrent(prev);
    setEmailErr(false);
  }, [setCurrent, prev]);

  const close = useCallback(() => {
    hide();
    cancel();
  }, [hide, cancel]);

  const emailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmailErr(false);
      setCurrent((c) => ({ ...c, email: e.target.value }));
    },
    [setCurrent, setEmailErr]
  );

  const submit = useCallback(() => {
    if (!validateEmail(current.email)) {
      setEmailErr(true);
      return;
    }

    // Otherwise, call amplify to change the email
    (async () => {
      const user = await Auth.currentAuthenticatedUser();
      const result = await Auth.updateUserAttributes(user, {
        email: current.email,
      });
      console.log(result);

      // Change the email in the state store
      const newEmail =
        (await Auth.currentAuthenticatedUser()).attributes?.email ??
        user.attributes?.email;

      setProfile((p) => ({ ...p, email: newEmail }));
    })().catch((err) => {
      setEmailErr(true);
      throw err;
    });
  }, [setEmailErr, current.email, setProfile]);

  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);

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
        onClose={close}
        visible={visible}
        extra={
          <Space>
            <Me />
          </Space>
        }
      >
        <FormRoot>
          <BigMe />
          <Row>
            <h3>Email: </h3>
            <Input value={current?.email ?? ""} onChange={emailChange} />
            {emailErr && <div style={{ color: "red" }}>Invalid email!</div>}
          </Row>
          <Row>
            <h3>Password: </h3>
            <Button onClick={() => setChangePasswordModalVisible((x) => !x)}>
              Change password
            </Button>
            <Modal
              title="Change password"
              visible={changePasswordModalVisible}
              onOk={() => setChangePasswordModalVisible(false)}
              onCancel={() => setChangePasswordModalVisible(false)}
              footer={[
                <Button
                  key="cancel"
                  type="ghost"
                  onClick={() => setChangePasswordModalVisible(false)}
                >
                  Cancel
                </Button>,
              ]}
            >
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={({
                  oldpass,
                  newpass,
                }: {
                  oldpass?: string;
                  newpass?: string;
                  newpass2?: string;
                }) => {
                  Auth.currentAuthenticatedUser()
                    .then((user) => Auth.changePassword(user, oldpass, newpass))
                    .then(console.log)
                    .then(() => setChangePasswordModalVisible(false))
                    .catch(console.log);
                }}
                onFinishFailed={console.log}
                autoComplete="off"
              >
                <Form.Item
                  label="Old password"
                  name="oldpass"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your old password...",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="New password"
                  name="newpass"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password...",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirm password"
                  name="newpass2"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password again...",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newpass") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match..."
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Row>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "10em",
              marginTop: "1.5em",
            }}
          >
            <Button type="primary" htmlType="submit" onClick={submit}>
              Update profile
            </Button>
            <Button
              style={{ marginTop: "0.5em" }}
              type="ghost"
              disabled={!changed}
              onClick={cancel}
            >
              Cancel
            </Button>
          </div>
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
