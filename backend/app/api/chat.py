from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from app.db import get_db
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.user import User
from app.models.group_messages import Group_Message
from app.models.group_members import Groups_Member
from app.models.groups import Group
from app.schemas.chat import ChatReq, ChatRespond
from pathlib import Path
from app.core.config import settings
import os, uuid

router = APIRouter(tags=["chat"])
UPLOAD_DIR = Path(__file__).resolve().parents[1] / settings.UPLOAD_DIR
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# process the chat input. Add the latest msg to the database and return the latest the msg list
# isGroupChat determine if it is sent to a group chat
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
            msg_type="text",
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
        chatContents = []
        for chat in chats:
            chatContents.append(
                {
                    "sender": chat.sender,
                    "sender_id": chat.sender_id,
                    "receiver": chat.receiver,
                    "receiver_id": chat.receiver_id,
                    "content": chat.content,
                    "msg_type": chat.msg_type,
                    "content_type": chat.content_type,
                    "file_name": chat.file_name,
                }
            )
    else:  # for group chat
        message = Group_Message(
            sender=chatReq.message.sender,
            group_name=chatReq.message.receiver,
            sender_id=chatReq.message.sender_id,
            group_id=chatReq.message.receiver_id,
            content=chatReq.message.content,
            msg_type="text",
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
                    "msg_type": chat.msg_type,
                    "content_type": chat.content_type,
                    "file_name": chat.file_name,
                }
            )
    return ChatRespond(ok=True, msgList=chatContents)


# everytime user select a chatm it pull the msg history from the db
@router.get("/chat/history")
async def history(
    name: str, selectedChat: str, isGroupChat: str, db: Session = Depends(get_db)
):
    # for individual chat
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
                    "sender_id": chat.sender_id,
                    "receiver": chat.receiver,
                    "receiver_id": chat.receiver_id,
                    "content": chat.content,
                    "msg_type": chat.msg_type,
                    "content_type": chat.content_type,
                    "file_name": chat.file_name,
                }
            )
        selectedChatid = (
            db.query(User).filter(User.account == selectedChat).first().id
        )  # return the id
    else:
        sender_id = db.query(User).filter(User.account == name).first().id
        group_id = (
            db.query(Groups_Member)
            .filter(Groups_Member.group_name == selectedChat)
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
                    "sender_id": chat.sender_id,
                    "receiver": chat.group_name,
                    "receiver_id": chat.group_id,
                    "content": chat.content,
                    "msg_type": chat.msg_type,
                    "content_type": chat.content_type,
                    "file_name": chat.file_name,
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
    isGroupChat: bool = Form(...),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    stored = f"{uuid.uuid4().hex}{ext}"
    save_path = UPLOAD_DIR / stored
    with open(save_path, "wb") as f:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)

    url = f"{settings.SERVER_IP}:{settings.SERVER_PORT}/uploads/{stored}"
    msg_type = "image" if file.content_type.startswith("image/") else "file"
    if not isGroupChat:
        message = Message(
            sender=sender,
            receiver=receiver,
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=url,
            msg_type=msg_type,
            content_type=file.content_type,
            file_name=file.filename,
        )
    else:
        message = Group_Message(
            sender=sender,
            group_name=receiver,
            sender_id=sender_id,
            group_id=receiver_id,
            content=url,
            msg_type=msg_type,
            content_type=file.content_type,
            file_name=file.filename,
        )
    db.add(message)
    db.commit()
    db.refresh(message)
    return None
