import secrets
from datetime import datetime, timedelta, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import (
    get_current_session,
    get_current_user,
    hash_session_token,
    require_csrf,
)
from app.models.session import UserSession
from app.models.user import User
from app.utils.security import hash_password, verify_password


router = APIRouter(prefix="/api/auth", tags=["Authentication"])

CSRF_COOKIE_NAME = "arenatech_csrf"


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    
    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    user: UserResponse
    csrf_token: str


class CSRFResponse(BaseModel):
    csrf_token: str


def set_csrf_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=token,
        httponly=False,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
        max_age=settings.session_expire_hours * 60 * 60,
    )


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/api",
        max_age=settings.session_expire_hours * 60 * 60,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/api",
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.delete_cookie(
        key=CSRF_COOKIE_NAME,
        path="/",
        secure=settings.cookie_secure,
        httponly=False,
        samesite="lax",
    )


@router.get("/csrf", response_model=CSRFResponse)
def get_csrf_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    # Reuse the current session's CSRF token when the session is valid.
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

        if session_record:
            set_csrf_cookie(response, session_record.csrf_token)
            return {"csrf_token": session_record.csrf_token}

        # Expired or revoked cookie: clear it before issuing a pre-login token.
        response.delete_cookie(
            key=settings.session_cookie_name,
            path="/api",
            secure=settings.cookie_secure,
            httponly=True,
            samesite="lax",
        )

    csrf_token = secrets.token_urlsafe(32)
    set_csrf_cookie(response, csrf_token)

    return {"csrf_token": csrf_token}


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_csrf)],
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    full_name = data.full_name.strip()
    email = str(data.email).lower()

    if len(full_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Full name must contain at least 2 characters.",
        )

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        full_name=full_name,
        email=email,
        hashed_password=hash_password(data.password),
        role="normal_user",
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    return user


@router.post(
    "/login",
    response_model=LoginResponse,
    dependencies=[Depends(require_csrf)],
)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    email = str(data.email).lower()

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if user is None or not verify_password(
        data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    raw_session_token = secrets.token_urlsafe(48)
    csrf_token = secrets.token_urlsafe(32)

    expires_at = datetime.now(timezone.utc) + timedelta(
        hours=settings.session_expire_hours
    )

    session_record = UserSession(
        user_id=user.id,
        token_hash=hash_session_token(raw_session_token),
        csrf_token=csrf_token,
        expires_at=expires_at,
    )

    db.add(session_record)
    db.commit()

    set_session_cookie(response, raw_session_token)
    set_csrf_cookie(response, csrf_token)

    return {
        "user": user,
        "csrf_token": csrf_token,
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_csrf)],
)
def logout(
    response: Response,
    session_record: UserSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    session_record.revoked_at = datetime.now(timezone.utc)
    db.commit()

    clear_auth_cookies(response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response