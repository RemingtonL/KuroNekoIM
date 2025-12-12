from typing import List
from pydantic import BaseModel


class ChatInfo(BaseModel):
    sender: str
    receiver: str
    content: str


class ChatRespond(BaseModel):
    msgList: List[ChatInfo]
    ok: bool
