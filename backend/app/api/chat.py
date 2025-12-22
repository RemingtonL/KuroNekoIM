from fastapi import APIRouter, Depends
from app.db import get_db
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import ChatInfo, ChatRespond

router = APIRouter(tags=["chat"])


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
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    # pull the history
    chats = (
        db.query(Message)
        .filter(
            (
                Message.sender == chatInfo.sender
                and Message.receiver == chatInfo.receiver
            )
            or (
                Message.sender == chatInfo.receiver
                and Message.receiver == chatInfo.sender
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
            }
        )
    chatContents.append(
        {
            "sender": chatInfo.sender,
            "receiver": chatInfo.receiver,
            "content": chatInfo.content,
        }
    )
    return ChatRespond(ok=True, msgList=chatContents)


# everytime user select a chatm it pull the msg history from the db
@router.get("/chat/history")
async def history(name: str, selectedChat: str, db: Session = Depends(get_db)):
    chats = (
        db.query(Message)
        .filter(
            (Message.sender == name and Message.receiver == selectedChat)
            or (Message.sender == selectedChat and Message.receiver == name)
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
            }
        )
    selectedChatid = (
        db.query(User).filter(User.account == selectedChat).first().id
    )  # return the id
    return {"chats": chatContents, "selectedChatId": selectedChatid}


@router.get("chat/upload")
async def upload():
    pass
