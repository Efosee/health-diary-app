from datetime import datetime, timedelta
from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.model.sport_event import SportEvent
from app.schemas.sport_event import SportEventCreate, SportEventUpdate


class CRUDSportEvent(CRUDBase[SportEvent, SportEventCreate, SportEventUpdate]):
    def get_upcoming_events(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[SportEvent]:
        return (
            db.query(SportEvent)
            .filter(SportEvent.event_date >= datetime.now())
            .order_by(SportEvent.event_date)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_events_for_current_week(self, db: Session) -> List[SportEvent]:
        # Получаем текущую дату
        now = datetime.now()
        # Получаем начало и конец текущей недели
        start_of_week = now - timedelta(days=now.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        return (
            db.query(SportEvent)
            .filter(SportEvent.event_date >= start_of_week)
            .filter(SportEvent.event_date <= end_of_week)
            .order_by(SportEvent.event_date)
            .all()
        )

    def get_past_events(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[SportEvent]:
        return (
            db.query(SportEvent)
            .filter(SportEvent.event_date < datetime.now())
            .order_by(SportEvent.event_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


sport_event = CRUDSportEvent(SportEvent)