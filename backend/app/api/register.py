from fastapi import APIRouter
from app.schemas.register import RegisterForm

router = APIRouter(tag=["register"])
AccAndPwds = [
    {"account": "admin", "password": "admin"},
    {"account": "ZZZ", "password": "ZZZ"},
    {"account": "114514", "password": "114514"},
    {}
]

@router.post("/register")
async def register(registerForm:RegisterForm):
    for AccAndPwd in AccAndPwds:
        if 