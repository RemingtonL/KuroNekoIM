from pydantic import BaseModel


class RegisterForm(BaseModel):
    email: str
    password1: str
    password2: str
    account: str
    last_seen: int


class RegisterRespond(BaseModel):
    isAccRepeated: bool
    isEmlRepeated: bool
    ok: bool
