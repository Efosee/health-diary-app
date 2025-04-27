from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import get_db
from app.crud.user import user as crud_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.schemas.user import UserCreate, UserInDB
from app.schemas.token import Token

router = APIRouter()

@router.post("/register", response_model=UserInDB)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя."""
    # Проверяем, существует ли пользователь с таким email
    existing_user = crud_user.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email уже зарегистрирован"
        )
    # Хешируем пароль
    # hashed_password = get_password_hash(user_in.password)
    # user_in.password = hashed_password
    # Создаем пользователя в БД
    new_user = crud_user.create(db, obj_in=user_in)
    return new_user

@router.post("/token", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """Вход пользователя и получение JWT-токена."""
    # Проверяем учетные данные
    user = crud_user.get_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Создаем токен с временем жизни 30 минут
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}