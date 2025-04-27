from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class HealthProfile(Base):
    __tablename__ = "health_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chronic_diseases = Column(Text, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    avg_blood_pressure_sys = Column(Float, nullable=True)
    avg_blood_pressure_dia = Column(Float, nullable=True)
    avg_blood_sugar = Column(Float, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    user = relationship("User", backref="health_profile")