from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.core.config import settings

router = APIRouter(tags=["online"])


# receive the current time(senconds) and compare with the last_seen time of user
# to see who are online and return the list of online users
@router.get("/online-status")
async def online_status_check(time: int, name: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_verified == True).all()
    online_users = []
    for user in users:
        if (
            (((time) / 1000) - user.last_seen) < settings.INTERVAL_SECONDS
        ) and user.account != name:
            online_users.append(user.account)
    return online_users


# receive the real time from front and update the last seen time in the db
@router.get("/online-update")
async def online_update(time: int, name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.account == name).first()
    user.last_seen = int(time / 1000)
    db.commit()
    db.refresh(user)
    return {"ok": True}
