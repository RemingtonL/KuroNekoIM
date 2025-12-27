from typing import List
from pydantic import BaseModel


# this one would be add to the db
class ChatInfo(BaseModel):
    sender: str
    sender_id: int
    receiver: str
    receiver_id: int
    content: str
    isText: bool


class ChatReq(BaseModel):
    message: ChatInfo
    isGroupChat: bool


# this one is used as message to be display on front end


class ChatRespond(BaseModel):
    msgList: List[ChatInfo]
    ok: bool
