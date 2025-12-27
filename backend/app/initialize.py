from app.db import engine, Base
from app.models.user import User
from app.models.message import Message
from app.models.groups import Groups
from app.models.group_members import Groups_Members
from app.models.group_messages import Group_Messages


Base.metadata.create_all(bind=engine)
