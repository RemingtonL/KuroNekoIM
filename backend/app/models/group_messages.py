from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.db import Base


class Group_Message(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.group_id"))
    group_name = Column(
        String,
        ForeignKey("groups.group_name"),
        nullable=False,
    )
    content = Column(String, nullable=False)
    msg_type = Column(String, nullable=False)  # text,img,file
    content_type = Column(String, nullable=True)  # the type of the content
    file_name = Column(String, nullable=True)
