from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.health_profile import health_profile as crud_health_profile
from app.schemas.health_profile import HealthProfile, HealthProfileCreate, HealthProfileUpdate
from app.core.security import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.get("/me", response_model=HealthProfile)
def read_health_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение профиля здоровья текущего пользователя."""
    health_profile = crud_health_profile.get_by_user_id(db, user_id=current_user.id)
    if not health_profile:
       # return HealthProfile(user_id=current_user.id)  -> Возвращаем пустой профиль (Устарело)
       profile_in = HealthProfileCreate(user_id=current_user.id)
       health_profile = crud_health_profile.create(db, obj_in=profile_in)
    return health_profile

@router.post("/me", response_model=HealthProfile)
def create_health_profile(
    health_in: HealthProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создание профиля здоровья текущего пользователя."""
    health_in.user_id = current_user.id
    health_profile = crud_health_profile.create_or_update(db, obj_in=health_in)
    return health_profile

@router.put("/me", response_model=HealthProfile)
def update_health_profile(
    health_in: HealthProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление профиля здоровья текущего пользователя."""
    health_profile = crud_health_profile.get_by_user_id(db, user_id=current_user.id)
    if not health_profile:
        raise HTTPException(status_code=404, detail="Профиль здоровья не найден")
    updated_profile = crud_health_profile.update(db, db_obj=health_profile, obj_in=health_in)
    return updated_profile