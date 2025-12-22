import "@arco-design/web-react/dist/css/arco.css";
import { Form, Input, Button, Modal } from "@arco-design/web-react";
import { useInputValue } from "../../store/loginInput";
import { useState } from "react";

const FormItem = Form.Item;

export default function Register() {
  const [form] = Form.useForm();
  const setInput = useInputValue((State) => State.setValue);
  const [isAccRepeated, setAccRepeated] = useState(false);
  const [isEmlRepeated, setPwdRepeated] = useState(false);
  const [visible, setVisible] = useState(false);

  interface InputValue {
    email: string;
    password1: string;
    password2: string;
    account: string;
  }
  interface RegisterRespond {
    ok: boolean;
    isAccRepeated: boolean;
    isEmlRepeated: boolean;
  }
  const handleSubmit = async (inputValue: InputValue) => {
    setInput(inputValue);
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValue),
    });
    const data = (await res.json()) as RegisterRespond;
    if (data.ok) {
      setAccRepeated(data.isAccRepeated);
      setPwdRepeated(data.isEmlRepeated);
      if (data.isAccRepeated || data.isEmlRepeated) {
        setVisible(true);
      }
    }
  };

  return (
    <>
      <Modal
        title="Modal Title"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        cancelText="cancel"
        okText="OK"
      >
        {isAccRepeated && isEmlRepeated ? (
          <p>account name and e-mail address already exist</p>
        ) : isEmlRepeated ? (
          <p>e-mail address already exist</p>
        ) : isAccRepeated ? (
          <p>account name already exist</p>
        ) : null}
      </Modal>
      <Form
        form={form}
        style={{ width: 600 }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <FormItem
          label="E-mail address"
          field="email"
          rules={[{ required: true }]}
        >
          <Input type="email" placeholder="please enter your E-mail address" />
        </FormItem>
        <FormItem label="account" field="account" rules={[{ required: true }]}>
          <Input placeholder="please enter your account" />
        </FormItem>
        <FormItem
          label="password"
          field="password1"
          rules={[{ required: true }]}
        >
          <Input placeholder="please enter your password" type="password" />
        </FormItem>
        <FormItem
          label="password"
          field="password2"
          rules={[{ required: true }]}
        >
          <Input placeholder="please enter your password" type="password" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
            Register
          </Button>
        </FormItem>
      </Form>
    </>
  );
}
