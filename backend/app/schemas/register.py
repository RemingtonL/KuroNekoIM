from pydantic import BaseModel


class RegisterForm(BaseModel):
    email: str
    password1: str
    password2: str
    account: str


class RegisterRespond(BaseModel):
    isAccRepeated: bool
    isEmlRepeated: bool
    ok: bool
