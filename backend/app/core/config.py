from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Server
    SERVER_IP: str = "http://127.0.0.1"
    SERVER_PORT: str = "8000"

    # define the midware
    ALLOW_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # DB
    DATABASE_PORT: str = "5432"
    DATABASE_IP: str = "localhost"
    DATASE_USER_NAME: str = "postgres"
    DATASE_USER_PWD: str = "admin"
    DATABASE_NAME: str = "kuroneko_db"
    DATABASE_URL: str = (
        f"postgresql://{DATASE_USER_NAME}:{DATASE_USER_PWD}@{DATABASE_IP}:{DATABASE_PORT}/{DATABASE_NAME}"
    )

    # upload
    UPLOAD_DIR: str = "uploads"

    # Emai verify
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "l1037092456@gmail.com"
    SMTP_PASS: str = "tedhqircjygusbvn"

    class Config:
        env_file = ".env"


settings = Settings()
