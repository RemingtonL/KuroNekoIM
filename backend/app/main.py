from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import login, chat, register, verify, online
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI()
UPLOAD_DIR = Path(__file__).resolve().parent / settings.UPLOAD_DIR
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
origins = settings.ALLOW_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许的前端源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法：GET/POST/PUT/DELETE...
    allow_headers=["*"],  # 允许所有请求头
)


# process the login
app.include_router(login.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(register.router, prefix="/api")
app.include_router(verify.router, prefix="/api")
app.include_router(online.router, prefix="/api")
