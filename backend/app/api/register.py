from fastapi import APIRouter, Depends
from app.schemas.register import RegisterForm, RegisterRespond
import os, smtplib
from email.message import EmailMessage
from sqlalchemy.orm import Session
from app.models.user import User
from app.db import get_db
from app.core.config import settings
from app.core.jwt_token import create_email_verify_token

router = APIRouter(tags=["register"])
SMTP_HOST = settings.SMTP_HOST
SMTP_PORT = settings.SMTP_PORT
SMTP_USER = settings.SMTP_USER
SMTP_PASS = settings.SMTP_PASS


def send_verify_email(to_email: str, verify_url: str):
    msg = EmailMessage()
    msg["Subject"] = "Verify your account"
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.set_content(
        f"Click to verify your account:\n{verify_url}\nThis link expires in 1 hour."
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


@router.post("/register")
async def register(registerForm: RegisterForm, db: Session = Depends(get_db)):
    isAccRepeated = (
        db.query(User).filter(User.account == registerForm.account).first() is not None
    )
    isEmlRepeated = (
        db.query(User).filter(User.email == registerForm.email).first() is not None
    )
    # send mail to verify
    token = "verified"
    if isAccRepeated == False and isEmlRepeated == False:

        user = User(
            email=registerForm.email,
            account=registerForm.account,
            password_hash=registerForm.password1,
            is_verified=False,
            last_seen=registerForm.last_seen / 1000,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user_new = db.query(User).filter(registerForm.account == User.account).first()
        token = create_email_verify_token(
            user_id=user_new.id,
            email=user_new.email,
            secret_key=settings.SECRET_KEY,
            ttl_seconds=settings.EMAIL_VERIFY_TTL_SECONDS,
        )
        send_verify_email(
            to_email=registerForm.email,
            verify_url=f"http://{settings.SERVER_IP}/api/verify?token={token}",
            # verify_url=f"{settings.SERVER_IP}:{settings.SERVER_PORT}/api/verify?token={token}",
        )
    return RegisterRespond(
        ok=True, isAccRepeated=isAccRepeated, isEmlRepeated=isEmlRepeated
    )
