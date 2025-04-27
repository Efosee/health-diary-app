from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.crud.sport_event import sport_event as crud_sport_event
from app.schemas.sport_event import SportEvent, SportEventCreate
from app.core.security import get_current_user
from app.schemas.user import User
from app.crud.user import user as crud_user
import logging
router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/", response_model=SportEvent, status_code=201)
def create_sport_event(
        event_in: SportEventCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Создание нового спортивного мероприятия (доступно только администраторам)."""
    logger.info(f"Received event_in: {event_in}")
    if not crud_user.is_admin(current_user):
        raise HTTPException(status_code=403, detail="Только администраторы могут создавать мероприятия")

    event = crud_sport_event.create(db, obj_in=event_in)
    logger.info(f"Created event: {event}")
    return event

@router.get("/upcoming", response_model=List[SportEvent])
def read_upcoming_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получение списка предстоящих мероприятий."""
    events = crud_sport_event.get_upcoming_events(db, skip=skip, limit=limit)
    return events

@router.get("/current_week", response_model=List[SportEvent])
def read_current_week_events(db: Session = Depends(get_db)):
    """Получение списка мероприятий на текущей неделе."""
    events = crud_sport_event.get_events_for_current_week(db)
    return events

@router.get("/past", response_model=List[SportEvent])
def read_past_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получение списка прошедших мероприятий."""
    events = crud_sport_event.get_past_events(db, skip=skip, limit=limit)
    return events