from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic_core import ValidationError
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.model.training_entry import PersonalTrainingEntry, EventTrainingEntry
from app.schemas.training_entry import (
    PersonalTrainingEntryCreate, PersonalTrainingEntryUpdate,
    EventTrainingEntryCreate, EventTrainingEntryUpdate
)
from app.crud.base import CRUDBase
from app.schemas.sleep_record import SleepRecordCreate
from app.crud.sleep_record import sleep_record

class CRUDPersonalTrainingEntry(CRUDBase[PersonalTrainingEntry, PersonalTrainingEntryCreate, PersonalTrainingEntryUpdate]):
    def get_by_user(
            self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[PersonalTrainingEntry]:
        return db.query(self.model).filter(
            self.model.user_id == user_id
        ).order_by(self.model.entry_date.desc()).offset(skip).limit(limit).all()

    def get_entries_by_date_range(
            self, db: Session, *, user_id: int, start_date: date, end_date: date
    ) -> List[PersonalTrainingEntry]:
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.entry_date >= start_date,
            self.model.entry_date <= end_date
        ).order_by(self.model.entry_date.desc()).all()

    def create_with_user_id(
            self, db: Session, *, obj_in: PersonalTrainingEntryCreate, user_id: int
    ) -> PersonalTrainingEntry:
        # Сначала валидируем входные данные через Pydantic
        try:
            obj_in_data = obj_in.dict()
            validated_data = PersonalTrainingEntryCreate(**obj_in_data)
        except ValidationError as e:
            # Преобразуем ошибки в сериализуемый формат
            errors = [{'type': err['type'], 'loc': err['loc'], 'msg': err['msg']} for err in e.errors()]
            raise HTTPException(status_code=422, detail=errors)

        # Вычисляем BMI, если есть height и weight
        bmi = None
        if validated_data.height and validated_data.weight and validated_data.height > 0:
            height_m = validated_data.height / 100
            bmi = validated_data.weight / (height_m * height_m)
            bmi = round(bmi, 2)

        # Обработка записи сна
        if validated_data.sleep_quality or validated_data.sleep_hours is not None:
            entry_date_raw = validated_data.entry_date or datetime.utcnow()
            if isinstance(entry_date_raw, str):
                entry_date = datetime.fromisoformat(entry_date_raw.replace("Z", "+00:00"))
            else:
                entry_date = entry_date_raw
            sleep_data = SleepRecordCreate(
                sleep_date=entry_date.date(),
                sleep_quality=validated_data.sleep_quality,
                sleep_hours=validated_data.sleep_hours
            )
            sleep_record.create_update_sleep_record(db, obj_in=sleep_data, user_id=user_id)

        # Подготовка данных для записи
        obj_in_data = jsonable_encoder(validated_data)
        if not obj_in_data.get('entry_date'):
            obj_in_data['entry_date'] = func.now()

        # Сбрасываем поля, специфичные для "after", если entry_timing="before" или "rest"
        if obj_in_data["entry_timing"] in ["before", "rest"]:
            obj_in_data["training_intensity"] = None
            obj_in_data["has_injury"] = None
            obj_in_data["injury_location"] = None

        # Создаём и сохраняем объект только после успешной валидации
        db_obj = PersonalTrainingEntry(**obj_in_data, user_id=user_id, bmi=bmi)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_entry(
            self, db: Session, *, db_obj: PersonalTrainingEntry,
            obj_in: Union[PersonalTrainingEntryUpdate, Dict[str, Any]]
    ) -> PersonalTrainingEntry:
        update_data = obj_in.dict(exclude_unset=True) if not isinstance(obj_in, dict) else obj_in

        # Получаем текущие данные записи
        current_data = jsonable_encoder(db_obj)
        updated_data = {**current_data, **update_data}

        # Если entry_timing изменён на "before" или "rest", сбрасываем поля, специфичные для "after"
        if "entry_timing" in update_data and update_data["entry_timing"] in ["before", "rest"]:
            if "training_intensity" not in update_data:
                updated_data["training_intensity"] = None
            if "has_injury" not in update_data:
                updated_data["has_injury"] = None
            if "injury_location" not in update_data:
                updated_data["injury_location"] = None
            # Удаляем сброс wellbeing_score, так как оно обязательно

        # Вычисляем BMI, если переданы height и weight
        height = updated_data.get("height")
        weight = updated_data.get("weight")
        if height and weight and height > 0:
            height_m = height / 100
            bmi = weight / (height_m * height_m)
            updated_data["bmi"] = round(bmi, 2)

        # Обновляем запись сна, если переданы sleep_quality или sleep_hours
        if "sleep_quality" in update_data or "sleep_hours" in update_data:
            entry_date_raw = updated_data.get("entry_date", db_obj.entry_date)
            if isinstance(entry_date_raw, str):
                entry_date = datetime.fromisoformat(entry_date_raw.replace("Z", "+00:00"))
            else:
                entry_date = entry_date_raw
            sleep_data = SleepRecordCreate(
                sleep_date=entry_date.date(),
                sleep_quality=updated_data.get("sleep_quality", db_obj.sleep_quality),
                sleep_hours=updated_data.get("sleep_hours", db_obj.sleep_hours)
            )
            sleep_record.create_update_sleep_record(db, obj_in=sleep_data, user_id=db_obj.user_id)

        # Валидация обновлённых данных
        validated_data = PersonalTrainingEntryCreate(**updated_data)

        # Применяем изменения к объекту
        for field in updated_data:
            if field in update_data or (
                    "entry_timing" in update_data and
                    update_data["entry_timing"] in ["before", "rest"] and
                    field in ["training_intensity", "has_injury", "injury_location"]
            ):
                setattr(db_obj, field, updated_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


class CRUDEventTrainingEntry(CRUDBase[EventTrainingEntry, EventTrainingEntryCreate, EventTrainingEntryUpdate]):
    def get_by_user(
            self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[EventTrainingEntry]:
        return db.query(self.model).filter(
            self.model.user_id == user_id
        ).order_by(self.model.entry_date.desc()).offset(skip).limit(limit).all()

    def get_by_event(
            self, db: Session, *, event_id: int, skip: int = 0, limit: int = 100
    ) -> List[EventTrainingEntry]:
        return db.query(self.model).filter(
            self.model.event_id == event_id
        ).order_by(self.model.entry_date.desc()).offset(skip).limit(limit).all()

    def get_by_user_and_event(
            self, db: Session, *, user_id: int, event_id: int
    ) -> List[EventTrainingEntry]:
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.event_id == event_id
        ).order_by(self.model.entry_date.desc()).all()

    def get_entries_by_date_range(
            self, db: Session, *, user_id: int, start_date: date, end_date: date
    ) -> List[EventTrainingEntry]:
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.entry_date >= start_date,
            self.model.entry_date <= end_date
        ).order_by(self.model.entry_date.desc()).all()

    def create_with_user_id(
            self, db: Session, *, obj_in: EventTrainingEntryCreate, user_id: int
    ) -> EventTrainingEntry:
        # Сначала валидируем входные данные через Pydantic
        try:
            obj_in_data = obj_in.dict()
            validated_data = EventTrainingEntryCreate(**obj_in_data)
        except ValidationError as e:
            # Преобразуем ошибки в сериализуемый формат
            errors = []
            for error in e.errors():
                # Убираем или преобразуем несериализуемые объекты в ctx
                ctx = error.get('ctx', {})
                if 'error' in ctx:
                    ctx['error'] = str(ctx['error'])  # Преобразуем ValueError в строку
                errors.append({
                    'type': error['type'],
                    'loc': error['loc'],
                    'msg': error['msg'],
                    'input': error.get('input'),
                    'ctx': ctx
                })
            raise HTTPException(status_code=422, detail=errors)

        # Вычисляем BMI, если есть height и weight
        bmi = None
        if validated_data.height and validated_data.weight and validated_data.height > 0:
            height_m = validated_data.height / 100
            bmi = validated_data.weight / (height_m * height_m)
            bmi = round(bmi, 2)

        # Обработка записи сна
        if validated_data.sleep_quality or validated_data.sleep_hours is not None:
            entry_date_raw = validated_data.entry_date or datetime.utcnow()
            if isinstance(entry_date_raw, str):
                entry_date = datetime.fromisoformat(entry_date_raw.replace("Z", "+00:00"))
            else:
                entry_date = entry_date_raw
            sleep_data = SleepRecordCreate(
                sleep_date=entry_date.date(),
                sleep_quality=validated_data.sleep_quality,
                sleep_hours=validated_data.sleep_hours
            )
            sleep_record.create_update_sleep_record(db, obj_in=sleep_data, user_id=user_id)

        # Подготовка данных для записи
        obj_in_data = jsonable_encoder(validated_data)
        if not obj_in_data.get('entry_date'):
            obj_in_data['entry_date'] = func.now()

        # Сбрасываем поля, специфичные для "after", если entry_timing="before" или "rest"
        if obj_in_data["entry_timing"] in ["before", "rest"]:
            obj_in_data["training_intensity"] = None
            obj_in_data["has_injury"] = None
            obj_in_data["injury_location"] = None

        # Создаём и сохраняем объект только после успешной валидации
        db_obj = EventTrainingEntry(**obj_in_data, user_id=user_id, bmi=bmi)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_entry(
            self, db: Session, *, db_obj: EventTrainingEntry, obj_in: Union[EventTrainingEntryUpdate, Dict[str, Any]]
    ) -> EventTrainingEntry:
        update_data = obj_in.dict(exclude_unset=True) if not isinstance(obj_in, dict) else obj_in

        # Получаем текущие данные записи
        current_data = jsonable_encoder(db_obj)
        updated_data = {**current_data, **update_data}

        # Если entry_timing изменён на "before" или "rest", сбрасываем поля, специфичные для "after"
        if "entry_timing" in update_data and update_data["entry_timing"] in ["before", "rest"]:
            if "training_intensity" not in update_data:
                updated_data["training_intensity"] = None
            if "has_injury" not in update_data:
                updated_data["has_injury"] = None
            if "injury_location" not in update_data:
                updated_data["injury_location"] = None
            # Удаляем сброс wellbeing_score, так как оно обязательно

        # Вычисляем BMI, если переданы height и weight
        height = updated_data.get("height")
        weight = updated_data.get("weight")
        if height and weight and height > 0:
            height_m = height / 100
            bmi = weight / (height_m * height_m)
            updated_data["bmi"] = round(bmi, 2)

        # Обновляем запись сна, если переданы sleep_quality или sleep_hours
        if "sleep_quality" in update_data or "sleep_hours" in update_data:
            entry_date_raw = updated_data.get("entry_date", db_obj.entry_date)
            if isinstance(entry_date_raw, str):
                entry_date = datetime.fromisoformat(entry_date_raw.replace("Z", "+00:00"))
            else:
                entry_date = entry_date_raw
            sleep_data = SleepRecordCreate(
                sleep_date=entry_date.date(),
                sleep_quality=updated_data.get("sleep_quality", db_obj.sleep_quality),
                sleep_hours=updated_data.get("sleep_hours", db_obj.sleep_hours)
            )
            sleep_record.create_update_sleep_record(db, obj_in=sleep_data, user_id=db_obj.user_id)

        # Валидация обновлённых данных
        validated_data = EventTrainingEntryCreate(**updated_data)

        # Применяем изменения к объекту
        for field in updated_data:
            if field in update_data or (
                    "entry_timing" in update_data and
                    update_data["entry_timing"] in ["before", "rest"] and
                    field in ["training_intensity", "has_injury", "injury_location"]
            ):
                setattr(db_obj, field, updated_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

personal_training_entry = CRUDPersonalTrainingEntry(PersonalTrainingEntry)
event_training_entry = CRUDEventTrainingEntry(EventTrainingEntry)