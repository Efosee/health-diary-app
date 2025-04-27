from fastapi import APIRouter, Depends, HTTPException
from fastapi.exceptions import ResponseValidationError
from pydantic_core import ValidationError
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.crud.training_entry import personal_training_entry as crud_personal_training
from app.schemas.training_entry import PersonalTrainingEntry, PersonalTrainingEntryCreate, PersonalTrainingEntryUpdate
from app.core.security import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.post("/", response_model=PersonalTrainingEntry)
def create_personal_training_entry(
    entry_in: PersonalTrainingEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = crud_personal_training.create_with_user_id(db, obj_in=entry_in, user_id=current_user.id)
    return entry

@router.get("/", response_model=List[PersonalTrainingEntry])
def read_personal_training_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение списка записей личных тренировок текущего пользователя."""
    entries = crud_personal_training.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return entries

@router.get("/{entry_id}", response_model=PersonalTrainingEntry)
def read_personal_training_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение конкретной записи личной тренировки."""
    entry = crud_personal_training.get(db, id=entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    return entry

@router.put("/{entry_id}", response_model=PersonalTrainingEntry)
def update_personal_training_entry(
    entry_id: int,
    entry_in: PersonalTrainingEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление записи личной тренировки."""
    entry = crud_personal_training.get(db, id=entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    try:
        updated_entry = crud_personal_training.update_entry(db, db_obj=entry, obj_in=entry_in)
        return updated_entry
    except ValidationError as e:
        # Сериализуем `ctx["error"]` как строку, чтобы FastAPI не ломался
        fixed_errors = []
        for err in e.errors():
            ctx = err.get("ctx", {})
            if "error" in ctx and isinstance(ctx["error"], Exception):
                ctx["error"] = str(ctx["error"])
            fixed_errors.append(err)

        raise HTTPException(status_code=422, detail=fixed_errors)