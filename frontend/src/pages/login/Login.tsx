import "@arco-design/web-react/dist/css/arco.css";
import { Form, Input, Button, InputNumber } from "@arco-design/web-react";
import {accountAndPwd} from "./AccountAndPassword"
import { Navigate, useNavigate } from "react-router-dom";
import {useInputValue} from "../../store/loginInput"


const FormItem = Form.Item;
export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setInput = useInputValue(State=>State.setValue)
  interface InputValue {
    account:string,
    password:string
  }
  const handleChange = (inputValue: InputValue) => {
    // setValue(inputValue);
    let isCorrect = false
    for ( const accPWD of accountAndPwd){
      if (accPWD.account === inputValue.account  && accPWD.password === inputValue.password){
        console.log('Login successfully')
      }
    }
    if (!isCorrect){
      console.log('Wrong Password or Account')
    }
    setInput(inputValue)
  };
  return (
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
        <Input placeholder="please enter your password" type="password"/>
      </FormItem>
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
          Login
        </Button>
        <Button
          style={{ marginRight: 24 }}
          onClick={()=>navigate("/register")}
        >
          Register
        </Button>
        
      </FormItem>
    </Form>
  );
}
