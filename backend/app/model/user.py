from sqlalchemy import Column, Integer, String, Date, Enum, Boolean, Float, DateTime
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class GenderType(enum.Enum):
    male = "male"
    female = "female"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(GenderType), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    height = Column(Float)
    weight = Column(Float)
    personal_data_consent = Column(Boolean, default=False, nullable=False)
    health_data_consent = Column(Boolean, default=False, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())