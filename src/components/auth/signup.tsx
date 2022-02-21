import { GoogleOutlined, GithubFilled, SendOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import "antd/dist/antd.css";
import React from "react";
import styled from "styled-components";
import background from "../../../public/images/flapflap.svg";
import logo from "../../../public/images/flapflap1.png";

// container for signup page trial
const Container = styled.div`
  /* background setup */
  background-image: url(${background.src});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  /* border:  5px solid black; */
  flex-direction: column;
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  place-items: center;
  place-content: center;
  box-sizing: border-box;
`;

const SmallBox = styled.div`
  width: 37em;
  grid-column: 2;
  grid-row: 2;
  display: grid;
  grid-gap: 10px;
  margin: auto 0;
  padding: 20px;
  background-color: #fffcf1;
  border-radius: 50px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  background-image: url(${logo.src});
  background-size: 9em 9em;
  background-position: center;
  background-repeat: no-repeat;
  padding: 5em;
`;

const Filedset = styled.div`
  margin: 55;
  background-color: #fffcf7;
  border: none;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
const CenterLink = styled.div`
  margin: auto;
  width: 40%;
  padding: 0px;
`;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Signup() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Container>
      <SmallBox>
        <Logo> </Logo>
        <Filedset>
          <legend>Sign Up </legend>

          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              label="Username"
              tooltip="What do want your login pseudoname to be?"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                  message: "Please select gender!",
                },
              ]}
            >
              <Select placeholder="select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Captcha"
              extra="We must make sure that your are a human."
            >
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Please input the captcha you got!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button>Get captcha</Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Should accept agreement")),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              &emsp;&emsp;
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                size="large"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </Filedset>
        <Button type="primary" color="red" shape="round" size="large">
          Google sign up <GoogleOutlined />
          <SendOutlined />
        </Button>
        <Button type="primary" color="red" shape="round" size="large">
          GitHub sign up <GithubFilled />
          <SendOutlined />
        </Button>
        <CenterLink>
          <p>
            <a href="/">Already have an account?</a>
          </p>
        </CenterLink>
      </SmallBox>
    </Container>
  );
}
export default Signup;
