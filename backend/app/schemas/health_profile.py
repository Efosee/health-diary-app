from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class HealthProfileBase(BaseModel):
    chronic_diseases: Optional[str] = None
    height: Optional[float] = Field(None, ge=0)
    weight: Optional[float] = Field(None, ge=0)


class HealthProfileCreate(HealthProfileBase):
    user_id: Optional[int] = None


class HealthProfileUpdate(HealthProfileBase):
    pass


class HealthProfileInDBBase(HealthProfileBase):
    id: int
    user_id: int
    avg_blood_pressure_sys: Optional[float] = None
    avg_blood_pressure_dia: Optional[float] = None
    avg_blood_sugar: Optional[float] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class HealthProfile(HealthProfileInDBBase):
    pass


class HealthProfileInDB(HealthProfileInDBBase):
    pass