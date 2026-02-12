import "@arco-design/web-react/dist/css/arco.css";
import { Form, Input, Button, Modal } from "@arco-design/web-react";
import { useInputValue } from "../../store/loginInput";
import { useState } from "react";
import { SERVER_IP, SERVER_PORT } from "../../config/index";

const FormItem = Form.Item;

export default function Register() {
  const [form] = Form.useForm();
  const setInput = useInputValue((State) => State.setValue);
  const [isAccRepeated, setAccRepeated] = useState(false);
  const [isEmlRepeated, setPwdRepeated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleButton, setVisibleButton] = useState(true);

  interface InputValue {
    email: string;
    password1: string;
    password2: string;
    account: string;
    last_seen:number;
  }
  interface RegisterRespond {
    ok: boolean;
    isAccRepeated: boolean;
    isEmlRepeated: boolean;
  }
  const handleSubmit = async (inputValue: InputValue) => {
    const seconds = new Date().getTime();
    inputValue.last_seen = seconds
    setInput(inputValue);
    const res = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValue),
    });
    const data = (await res.json()) as RegisterRespond;
    if (data.ok) {
      setAccRepeated(data.isAccRepeated);
      setPwdRepeated(data.isEmlRepeated);
      setVisible(true);
    }
  };
  const handleValueChange = () => {
    const { email, account, password1, password2 } = form.getFieldsValue();
    const ok =
      !!email &&
      !!account &&
      !!password1 &&
      !!password2 &&
      password1 === password2;

    setVisibleButton(!ok);
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
        {isAccRepeated && isEmlRepeated ? (
          <p>account name and e-mail address already exist</p>
        ) : isEmlRepeated ? (
          <p>e-mail address already exist</p>
        ) : isAccRepeated ? (
          <p>account name already exist</p>
        ) : (
          <p>
            Verification email has been sent to your email address, please click
            the link in to verify your email
          </p>
        )}
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
          onChange={handleValueChange}
        >
          <Input type="email" placeholder="please enter your E-mail address" />
        </FormItem>
        <FormItem
          label="account"
          field="account"
          onChange={handleValueChange}
          rules={[
            { required: true },
            {
              validator: (value, callback) => {
                if (!value) {
                  return callback("please enter the account");
                }
              },
            },
          ]}
        >
          <Input placeholder="please enter your account" />
        </FormItem>
        <FormItem
          label="password"
          field="password1"
          onChange={handleValueChange}
          rules={[
            { required: true },
            {
              validator: (value, callback) => {
                if (!value) {
                  return callback("please enter the password");
                }
              },
            },
          ]}
        >
          <Input placeholder="please enter your password" type="password" />
        </FormItem>
        <FormItem
          label="password"
          field="password2"
          onChange={handleValueChange}
          rules={[
            { required: true, message: "Please enter your password again" },
            {
              validator: (value, callback) => {
                const pw1 = form.getFieldValue("password1");
                if (!value) {
                  return callback();
                }
                if (value !== pw1) {
                  return callback("Passwords do not match");
                }
                callback();
              },
            },
          ]}
        >
          <Input placeholder="please enter your password" type="password" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit" disabled={visibleButton}>
            Register
          </Button>
        </FormItem>
      </Form>
    </>
  );
}
