from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt

ALGORITHM = "HS256"


def create_email_verify_token(
    *,
    user_id: int,
    email: str,
    secret_key: str,
    ttl_seconds: int = 3600,
) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(seconds=ttl_seconds)

    payload: Dict[str, Any] = {
        "sub": str(user_id),  # JWT 里 sub 通常是 string
        "email": email,
        "purpose": "verify_email",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, secret_key, algorithm=ALGORITHM)


def verify_email_verify_token(
    token: str,
    secret_key: str,
) -> Dict[str, Any]:
    """
    验签 + 验 exp（python-jose 会自动校验 exp）
    返回 payload dict；失败抛异常
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    except JWTError:
        raise ValueError("invalid_token")

    if payload.get("purpose") != "verify_email":
        raise ValueError("wrong_purpose")

    # sub 还原成 int
    sub = payload.get("sub")
    if sub is None:
        raise ValueError("missing_sub")
    try:
        payload["sub"] = int(sub)
    except Exception:
        raise ValueError("bad_sub")

    return payload
