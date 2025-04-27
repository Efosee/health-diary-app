from pydantic import BaseModel, EmailStr, field_validator
from datetime import date, datetime
from typing import Optional
from app.model.user import GenderType

class UserBase(BaseModel):
    full_name: str
    birth_date: date
    gender: GenderType
    email: EmailStr
    height: Optional[float] = None
    weight: Optional[float] = None


class UserCreate(UserBase):
    password: str
    personal_data_consent: bool
    health_data_consent: bool

    @field_validator('personal_data_consent', 'health_data_consent')
    def validate_consents(cls, v):
        if not v:
            raise ValueError('Consent is required')
        return v

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isalpha() for char in v):
            raise ValueError('Password must contain at least one letter')
        return v


class UserInDBBase(UserBase):
    id: int
    is_admin: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    password_hash: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isalpha() for char in v):
            raise ValueError('Password must contain at least one letter')
        return v