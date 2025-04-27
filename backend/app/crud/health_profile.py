from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.model.health_profile import HealthProfile
from app.schemas.health_profile import HealthProfileCreate, HealthProfileUpdate


class CRUDHealthProfile(CRUDBase[HealthProfile, HealthProfileCreate, HealthProfileUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[HealthProfile]:
        return db.query(HealthProfile).filter(HealthProfile.user_id == user_id).first()

    def create_or_update(self, db: Session, *, obj_in: HealthProfileCreate) -> HealthProfile:
        db_obj = self.get_by_user_id(db, user_id=obj_in.user_id)
        if db_obj:
            return self.update(db, db_obj=db_obj, obj_in=obj_in)
        return self.create(db, obj_in=obj_in)


health_profile = CRUDHealthProfile(HealthProfile)