import "@arco-design/web-react/dist/css/arco.css";
import { Form, Input, Button, InputNumber } from "@arco-design/web-react";
import { accountAndPwd } from "../login/AccountAndPassword.js";
import { useInputValue } from "../../store/loginInput";

const FormItem = Form.Item;
export default function Register() {
  const [form] = Form.useForm();
  const setInput = useInputValue((State) => State.setValue);
  interface InputValue {
    account:string,
    pwd1:string
    pwd2:string
  }
  const handleChange = (inputValue: InputValue) => {
    // setValue(inputValue);
    for (const accPWD of accountAndPwd) {
      if (
        accPWD.account === inputValue.account
      ) {
        console.log("This email address have aleady been used");
        break
      }
    }
      if (inputValue.pwd1 === inputValue.pwd2){
        console.log("Newly add the account" + inputValue.account + " " + inputValue.pwd1)
      }
      else{
        console.log("password does not match")
      }
    // 往账号密码内写入
    
  };
  return (
    <Form
      form={form}
      style={{ width: 600 }}
      autoComplete="off"
      onSubmit={handleChange}
    >
      <FormItem label="E-mail address" field="account" rules={[{ required: true }]}>
        <Input type = "email" placeholder="please enter your E-mail address" />
      </FormItem>
      <FormItem label="password" field="pwd1" rules={[{ required: true }]}>
        <Input placeholder="please enter your password" type="password" />
      </FormItem>
      <FormItem label="password" field="pwd2" rules={[{ required: true }]}>
        <Input placeholder="please enter your password" type="password" />
      </FormItem>
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
          Register
        </Button>
      </FormItem>
    </Form>
  );
}
