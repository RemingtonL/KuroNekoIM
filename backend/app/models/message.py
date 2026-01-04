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
    msg_type = Column(String, nullable=False)  # text,img,file
    content_type = Column(String, nullable=True)  # the type of the content
    file_name = Column(String, nullable=True)
