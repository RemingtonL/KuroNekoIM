from fastapi import FastAPI
from app.api import login, chat, register

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许的前端源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法：GET/POST/PUT/DELETE...
    allow_headers=["*"],  # 允许所有请求头
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


# process the login
app.include_router(login.router)
app.include_router(chat.router)
app.include_router(register.router)
