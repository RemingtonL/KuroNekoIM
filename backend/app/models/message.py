from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.db import Base


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String, nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"))
    receiver = Column(String, nullable=False)
    content = Column(String, nullable=False)
    isText = Column(Boolean, nullable=False)
