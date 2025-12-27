from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db import Base


class Groups_Member(Base):
    __tablename__ = "groups_members"
    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.group_id"), index=True)
    group_name = Column(String, ForeignKey("groups.group_name"), index=True)
    member_name = Column(String, ForeignKey("users.account"), index=True)
    member_id = Column(Integer, ForeignKey("users.id"), index=True)
