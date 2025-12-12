import { useState } from "react";
import { Layout, Menu, Avatar, Input, Badge } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { useLoginStatus } from "../../store/loginStatus";
import { useChatSelect } from "../../store/chatSelect";
import { useChatInput, ChatRespond } from "../../store/chatInput";
import "./Chat.css";
import { ChatInfo, useChatContent } from "../../store/chatContent";

export default function Chat() {
  const MenuItem = Menu.Item;
  const SubMenu = Menu.SubMenu;
  const Sider = Layout.Sider;
  const Content = Layout.Content;
  const collapsedWidth = 60;
  const normalWidth = 220;
  const onlineUsers = ["admin", "ZZZ", "114514", "1918", "Senbai"]; //list for online users

  //who has login
  const isLogin = useLoginStatus((State) => State.loginInfo.isLogin);
  const name = useLoginStatus((State) => State.loginInfo.name);
  let onlineFriends: string[] = [];
  for (const user of onlineUsers) {
    if (user !== name) {
      onlineFriends.push(user);
    }
  }

  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState(normalWidth);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
    setSiderWidth(collapsed ? collapsedWidth : normalWidth);
  };

  const handleMoving = (_: any, { width }: { width?: number }) => {
    if (typeof width !== "number") return;
    if (width > collapsedWidth) {
      setSiderWidth(width);
      setCollapsed(!(width > collapsedWidth + 20));
    } else {
      setSiderWidth(collapsedWidth);
      setCollapsed(true);
    }
  };

  //select who to have a chat, read the msg list from backend everytime click
  const selectedChat = useChatSelect((State) => State.selected);
  const setSelectedChat = useChatSelect((State) => State.setSelected);
  const onClickChat = async (user: string) => {
    setSelectedChat(user);
    if (name) {
      const url = new URL("http://127.0.0.1:8000/chat/history");
      url.searchParams.set("name", name);
      url.searchParams.set("selectedChat", user);
      const res = await fetch(url.toString(), {
        method: "get",
      });
      const resJson = await res.json();
      const data = resJson as ChatInfo[];
      setMsg(data);
    }
  };

  //input text
  const textInput = useChatInput((State) => State.inputValue);
  const textIsNull = textInput === null;
  const setTextInput = useChatInput((State) => State.setValue);
  const handleInput = (text: string) => {
    setTextInput(text);
  };

  //read Message list
  const msgList = useChatContent((state) => state.chatInfo);
  const setMsg = useChatContent((state) => state.setChatContent);
  const sendMsg = async () => {
    //需要一个全局的消息列表为State，每次从后端获取历史消息并且跟后端存消息
    const msg: ChatInfo = {
      sender: name,
      receiver: selectedChat,
      content: textInput,
    };

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    const resJson = await res.json();
    const data = resJson as ChatRespond;
    if (data.ok) {
      setMsg(data.msgList); //use the zustand state as a buffer,read the msg history and set it
      setTextInput("");
    }
  };

  return (
    <>
      <Avatar style={{ position: "fixed", top: 20, right: 20 }}>
        {!isLogin ? <IconUser></IconUser> : name}
      </Avatar>
      <Layout className="byte-layout-collapse-demo">
        <Sider
          collapsible
          theme="dark"
          onCollapse={onCollapse}
          collapsed={collapsed}
          width={siderWidth}
          resizeBoxProps={{
            directions: ["right"],
            onMoving: handleMoving,
          }}
        >
          <div className="logo" />
          <Menu theme="dark" autoOpen style={{ width: "100%" }}>
            <SubMenu
              key="layout"
              title={
                <span
                  style={{
                    background: "linear-gradient(45deg, #4caf50, #9cff9c)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontWeight: 500,
                  }}
                >
                  Online
                </span>
              }
            >
              {onlineFriends.map((user) => (
                <MenuItem onClick={() => onClickChat(user)} key={user}>
                  {user}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </Sider>
        <Content
          style={{
            // background: "rgb(240,255,255)",
            textAlign: "center",
            padding: "30px",
          }}
        >
          {selectedChat ? ( //only show when someone has been selected
            <div className="chat-window">
              {/* show the message list */}
              {msgList.map((msg, index) =>
                msg.sender === name && msg.receiver === selectedChat ? (
                  <div className="message right" key={index}>
                    <div className="bubble bubble-right">{msg.content}</div>
                    <Avatar size={32}>{name}</Avatar>
                  </div>
                ) : msg.sender === selectedChat && msg.receiver === name ? (
                  <div className="message left" key={index}>
                    <Avatar size={32}>{selectedChat}</Avatar>
                    <div className="bubble bubble-left">{msg.content}</div>
                  </div>
                ) : null
              )}
              <Input
                onChange={(text) => handleInput(text)}
                onPressEnter={() => sendMsg()}
                value={textInput ?? ""}
                placeholder="Press enter to send message"
              ></Input>
            </div>
          ) : null}
        </Content>
      </Layout>
    </>
  );
}
