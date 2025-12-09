import { useState } from "react";
import { Layout, Menu, Avatar, Input, Badge } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { useLoginStatus } from "../../store/loginStatus";
import { useChatSelect } from "../../store/chatSelect";
import { useChatInput } from "../../store/chatInput";
import "./Chat.css";
import { useChatContent, ChatInfo } from "../../store/chatContent";
export default function Chat() {
  const MenuItem = Menu.Item;
  const SubMenu = Menu.SubMenu;
  const Sider = Layout.Sider;
  const Content = Layout.Content;
  const collapsedWidth = 60;
  const normalWidth = 220;
  const onlineUsers = ["admin", "ZZZ", "114514","1918","Senbai"]; //list for online users


  //who has login
  const isLogin = useLoginStatus((State) => State.loginInfo.isLogin);
  const name = useLoginStatus((State) => State.loginInfo.name);
  let onlineFriends :string[] = []
  for (const user of onlineUsers){
    if (user !== name){
      onlineFriends.push(user)
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

  //select who to have a chat
  const selectedChat = useChatSelect((State) => State.selected);
  const setSelectedChat = useChatSelect((State) => State.setSelected);
  const onClickChat = (user: string) => {
    setSelectedChat(user);
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
  const addMsg = useChatContent((state) => state.addChatContent);
  const sendMsg = () => {
    //需要一个全局的消息列表为State，每次更新往里面加消息然后重新渲染
    const msg: ChatInfo = {
      sender: name,
      receiver: selectedChat,
      content: textInput,
    };
    addMsg(msg);
    setTextInput("");
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
              <div className="message left">
                <Avatar size={32}>{selectedChat}</Avatar>
                <div className="bubble bubble-left">
                  你好，我是 {selectedChat}
                </div>
              </div>

              <div className="message right">
                <div className="bubble bubble-right">你好，我是 {name}</div>
                <Avatar size={32}>{name}</Avatar>
              </div>
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
