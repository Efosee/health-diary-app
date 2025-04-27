from sqlalchemy import Column, Integer, Float, Date, ForeignKey, DateTime, func, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class SleepRecord(Base):
    __tablename__ = "sleep_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sleep_date = Column(Date, nullable=False)
    sleep_quality = Column(Integer, CheckConstraint("sleep_quality BETWEEN 1 AND 10"), nullable=True)
    sleep_hours = Column(Float, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())

    user = relationship("User", backref="sleep_records")

    __table_args__ = (
        UniqueConstraint('user_id', 'sleep_date', name='unique_user_sleep_date'),
    )