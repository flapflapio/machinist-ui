import { Button, Form, Input } from "antd";
import styled, { keyframes } from "styled-components";
import logo from "../../../public/images/flapflap1.png";
// import background from '../../../public/images/flapflap.svg';
import { GoogleOutlined, GithubFilled } from "@ant-design/icons";
import "animate.css";

const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%;}
  `;

// #1cabdf
// #ccd81d
const Container = styled.div`
  /* background setup */
  background: linear-gradient(-45deg, #1cabdf, #f14a8a, #ffff00);
  background-size: 400% 400%;
  animation: ${gradient};
  animation-duration: 40s;
  animation-iteration-count: infinite;
  border: 5px solid black;
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

// container for signup page trial
// const Container = styled.div`
//   /* background setup */
//   background-image: url(${background.src});
//   background-size: cover;
//   background-position: center;
//   background-attachment: fixed;
//   /* border:  5px solid black; */
//   flex-direction: column;
//   position: fixed;
//   display: flex;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   place-items: center;
//   place-content: center;
//   box-sizing: border-box;
//   `;

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
    box-shadow: 0 32px 64px rgba(0,0,0,0.2);
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

const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Login() {
  return (
    <Container>
      <SmallBox>
        <Logo> </Logo>
        <Filedset>
          <legend>Log In</legend>
          <br />
          <Form
            name="basic"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 17,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "👤 Please enter your username",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "🔐 Please enter your password",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 5,
                span: 16,
              }}
            >
              <a href="/">Forgot password?</a>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 1,
                span: 80,
              }}
            >
              <Button type="primary" shape="round" size="large">
                Create an acccount
              </Button>
            </Form.Item>
          </Form>
        </Filedset>

        <Button type="primary" color="red" shape="round" size="large">
          <GoogleOutlined />
        </Button>
        <Button type="primary" color="red" shape="round" size="large">
          <GithubFilled />
        </Button>
      </SmallBox>
    </Container>
  );
}

export default Login;
