from app.db import engine, Base
from app.models.user import User
from app.models.message import Message

Base.metadata.create_all(bind=engine)
