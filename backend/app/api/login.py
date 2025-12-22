from fastapi import APIRouter, Depends
from app.schemas.login import LoginForm, LoginResponse
from sqlalchemy.orm import Session
from app.models.user import User
from app.db import get_db

router = APIRouter(tags=["login"])


@router.post("/login")
async def login(user: LoginForm, db: Session = Depends(get_db)):
    user_login = (
        db.query(User)
        .filter(
            User.account == user.account
            and User.password_hash == user.password
            and User.is_verified == True
        )
        .first()
    )
    if user_login is not None:
        return LoginResponse(
            ok=True, token="token", name=user_login.account, name_id=user_login.id
        )
    else:
        return LoginResponse(ok=False)
