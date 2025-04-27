from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import pytz

MOSCOW_TZ = pytz.timezone("Europe/Moscow")

class SportEventBase(BaseModel):
    name: str
    description: Optional[str] = None
    event_date: datetime
    registration_deadline: Optional[datetime] = None
    location: Optional[str] = None
    organizer: Optional[str] = None


class SportEventCreate(SportEventBase):
    @field_validator('event_date', mode='before')
    def parse_event_date(cls, v):
        # Если это строка (из JSON), парсим и приводим к московскому времени
        if isinstance(v, str):
            dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return dt.astimezone(MOSCOW_TZ)
        # Если это уже datetime, приводим к московскому времени
        if v.tzinfo is None:
            return MOSCOW_TZ.localize(v)
        return v.astimezone(MOSCOW_TZ)

    @field_validator('registration_deadline', mode='before')
    def parse_registration_deadline(cls, v):
        if v is None:
            return v
        # Аналогичная обработка для registration_deadline
        if isinstance(v, str):
            dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return dt.astimezone(MOSCOW_TZ)
        if v.tzinfo is None:
            return MOSCOW_TZ.localize(v)
        return v.astimezone(MOSCOW_TZ)

    @field_validator('event_date')
    def event_date_must_be_future(cls, v):
        # Убеждаемся, что v - offset-aware
        if v.tzinfo is None:
            v = MOSCOW_TZ.localize(v)
        now_moscow = datetime.now(MOSCOW_TZ)
        print(f"Validating event_date: {v} vs {now_moscow}")  # Отладка
        if v < now_moscow:
            raise ValueError(f"Event date {v} must be in the future (Moscow time: {now_moscow})")
        return v

    @field_validator('registration_deadline')
    def registration_deadline_before_event(cls, v, info):
        if v is None:
            return v
        # Убеждаемся, что v - offset-aware
        if v.tzinfo is None:
            v = MOSCOW_TZ.localize(v)
        event_date = info.data.get('event_date')
        if event_date:
            if event_date.tzinfo is None:
                event_date = MOSCOW_TZ.localize(event_date)
            print(f"Validating registration_deadline: {v} vs event_date {event_date}")  # Отладка
            if v >= event_date:
                raise ValueError(f"Registration deadline {v} must be before event date {event_date} (Moscow time)")
        return v


class SportEventUpdate(SportEventBase):
    name: Optional[str] = None
    event_date: Optional[datetime] = None

    @field_validator('event_date', mode='before')
    def parse_event_date(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return dt.astimezone(MOSCOW_TZ)
        if v.tzinfo is None:
            return MOSCOW_TZ.localize(v)
        return v.astimezone(MOSCOW_TZ)

    @field_validator('registration_deadline', mode='before')
    def parse_registration_deadline(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            dt = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return dt.astimezone(MOSCOW_TZ)
        if v.tzinfo is None:
            return MOSCOW_TZ.localize(v)
        return v.astimezone(MOSCOW_TZ)

    """ Для обновления прошедших событий валидатор может мешать
    @field_validator('event_date')
    def event_date_must_be_future(cls, v):
        if v is None:
            return v
        if v.tzinfo is None:
            v = MOSCOW_TZ.localize(v)
        now_moscow = datetime.now(MOSCOW_TZ)
        if v < now_moscow:
            raise ValueError(f"Event date {v} must be in the future (Moscow time: {now_moscow})")
        return v
    """

    @field_validator('registration_deadline')
    def registration_deadline_before_event(cls, v, info):
        if v is None:
            return v
        if v.tzinfo is None:
            v = MOSCOW_TZ.localize(v)
        event_date = info.data.get('event_date')
        if event_date:
            if event_date.tzinfo is None:
                event_date = MOSCOW_TZ.localize(event_date)
            if v >= event_date:
                raise ValueError(f"Registration deadline {v} must be before event date {event_date} (Moscow time)")
        return v
        



class SportEventInDBBase(SportEventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SportEvent(SportEventInDBBase):
    pass


class SportEventInDB(SportEventInDBBase):
    pass