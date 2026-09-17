import re
import datetime
import bcrypt
import jwt
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from app.config import settings
from app.schemas import UserProfile
from app.crud import (
    get_user_raw_by_email,
    get_user_raw_by_id,
    set_user_password_hash,
    create_auth_user,
    get_user_profile,
    row_to_user_profile
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

EMAIL_REGEX = re.compile(r"^[\w\.\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$")

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    email: str = Field(..., min_length=5, max_length=128)
    password: str = Field(..., min_length=8)
    phone: Optional[str] = ""
    countryCode: Optional[str] = "+91"
    communityId: Optional[str] = ""

class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserProfile

def create_access_token(user_id: str, email: str) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + datetime.timedelta(days=settings.JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except Exception:
        return None

def validate_password_complexity(password: str) -> Optional[str]:
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not any(c.isupper() for c in password):
        return "Password must include at least one uppercase letter."
    if not any(c.islower() for c in password):
        return "Password must include at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return "Password must include at least one number."
    return None

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest):
    # 1. Clean input
    clean_email = payload.email.strip().lower()
    clean_name = payload.name.strip()
    
    if len(clean_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your full name."
        )

    if not EMAIL_REGEX.match(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid email address."
        )

    # 2. Password complexity validation
    pw_error = validate_password_complexity(payload.password)
    if pw_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pw_error
        )

    # 3. Check duplicate email in MySQL
    existing = get_user_raw_by_email(clean_email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in instead."
        )

    # 4. Hash password with bcrypt
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(payload.password.encode("utf-8"), salt).decode("utf-8")

    # 5. Insert user record into MySQL
    try:
        user_profile = create_auth_user(
            name=clean_name,
            email=clean_email,
            password_hash=hashed,
            phone=payload.phone or "",
            country_code=payload.countryCode or "+91",
            community_id=payload.communityId or "",
            community_name="",
            district="Coimbatore"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database registration failed. Please try again later."
        )

    # 6. Generate signed JWT token
    token = create_access_token(user_profile.id, clean_email)

    return AuthResponse(token=token, token_type="bearer", user=user_profile)

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    clean_email = payload.email.strip().lower()
    if not clean_email or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter both your email address and password."
        )

    user_row = get_user_raw_by_email(clean_email)
    if not user_row:
        # Prevent user enumeration with generic error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    stored_hash = user_row.get("password_hash")

    # Handle demo user or upgrade if password_hash was initially null
    if not stored_hash:
        if clean_email == "karthikeyanng4@gmail.com" and payload.password == "SecurePass@2025":
            salt = bcrypt.gensalt(rounds=12)
            upgraded_hash = bcrypt.hashpw(payload.password.encode("utf-8"), salt).decode("utf-8")
            set_user_password_hash(user_row["id"], upgraded_hash)
            stored_hash = upgraded_hash
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )

    try:
        password_matches = bcrypt.checkpw(
            payload.password.encode("utf-8"),
            stored_hash.encode("utf-8")
        )
    except Exception:
        password_matches = False

    if not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    profile = row_to_user_profile(user_row)
    token = create_access_token(profile.id, profile.email)

    return AuthResponse(token=token, token_type="bearer", user=profile)

@router.get("/me", response_model=UserProfile)
def get_me(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing token."
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please log in again."
        )

    user_id = payload["sub"]
    profile = get_user_profile(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user record not found."
        )

    return profile
