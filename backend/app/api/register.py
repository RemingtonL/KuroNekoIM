from fastapi import APIRouter, Depends
from app.schemas.register import RegisterForm, RegisterRespond
import os, smtplib
from email.message import EmailMessage
from sqlalchemy.orm import Session
from app.models.user import User
from app.db import get_db

router = APIRouter(tags=["register"])
# AccAndPwds = [
#     {
#         "account": "admin",
#         "password": "admin",
#         "email": "admin@gmail.com",
#         "isVerified": True,
#     },
#     {"account": "ZZZ", "password": "ZZZ", "email": "zzz@gmail.com", "isVerified": True},
#     {
#         "account": "114514",
#         "password": "114514",
#         "email": "114514@gmail.com",
#         "isVerified": True,
#     },
# ]
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "l1037092456@gmail.com"  # 你的邮箱
SMTP_PASS = "tedhqircjygusbvn"


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
    # isAccRepeated = False
    # isPwdRepeated = False
    # for AccAndPwd in AccAndPwds:
    #     if AccAndPwd["account"] == registerForm.account:
    #         isAccRepeated = True
    #     elif AccAndPwd["email"] == registerForm.email:
    #         isPwdRepeated = True
    isAccRepeated = (
        db.query(User).filter(User.account == registerForm.account).first() is not None
    )
    isEmlRepeated = (
        db.query(User).filter(User.email == registerForm.email).first() is not None
    )
    # send mail to verify
    token = "verified"
    if isAccRepeated == False and isEmlRepeated == False:
        send_verify_email(
            to_email="1037092456@qq.com",
            verify_url=f"http://127.0.0.1:8000/verify?token={token}",
        )
        user = User(
            email=registerForm.email,
            account=registerForm.account,
            password_hash=registerForm.password1,
            is_verified=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return RegisterRespond(
        ok=True, isAccRepeated=isAccRepeated, isEmlRepeated=isEmlRepeated
    )
