from app.db import engine, Base
from app.models.user import User
from app.models.message import Message
from app.models.groups import Group
from app.models.group_members import Groups_Member
from app.models.group_messages import Group_Message


Base.metadata.create_all(bind=engine)
