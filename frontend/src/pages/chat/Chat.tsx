import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Input,
  Badge,
  Button,
  Upload,
} from "@arco-design/web-react";
import { IconUser, IconPlus } from "@arco-design/web-react/icon";
import { useLoginStatus } from "../../store/loginStatus";
import { useChatSelect } from "../../store/chatSelect";
import { useChatInput, ChatRespond } from "../../store/chatInput";
import "./Chat.css";
import { ChatInfo, useChatContent } from "../../store/chatContent";
import { SERVER_IP, SERVER_PORT } from "../../config/index";

export default function Chat() {
  const MenuItem = Menu.Item;
  const SubMenu = Menu.SubMenu;
  const Sider = Layout.Sider;
  const Content = Layout.Content;
  const groups = ["avemujica", "mygo"];

  //who has login
  const isLogin = useLoginStatus((State) => State.loginInfo.isLogin);
  const name = useLoginStatus((State) => State.loginInfo.name);
  const name_id = useLoginStatus((State) => State.loginInfo.name_id);
  //who is online

  // check all the online user
  const [onlineUsers, setOnlineUsers] = useState<string[]>();
  const onlineStatus = async () => {
    const seconds = new Date().getTime();
    const url = new URL(`http://${SERVER_IP}:${SERVER_PORT}/online-status`);
    url.searchParams.set("time", String(seconds));
    if (name) {
      url.searchParams.set("name",name)
    }
    const res = await fetch(url, {
      method: "get",
      headers: { "Content-type": "application/json" },
    });
    const online_users: string[] = await res.json();
    setOnlineUsers(online_users);
    console.log(name);
  };
  const onlineStatusUpdate = async () => {
    const seconds = new Date().getTime();
    const url = new URL(`http://${SERVER_IP}:${SERVER_PORT}/online-update`);
    if (name) {
      url.searchParams.set("name", name);
      url.searchParams.set("time", String(seconds));
    }
    const res = await fetch(url, {
      method: "get",
      headers: { "Content-type": "application/json" },
    });
    const data: { ok: boolean } = await res.json();
  };
  useEffect(() => {
  onlineStatusUpdate();
  onlineStatus();

  const id = setInterval(() => {
    onlineStatusUpdate();
    onlineStatus();
  }, 5000);

  return () => clearInterval(id);
}, [name]);
  // control the sidebar
  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState(220);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
    setSiderWidth(collapsed ? 60 : 220);
  };
  const handleMoving = (_: any, { width }: { width?: number }) => {
    if (typeof width !== "number") return;
    if (width > 60) {
      setSiderWidth(width);
      setCollapsed(!(width > 60 + 20));
    } else {
      setSiderWidth(60);
      setCollapsed(true);
    }
  };
  // ping to get the online friends and the group

  //select who to have a chat, read the msg list from backend everytime click
  const selectedChat = useChatSelect((State) => State.selected);
  const setSelectedChat = useChatSelect((State) => State.setSelected);
  const [isGroupChat, setIsGroupChat] = useState(false); //to indicate if the selected chat is a group chat
  const onClickChat = async (user: string, isGroupChat: boolean) => {
    if (name) {
      const url = new URL(`http://${SERVER_IP}:${SERVER_PORT}/chat/history`);
      url.searchParams.set("name", name);
      url.searchParams.set("selectedChat", user);
      if (isGroupChat) {
        url.searchParams.set("isGroupChat", "true");
      } else {
        url.searchParams.set("isGroupChat", "false");
      }
      const res = await fetch(url.toString(), {
        method: "get",
      });

      const data: {
        chats: ChatInfo[];
        selectedChatId: number;
      } = await res.json();
      setSelectedChat({ selectedName: user, selectedId: data.selectedChatId });
      setMsg(data.chats);
    }
  };

  //input text
  const textInput = useChatInput((State) => State.inputValue);
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
      sender_id: name_id,
      receiver: selectedChat!.selectedName,
      content: textInput,
      receiver_id: selectedChat!.selectedId,
      msg_type: "text",
      content_type: null,
      file_name: null,
    };
    const res = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, isGroupChat: isGroupChat }),
    });
    const resJson = await res.json();
    const data = resJson as ChatRespond;
    if (data.ok) {
      setMsg(data.msgList); //use the zustand state as a buffer,read the msg history and set it
      setTextInput("");
    }
  };

  // console.log(onlineUsers)
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
            <MenuItem key="main">
              <span className="online-gradient">Online</span>
            </MenuItem>
            <SubMenu key="Friends" title={<span>Friends</span>}>
            {onlineUsers?onlineUsers.map((user) => (
                <MenuItem
                  onClick={() => {
                    setIsGroupChat(false);
                    onClickChat(user, false);
                  }}
                  key={user}
                >
                  {user}
                </MenuItem>
              )):null}
            </SubMenu>
            <SubMenu key="Groups" title={<span>Groups</span>}>
              {groups.map((group) => (
                <MenuItem
                  onClick={() => {
                    onClickChat(group, true);
                    setIsGroupChat(true);
                  }}
                  key={group}
                >
                  {group}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </Sider>
        <Content
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          {selectedChat ? ( //only show when someone or a group chat has been selected
            <div className="chat-window">
              {msgList.map((msg, index) =>
                msg.sender === name && //message sent by "myself"
                msg.receiver === selectedChat.selectedName &&
                msg.msg_type === "text" ? ( // a text
                  <div className="message right" key={index}>
                    <div className="bubble bubble-right">{msg.content}</div>
                    <Avatar size={32}>{name}</Avatar>
                  </div>
                ) : msg.sender === name &&
                  msg.receiver === selectedChat.selectedName &&
                  msg.msg_type === "image" && // a image
                  msg.content ? (
                  <div className="message right" key={index}>
                    <div className="bubble bubble-right">
                      <img className="chat-img" src={msg.content} />
                    </div>
                    <Avatar size={32}>{name}</Avatar>
                  </div>
                ) : msg.sender === name &&
                  msg.receiver === selectedChat.selectedName &&
                  msg.msg_type === "file" && // a file,pdf,zip...
                  msg.content ? (
                  <div className="message right" key={index}>
                    <div className="bubble bubble-right">
                      <a
                        className="file-card"
                        href={msg.content}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="file-icon">📎</span>
                        <span className="file-name">
                          {msg.file_name ?? "download file"}
                        </span>
                      </a>
                    </div>
                    <Avatar size={32}>{name}</Avatar>
                  </div>
                ) : msg.sender === selectedChat.selectedName &&
                  msg.receiver === name && // message sent by other people, or a group message
                  msg.msg_type === "text" ? (
                  <div className="message left" key={index}>
                    <Avatar size={32}>{selectedChat.selectedName}</Avatar>
                    <div className="bubble bubble-left">{msg.content}</div>
                  </div>
                ) : msg.sender === selectedChat.selectedName &&
                  msg.receiver === name &&
                  msg.msg_type === "image" &&
                  msg.content ? (
                  <div className="message left" key={index}>
                    <Avatar size={32}>{selectedChat.selectedName}</Avatar>
                    <div className="bubble bubble-left">
                      <img className="chat-img" src={msg.content} />
                    </div>
                  </div>
                ) : msg.sender === selectedChat.selectedName &&
                  msg.receiver === name &&
                  msg.msg_type === "file" &&
                  msg.content ? (
                  <div className="message left" key={index}>
                    <div className="bubble bubble-left">
                      <a
                        className="file-card"
                        href={msg.content}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="file-icon">📎</span>
                        <span className="file-name">
                          {msg.file_name ?? "download file"}
                        </span>
                      </a>
                    </div>
                    <Avatar size={32}>{name}</Avatar>
                  </div>
                ) : null
              )}

              <div className="chat-input-row">
                <Upload
                  listType="picture-list"
                  action={`http://${SERVER_IP}:${SERVER_PORT}/chat/upload`}
                  multiple
                  showUploadList={false}
                  onChange={() => {
                    if (selectedChat.selectedName) {
                      onClickChat(selectedChat.selectedName, isGroupChat);
                    }
                  }} //update the history when the upload is done
                  data={{
                    sender: name,
                    sender_id: name_id,
                    receiver: selectedChat!.selectedName,
                    receiver_id: selectedChat!.selectedId,
                    isGroupChat: isGroupChat,
                  }}
                >
                  <Button
                    shape="circle"
                    type="primary"
                    icon={<IconPlus />}
                    className="add-btn"
                  />
                </Upload>
                <Input
                  onChange={(text) => handleInput(text)}
                  onPressEnter={() => {
                    sendMsg();
                  }}
                  value={textInput ?? ""}
                  placeholder="Press enter to send message"
                ></Input>
              </div>
            </div>
          ) : null}
        </Content>
      </Layout>
    </>
  );
}
