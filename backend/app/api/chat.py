from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.db import get_db
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import ChatInfo, ChatRespond
from pathlib import Path
import uuid
import os

router = APIRouter(tags=["chat"])
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED = {"image/png", "image/jpeg", "image/webp", "image/gif"}


# process the chat input. Add the latest msg to the database and return the latest the msg list
@router.post("/chat")
async def chat(chatInfo: ChatInfo, db: Session = Depends(get_db)):
    # add a new record
    message = Message(
        sender=chatInfo.sender,
        receiver=chatInfo.receiver,
        sender_id=chatInfo.sender_id,
        receiver_id=chatInfo.receiver_id,
        content=chatInfo.content,
        isText=chatInfo.isText,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    # pull the history
    chats = (
        db.query(Message)
        .filter(
            (
                (Message.sender_id == chatInfo.sender_id)
                & (Message.receiver_id == chatInfo.receiver_id)
            )
            | (
                (Message.sender_id == chatInfo.receiver_id)
                & (Message.receiver_id == chatInfo.sender_id)
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
            }
        )
    return ChatRespond(ok=True, msgList=chatContents)


# everytime user select a chatm it pull the msg history from the db
@router.get("/chat/history")
async def history(name: str, selectedChat: str, db: Session = Depends(get_db)):
    sender_id = db.query(User).filter(User.account == name).first().id
    receiver_id = db.query(User).filter(User.account == selectedChat).first().id
    chats = (
        db.query(Message)
        .filter(
            ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id))
            | ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
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
            }
        )
    selectedChatid = (
        db.query(User).filter(User.account == selectedChat).first().id
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
