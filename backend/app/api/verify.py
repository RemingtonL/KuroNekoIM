from fastapi import APIRouter

router = APIRouter(tags=["verify"])


@router.get("/verify")
async def verify(token: str):
    # 这里的token应该是存在账户信息里的一个值，创建账户的时候生成，加密之后放在验证链接里面
    if token == "verified":
        pass  # 这里应该是把后端的账户的信息的是否验证的字段给set成true
