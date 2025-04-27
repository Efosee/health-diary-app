from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, func, Text, CheckConstraint
from sqlalchemy.types import Enum
import enum
from sqlalchemy.orm import relationship, declarative_mixin
from app.db.base import Base


class EntryTimingType(enum.Enum):
    before = "before"
    after = "after"
    rest = "rest"


class InjuryLocationType(enum.Enum):
    leg = "leg"
    arm = "arm"
    torso = "torso"
    head = "head"
    other = "other"


@declarative_mixin
class TrainingEntryBase:
    """Базовый миксин для общих полей записей тренировок"""

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    entry_timing = Column(Enum(EntryTimingType), nullable=False)
    entry_date = Column(DateTime, nullable=False, default=func.now())
    wellbeing_score = Column(Integer, CheckConstraint("wellbeing_score BETWEEN 1 AND 10"), nullable=False)
    training_intensity = Column(Integer, CheckConstraint("training_intensity BETWEEN 1 AND 10"), nullable=True)
    has_injury = Column(Boolean, nullable=True)
    injury_location = Column(Enum(InjuryLocationType), nullable=True)
    blood_pressure_sys = Column(Integer, nullable=True)
    blood_pressure_dia = Column(Integer, nullable=True)
    food_score = Column(Integer, CheckConstraint("food_score BETWEEN 0 AND 10"), nullable=True)
    temperature = Column(Float, CheckConstraint("temperature BETWEEN 34 AND 42"), nullable=True)
    pulse = Column(Integer, CheckConstraint("pulse BETWEEN 30 AND 250"), nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    sleep_quality = Column(Integer, CheckConstraint("sleep_quality BETWEEN 1 AND 10"), nullable=True)
    sleep_hours = Column(Float, nullable=True)
    blood_sugar = Column(Float, nullable=True)
    medications = Column(Text, nullable=True)
    personal_notes = Column(Text, nullable=True)
    bmi = Column(Float, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=func.now())


class PersonalTrainingEntry(Base, TrainingEntryBase):
    __tablename__ = "personal_training_entries"

    user = relationship("User", backref="personal_entries")


class EventTrainingEntry(Base, TrainingEntryBase):
    __tablename__ = "event_training_entries"

    event_id = Column(Integer, ForeignKey("sport_events.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", backref="event_entries")
    event = relationship("SportEvent", backref="entries")