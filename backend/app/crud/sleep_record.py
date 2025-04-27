from typing import List, Optional, Dict, Any, Union
from datetime import date

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.model.sleep_record import SleepRecord
from app.schemas.sleep_record import SleepRecordCreate, SleepRecordUpdate
from app.crud.base import CRUDBase


class CRUDSleepRecord(CRUDBase[SleepRecord, SleepRecordCreate, SleepRecordUpdate]):
    def get_by_user_date(self, db: Session, *, user_id: int, sleep_date: date) -> Optional[SleepRecord]:
        """Get sleep record for a specific user and date."""
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.sleep_date == sleep_date
        ).first()

    def get_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[SleepRecord]:
        """Get all sleep records for a specific user."""
        return db.query(self.model).filter(
            self.model.user_id == user_id
        ).order_by(self.model.sleep_date.desc()).offset(skip).limit(limit).all()

    def create_update_sleep_record(
            self, db: Session, *, obj_in: SleepRecordCreate, user_id: int
    ) -> SleepRecord:
        """Create or update a sleep record for a user on a specific date."""
        db_obj = self.get_by_user_date(db, user_id=user_id, sleep_date=obj_in.sleep_date)
        if db_obj:
            update_data = jsonable_encoder(obj_in)
            for field in update_data:
                if update_data[field] is not None:
                    setattr(db_obj, field, update_data[field])
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        else:
            db_obj = SleepRecord(
                user_id=user_id,
                sleep_date=obj_in.sleep_date,
                sleep_quality=obj_in.sleep_quality,
                sleep_hours=obj_in.sleep_hours
            )
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj


sleep_record = CRUDSleepRecord(SleepRecord)
