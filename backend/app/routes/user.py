from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.user import user as crud_user
from app.schemas.user import User, UserUpdate
from app.core.security import get_current_user

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(current_user: User = Depends(get_current_user)):
    """Получение данных текущего пользователя."""
    return current_user

@router.put("/me", response_model=User)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление данных текущего пользователя."""
    updated_user = crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return updated_user