from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class SleepRecordBase(BaseModel):
    sleep_date: date
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = None


class SleepRecordCreate(SleepRecordBase):
    pass


class SleepRecordUpdate(SleepRecordBase):
    sleep_date: Optional[date] = None


class SleepRecordInDBBase(SleepRecordBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SleepRecord(SleepRecordInDBBase):
    pass


class SleepRecordInDB(SleepRecordInDBBase):
    pass