from typing import Optional
from pydantic import BaseModel


class LoginForm(BaseModel):
    account: str
    password: str


class LoginResponse(BaseModel):
    ok: bool
    token: Optional[str] = None
    name: Optional[str] = None
    name_id: Optional[int] = None
