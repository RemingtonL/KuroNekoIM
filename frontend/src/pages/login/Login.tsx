import "@arco-design/web-react/dist/css/arco.css";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Avatar,
} from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { accountAndPwd } from "./AccountAndPassword";
import { Navigate, useNavigate } from "react-router-dom";
import { useInputValue } from "../../store/loginInput";
import { useLoginStatus } from "../../store/loginStatus";

const FormItem = Form.Item;
export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setInput = useInputValue((State) => State.setValue);
  const setLoginStatus = useLoginStatus((State) => State.setLoginStatus);
  const isLogin = useLoginStatus((State) => State.loginInfo.isLogin);
  const name = useLoginStatus((State) => State.loginInfo.name);
  interface InputValue {
    account: string;
    password: string;
  }

  //process the login
  const handleChange = (inputValue: InputValue) => {
    let isCorrect = false;
    for (const accPWD of accountAndPwd) {
      //login succeed
      if (
        accPWD.account === inputValue.account &&
        accPWD.password === inputValue.password
      ) {
        console.log("Login successfully");
        isCorrect = true;
        setLoginStatus({ name: accPWD.account, isLogin: true });
      }
    }
    //login failed
    if (!isCorrect) {
      console.log("Wrong Password or Account");
    }
    setInput(inputValue);
  };
  return (
    <>
      <Form
        form={form}
        style={{ width: 600 }}
        initialValues={{ account: "admin" }}
        autoComplete="off"
        onSubmit={handleChange}
      >
        <FormItem label="account" field="account" rules={[{ required: true }]}>
          <Input placeholder="please enter your account" />
        </FormItem>
        <FormItem
          label="password"
          field="password"
          rules={[{ required: true }]}
        >
          <Input placeholder="please enter your password" type="password" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
            Login
          </Button>
          <Button
            style={{ marginRight: 24 }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </FormItem>
      </Form>
      <Avatar style={{ position: "fixed", top: 20, right: 20 }}>
        {!isLogin ? <IconUser></IconUser> : name}
      </Avatar>
    </>
  );
}
