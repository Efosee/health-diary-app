from pydantic import BaseModel, field_validator, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from app.core.utils import datetime_moscow_now


class EntryTimingEnum(str, Enum):
    before = "before"
    after = "after"
    rest = "rest"


class InjuryLocationEnum(str, Enum):
    leg = "leg"
    arm = "arm"
    torso = "torso"
    head = "head"
    other = "other"


class TrainingEntryBase(BaseModel):
    entry_timing: EntryTimingEnum
    entry_date: datetime = Field(default_factory=datetime_moscow_now)
    wellbeing_score: int = Field(..., ge=1, le=10)
    training_intensity: Optional[int] = Field(None, ge=1, le=10)
    has_injury: Optional[bool] = None
    injury_location: Optional[InjuryLocationEnum] = None
    blood_pressure_sys: Optional[int] = None
    blood_pressure_dia: Optional[int] = None
    food_score: Optional[int] = Field(None, ge=0, le=10)
    temperature: Optional[float] = Field(None, ge=34, le=42)
    pulse: Optional[int] = Field(None, ge=30, le=250)
    weight: Optional[float] = None
    height: Optional[float] = None
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = None
    blood_sugar: Optional[float] = None
    medications: Optional[str] = None
    personal_notes: Optional[str] = None


class PersonalTrainingEntryCreate(TrainingEntryBase):
    @field_validator('training_intensity', 'has_injury')
    def validate_after_fields_required(cls, v, info):
        entry_timing = info.data.get('entry_timing')
        if entry_timing == EntryTimingEnum.after and v is None:
            field_name = info.field_name
            raise ValueError(f"{field_name} is required when entry_timing is 'after'")
        if v is not None and entry_timing != EntryTimingEnum.after:
            field_name = info.field_name
            raise ValueError(f"{field_name} can only be set if entry_timing is 'after'")
        return v

    @field_validator('injury_location')
    def validate_injury_location(cls, v, info):
        has_injury = info.data.get('has_injury')
        entry_timing = info.data.get('entry_timing')
        if v is not None and not has_injury:
            raise ValueError('injury_location can only be set if has_injury is True')
        if has_injury and v is None and entry_timing == EntryTimingEnum.after:
            raise ValueError('injury_location is required if has_injury is True and entry_timing is "after"')
        if v is not None and entry_timing != EntryTimingEnum.after:
            raise ValueError('injury_location can only be set if entry_timing is "after"')
        return v



class EventTrainingEntryCreate(TrainingEntryBase):
    event_id: int

    @field_validator('training_intensity', 'has_injury')
    def validate_after_fields_required(cls, v, info):
        entry_timing = info.data.get('entry_timing')
        if entry_timing == EntryTimingEnum.after and v is None:
            field_name = info.field_name
            raise ValueError(f"{field_name} is required when entry_timing is 'after'")
        if v is not None and entry_timing != EntryTimingEnum.after:
            field_name = info.field_name
            raise ValueError(f"{field_name} can only be set if entry_timing is 'after'")
        return v

    @field_validator('injury_location')
    def validate_injury_location(cls, v, info):
        has_injury = info.data.get('has_injury')
        entry_timing = info.data.get('entry_timing')
        if v is not None and not has_injury:
            raise ValueError('injury_location can only be set if has_injury is True')
        if has_injury and v is None and entry_timing == EntryTimingEnum.after:
            raise ValueError('injury_location is required if has_injury is True and entry_timing is "after"')
        if v is not None and entry_timing != EntryTimingEnum.after:
            raise ValueError('injury_location can only be set if entry_timing is "after"')
        return v


class TrainingEntryUpdate(BaseModel):
    entry_timing: Optional[EntryTimingEnum] = None
    entry_date: Optional[datetime] = None
    wellbeing_score: Optional[int] = Field(None, ge=1, le=10)
    training_intensity: Optional[int] = Field(None, ge=1, le=10)
    has_injury: Optional[bool] = None
    injury_location: Optional[InjuryLocationEnum] = None
    blood_pressure_sys: Optional[int] = None
    blood_pressure_dia: Optional[int] = None
    food_score: Optional[int] = Field(None, ge=0, le=10)
    temperature: Optional[float] = Field(None, ge=34, le=42)
    pulse: Optional[int] = Field(None, ge=30, le=250)
    weight: Optional[float] = None
    height: Optional[float] = None
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = None
    blood_sugar: Optional[float] = None
    medications: Optional[str] = None
    personal_notes: Optional[str] = None

    @field_validator('wellbeing_score')
    def validate_wellbeing_score(cls, v, info):
        entry_timing = info.data.get('entry_timing')
        if entry_timing == [EntryTimingEnum.before, EntryTimingEnum.rest, EntryTimingEnum.after] and v is None:
            raise ValueError("wellbeing_score is required")
        return v

    @field_validator('training_intensity', 'has_injury')
    def validate_after_fields_required(cls, v, info):
        entry_timing = info.data.get('entry_timing')
        if entry_timing == EntryTimingEnum.after and v is None:
            field_name = info.field_name
            raise ValueError(f"{field_name} is required when entry_timing is 'after'")
        if v is not None and entry_timing != EntryTimingEnum.after:
            field_name = info.field_name
            raise ValueError(f"{field_name} can only be set if entry_timing is 'after'")
        return v

    @field_validator('injury_location')
    def validate_injury_location(cls, v, info):
        has_injury = info.data.get('has_injury')
        entry_timing = info.data.get('entry_timing')
        if v is not None and has_injury is False:
            raise ValueError('injury_location can only be set if has_injury is True')
        if has_injury and v is None and entry_timing == EntryTimingEnum.after:
            raise ValueError('injury_location is required if has_injury is True and entry_timing is "after"')
        if v is not None and entry_timing != EntryTimingEnum.after:
            raise ValueError('injury_location can only be set if entry_timing is "after"')
        return v


class PersonalTrainingEntryUpdate(TrainingEntryUpdate):
    pass


class EventTrainingEntryUpdate(TrainingEntryUpdate):
    event_id: Optional[int] = None


class PersonalTrainingEntryInDBBase(PersonalTrainingEntryCreate):
    id: int
    user_id: int
    bmi: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EventTrainingEntryInDBBase(EventTrainingEntryCreate):
    id: int
    user_id: int
    event_id: int
    bmi: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PersonalTrainingEntry(PersonalTrainingEntryInDBBase):
    pass


class EventTrainingEntry(EventTrainingEntryInDBBase):
    pass


class PersonalTrainingEntryInDB(PersonalTrainingEntryInDBBase):
    pass


class EventTrainingEntryInDB(EventTrainingEntryInDBBase):
    pass