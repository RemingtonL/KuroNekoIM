from sqlalchemy import Column, Integer, String, Boolean
from app.db import Base


class Group(Base):
    __tablename__ = "groups"
    group_id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, unique=True, nullable=False, index=True)
