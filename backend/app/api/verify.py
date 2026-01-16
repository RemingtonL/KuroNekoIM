from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
from sqlalchemy.orm import Session
from app.core.jwt_token import verify_email_verify_token
from app.models.user import User
from app.core.config import settings

router = APIRouter(tags=["verify"])


@router.get("/verify")
async def verify(token: str, db: Session = Depends(get_db)):
    try:
        payload = verify_email_verify_token(token, settings.SECRET_KEY)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = payload["sub"]
    email = payload.get("email")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="user_not_found")

    # 可选：二次校验 email（防止 id 被撞库/错发）
    if email and user.email != email:
        raise HTTPException(status_code=400, detail="email_mismatch")

    user.is_verified = True
    db.commit()

    return {"ok": True}
