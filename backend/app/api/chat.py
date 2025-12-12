from fastapi import APIRouter
from app.schemas.chat import ChatInfo, ChatRespond

router = APIRouter(tags=["chat"])

chatContents = [
    {"sender": "admin", "receiver": "ZZZ", "content": "Hello this is admin"},
    {"sender": "ZZZ", "receiver": "admin", "content": "Hello this is ZZZ"},
]


# process the chat input. Add the latest msg to the database and return the latest the msg list
@router.post("/chat")
async def chat(chatInfo: ChatInfo):
    chatContents.append(
        {
            "sender": chatInfo.sender,
            "receiver": chatInfo.receiver,
            "content": chatInfo.content,
        }
    )
    return ChatRespond(ok=True, msgList=chatContents)


@router.get("/chat/history")
async def history(name: str, selectedChat: str):
    chats = []
    for chat in chatContents:
        if (chat["sender"] == name and chat["receiver"] == selectedChat) or (
            chat["sender"] == selectedChat and chat["receiver"] == name
        ):
            chats.append(chat)
    return chats
