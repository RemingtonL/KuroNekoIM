from fastapi import APIRouter
from app.schemas.login import LoginForm, LoginResponse

router = APIRouter(tags=["login"])

AccAndPwds = [
    {"account": "admin", "password": "admin"},
    {"account": "ZZZ", "password": "ZZZ"},
    {"account": "114514", "password": "114514"},
]


@router.post("/login")
async def login(user: LoginForm):

    for AccAndPwd in AccAndPwds:
        if (
            user.account == AccAndPwd["account"]
            and user.password == AccAndPwd["password"]
        ):
            return LoginResponse(ok=True, token="token", name="admin")
        else:
            return LoginResponse(ok=False)


#    if (user.account == "admin" and user.password=="admin"):
#     return LoginResponse(ok=True,token="token",name="admin")
#    else:
#        return LoginResponse(ok=False)
