from pydantic import BaseModel


class RegisterForm:
    email: str
    password1: str
    password2: str
