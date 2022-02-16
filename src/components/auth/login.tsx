import { Button, Input, Space, Form, Checkbox } from "antd";
import { keyframes } from "styled-components";
import logo from '/Users/instamine/Projects/machinist-ui/src/images/flapflap1.png';
import styled from "styled-components";

const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%;}
  `;

const Container = styled.div`
  /* background setup */
  background: linear-gradient(-45deg, #eb704b, #f14a8a, #1cabdf, #1dd8ac);
  background-size: 400% 400%;
  animation: ${gradient};
  animation-duration: 40s;
  animation-iteration-count: infinite;
  border:  5px solid black;
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
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-gap: 10px;
    margin: auto 0;
    padding: 20px;
    background-color: rgba(255,255,255,1);
    border-radius: 50px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.2);
  }
`;
const Logo = styled.div`
  background-image: url(${logo});
  borderradius: 50%;
  position: center;
  border: solid yellow;
  backgroundcolor: purple;
  padding: 0.5em;
  margin: 0px;
  width: 50%;
  height: 0%;
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
          <Form
            name="basic"
            labelCol={{
              span: 25,
            }}
            wrapperCol={{
              span: 25,
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
                  message: "Please enter your username!",
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
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 2,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
              <a>Forgot password?</a>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            >
          <Button type="primary" color="red" shape="round" size="large">
            Login
          </Button>

            </Form.Item>
          </Form>
        </Filedset>
        
        <Button type="primary" color="red" shape="round" size="large">
          Google Signin
        </Button>
        <Button type="primary" color="red" shape="round" size="large">
          Github Signin
        </Button>
      </SmallBox>
    </Container>
  );
}

export default Login;
