import hashlib
import hmac
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.session import UserSession
from app.models.user import User


def authentication_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Your session is invalid or has expired. Please sign in again.",
    )


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_current_session(
    request: Request,
    db: Session = Depends(get_db),
) -> UserSession:
    token = request.cookies.get(settings.session_cookie_name)

    if not token:
        raise authentication_error()

    token_hash = hash_session_token(token)

    session_record = db.scalar(
        select(UserSession).where(
            UserSession.token_hash == token_hash,
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > datetime.now(timezone.utc),
        )
    )

    if session_record is None:
        raise authentication_error()

    return session_record


def get_current_user(
    session_record: UserSession = Depends(get_current_session),
    db: Session = Depends(get_db),
) -> User:
    user = db.get(User, session_record.user_id)

    if user is None:
        raise authentication_error()

    return user


def require_csrf(
    request: Request,
    db: Session = Depends(get_db),
) -> None:
    origin = request.headers.get("origin")
    expected_origin = settings.frontend_url.rstrip("/")

    if not origin or origin.rstrip("/") != expected_origin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Request origin is not allowed.",
        )

    cookie_token = request.cookies.get("arenatech_csrf")
    header_token = request.headers.get("X-CSRF-Token")

    if not cookie_token or not header_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF validation is required.",
        )

    if not hmac.compare_digest(cookie_token, header_token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF validation failed.",
        )

    session_cookie = request.cookies.get(settings.session_cookie_name)

    if session_cookie:
        session_record = db.scalar(
            select(UserSession).where(
                UserSession.token_hash
                == hash_session_token(session_cookie),
                UserSession.revoked_at.is_(None),
                UserSession.expires_at > datetime.now(timezone.utc),
            )
        )

        if session_record is None or not hmac.compare_digest(
            session_record.csrf_token,
            header_token,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="CSRF validation failed.",
            )