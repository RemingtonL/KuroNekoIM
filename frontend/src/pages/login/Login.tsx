import "@arco-design/web-react/dist/css/arco.css";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Avatar,
  Message,
  Modal
} from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { Navigate, useNavigate } from "react-router-dom";
import { useInputValue } from "../../store/loginInput";
import { useLoginStatus } from "../../store/loginStatus";
import { SERVER_IP, SERVER_PORT } from "../../config/index";
import { useState } from "react";
const FormItem = Form.Item;
export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setInput = useInputValue((State) => State.setValue);
  const setLoginStatus = useLoginStatus((State) => State.setLoginStatus);
  const isLogin = useLoginStatus((State) => State.loginInfo.isLogin);
  const name = useLoginStatus((State) => State.loginInfo.name);
  const [visible,setVisible] = useState(false)
  const [notVerified,setNotVerified] = useState<boolean>()
  interface InputValue {
    account: string;
    password: string;
  }

  //process the login
  const handleChange = async (inputValue: InputValue) => {
    setInput(inputValue);
    const res = await fetch("/api/login", {
      //await 会在这里“停下来”，等服务器回应。
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValue), //body这里是真正要发送的数据，这一步把数据转换成JSON
    });

    if (!res.ok) {
      //状态码在 200–299 时为 true，为false的时候就是出事了
      Message.error("Server error");
      return;
    }
    const data: {
      ok: boolean;
      is_verified?:boolean;
      name?: string;
      token?: string;
      name_id?: number;
    } = await res.json(); //这一步解析回复，从JSON转换成对象
    if (data.ok && data.name && data.name_id) {
      setLoginStatus({ name: data.name, isLogin: true, name_id: data.name_id });
      (true);
      navigate("/chat");
    } else if ((data.ok) && (!data.is_verified)){ // correct account and password but have not verify the email
      setVisible(true)
      setNotVerified(true)
    }
    else {
      setVisible(true)
      setNotVerified(false)
    }
  };
  return (
    <>
      <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        cancelText="cancel"
        okText="OK"
      >
        {notVerified?(
          <p>Please verified your email.</p>
        ) : (
          <p>
            Login failed. Incorrect account or password.
          </p>
        )}
      </Modal>
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
