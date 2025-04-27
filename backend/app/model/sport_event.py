from sqlalchemy import Column, Integer, String, DateTime, func, Text
from app.db.base import Base


class SportEvent(Base):
    __tablename__ = "sport_events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False)
    registration_deadline = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    organizer = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())