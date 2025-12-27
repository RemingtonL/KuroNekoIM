from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.db import get_db
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.user import User
from app.models.group_messages import Group_Message
from app.models.groups import Group
from app.schemas.chat import ChatReq, ChatRespond
from pathlib import Path
from app.core.config import settings

router = APIRouter(tags=["chat"])
UPLOAD_DIR = Path(__file__).resolve().parents[1] / settings.UPLOAD_DIR
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# process the chat input. Add the latest msg to the database and return the latest the msg list
@router.post("/chat")
async def chat(chatReq: ChatReq, db: Session = Depends(get_db)):
    # add a new record
    if chatReq.isGroupChat == False:  # for individual chat
        message = Message(
            sender=chatReq.message.sender,
            receiver=chatReq.message.receiver,
            sender_id=chatReq.message.sender_id,
            receiver_id=chatReq.message.receiver_id,
            content=chatReq.message.content,
            isText=chatReq.message.isText,
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        # pull the history
        chats = (
            db.query(Message)
            .filter(
                (
                    (Message.sender_id == chatReq.message.sender_id)
                    & (Message.receiver_id == chatReq.message.receiver_id)
                )
                | (
                    (Message.sender_id == chatReq.message.receiver_id)
                    & (Message.receiver_id == chatReq.message.sender_id)
                )
            )
            .all()
        )
    else:
        message = Group_Message(
            sender=chatReq.message.sender,
            group_name=chatReq.message.receiver,
            sender_id=chatReq.message.sender_id,
            group_id=chatReq.message.receiver_id,
            content=chatReq.message.content,
            isText=chatReq.message.isText,
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        # pull the history
        chats = (
            db.query(Group_Message)
            .filter(
                (
                    (Group_Message.sender_id == chatReq.message.sender_id)
                    & (Group_Message.group_id == chatReq.message.receiver_id)
                )
                | (
                    (Group_Message.sender_id == chatReq.message.receiver_id)
                    & (Group_Message.group_id == chatReq.message.sender_id)
                )
            )
            .all()
        )

    chatContents = []
    for chat in chats:
        chatContents.append(
            {
                "sender": chat.sender,
                "sender_id": chat.sender_id,
                "receiver": chat.group_name,
                "receiver_id": chat.group_id,
                "content": chat.content,
                "isText": chat.isText,
            }
        )
    return ChatRespond(ok=True, msgList=chatContents)


# everytime user select a chatm it pull the msg history from the db
@router.get("/chat/history")
async def history(
    name: str, selectedChat: str, isGroupChat: str, db: Session = Depends(get_db)
):
    if isGroupChat == "false":
        sender_id = db.query(User).filter(User.account == name).first().id
        receiver_id = db.query(User).filter(User.account == selectedChat).first().id
        chats = (
            db.query(Message)
            .filter(
                (
                    (Message.sender_id == sender_id)
                    & (Message.receiver_id == receiver_id)
                )
                | (
                    (Message.sender_id == receiver_id)
                    & (Message.receiver_id == sender_id)
                )
            )
            .all()
        )
        chatContents = []
        for chat in chats:
            chatContents.append(
                {
                    "sender": chat.sender,
                    "receiver": chat.receiver,
                    "content": chat.content,
                    "isText": chat.isText,
                    "sender_id": chat.sender_id,
                    "receiver_id": chat.receiver_id,
                    "isText": chat.isText,
                }
            )
        selectedChatid = (
            db.query(User).filter(User.account == selectedChat).first().id
        )  # return the id
    else:
        sender_id = db.query(User).filter(User.account == name).first().id
        group_id = (
            db.query(Group_Message)
            .filter(Group_Message.group_name == selectedChat)
            .first()
            .group_id
        )
        chats = (
            db.query(Group_Message)
            .filter(
                (
                    (Group_Message.sender_id == sender_id)
                    & (Group_Message.group_id == group_id)
                )
                | (
                    (Group_Message.sender_id == group_id)
                    & (Group_Message.group_id == sender_id)
                )
            )
            .all()
        )
        chatContents = []
        for chat in chats:
            chatContents.append(
                {
                    "sender": chat.sender,
                    "receiver": chat.group_name,
                    "content": chat.content,
                    "isText": chat.isText,
                    "sender_id": chat.sender_id,
                    "receiver_id": chat.group_id,
                }
            )
        selectedChatid = (
            db.query(Group).filter(Group.group_name == selectedChat).first().group_id
        )  # return the id
    return {"chats": chatContents, "selectedChatId": selectedChatid}


@router.post("/chat/upload")
async def upload_file(
    file: UploadFile = File(...),
    sender: str = Form(...),
    sender_id: int = Form(...),
    receiver: str = Form(...),
    receiver_id: int = Form(...),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("image/png", "image/jpeg"):
        return {"error": "Invalid file type"}
    content = await file.read()
    with open(f"{UPLOAD_DIR}/{file.filename}", "wb") as f:
        f.write(content)
    message = Message(
        sender=sender,
        receiver=receiver,
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=f"http://127.0.0.1:8000/uploads/{file.filename}",
        isText=False,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return None
