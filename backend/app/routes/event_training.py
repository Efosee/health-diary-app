from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.crud.training_entry import event_training_entry as crud_event_training
from app.crud.sport_event import sport_event as crud_sport_event
from app.schemas.training_entry import EventTrainingEntry, EventTrainingEntryCreate, EventTrainingEntryUpdate
from app.core.security import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.post("/", response_model=EventTrainingEntry)
def create_event_training_entry(
    entry_in: EventTrainingEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создание новой записи тренировки для мероприятия."""
    event = crud_sport_event.get(db, id=entry_in.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Событие не найдено")
    if event.event_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Нельзя создать запись для просроченного события")
    entry = crud_event_training.create_with_user_id(db, obj_in=entry_in, user_id=current_user.id)
    return entry

@router.get("/", response_model=List[EventTrainingEntry])
def read_event_training_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение списка записей тренировок для мероприятий текущего пользователя."""
    entries = crud_event_training.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return entries

@router.get("/{entry_id}", response_model=EventTrainingEntry)
def read_event_training_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение конкретной записи тренировки для мероприятия."""
    entry = crud_event_training.get(db, id=entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    return entry

@router.put("/{entry_id}", response_model=EventTrainingEntry)
def update_event_training_entry(
    entry_id: int,
    entry_in: EventTrainingEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновление записи тренировки для мероприятия."""
    entry = crud_event_training.get(db, id=entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    # Проверяем, существует ли указанное событие, если event_id предоставлен
    if entry_in.event_id is not None:
          sport_event = crud_sport_event.get(db, id=entry_in.event_id)
          if not sport_event:
              raise HTTPException(
                  status_code=422,
                 detail=f"Событие с ID {entry_in.event_id} не существует"
            )
    try:
        updated_entry = crud_event_training.update_entry(db, db_obj=entry, obj_in=entry_in)
        return updated_entry
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())