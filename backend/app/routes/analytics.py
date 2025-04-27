from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from app.db.session import get_db
from app.crud.training_entry import personal_training_entry as crud_personal_training
from app.crud.training_entry import event_training_entry as crud_event_training
from app.schemas.user import User
from app.core.security import get_current_user
from app.schemas.analytics import AnalyticsResponse, EntryType, MetricData

router = APIRouter()

@router.get("/metrics", response_model=AnalyticsResponse)
def get_metrics_data(
    start_date: date = Query(..., description="Start date of the range"),
    end_date: date = Query(..., description="End date of the range"),
    metrics: List[str] = Query(
        default=["wellbeing_score"],
        description="List of metrics to retrieve (e.g., wellbeing_score, weight, personal_notes, etc.)",
        example=["wellbeing_score", "training_intensity", "personal_notes"]
    ),
    entry_type: EntryType = Query(
        default=EntryType.all,
        description="Type of entries to retrieve: personal, event, or all"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение данных по указанным метрикам за период."""
    # Доступные метрики
    available_metrics = {
        "wellbeing_score", "training_intensity", "has_injury", "injury_location",
        "weight", "height", "bmi", "blood_pressure_sys", "blood_pressure_dia",
        "food_score", "temperature", "pulse", "sleep_quality", "sleep_hours",
        "blood_sugar", "personal_notes", "medications"
    }

    # Валидация запрошенных метрик
    invalid_metrics = [m for m in metrics if m not in available_metrics]
    if invalid_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metrics: {invalid_metrics}. Available metrics: {list(available_metrics)}"
        )

    # Метрики, доступные только для "after"
    after_only_metrics = {"training_intensity", "has_injury", "injury_location"}

    # Получение данных
    personal_data = []
    event_data = []

    if entry_type in [EntryType.personal, EntryType.all]:
        personal_entries = crud_personal_training.get_entries_by_date_range(
            db, user_id=current_user.id, start_date=start_date, end_date=end_date
        )
        personal_data = [
            MetricData(
                date=entry.entry_date,
                entry_timing=entry.entry_timing.value,
                event_id=None,  # Для personal записей event_id всегда None
                metrics={
                    metric: getattr(entry, metric)
                    for metric in metrics
                    if metric not in after_only_metrics or entry.entry_timing == "after"
                }
            )
            for entry in personal_entries
        ]

    if entry_type in [EntryType.event, EntryType.all]:
        event_entries = crud_event_training.get_entries_by_date_range(
            db, user_id=current_user.id, start_date=start_date, end_date=end_date
        )
        event_data = [
            MetricData(
                date=entry.entry_date,
                entry_timing=entry.entry_timing.value,
                event_id=entry.event_id,  # Добавляем event_id для event записей
                metrics={
                    metric: getattr(entry, metric)
                    for metric in metrics
                    if metric not in after_only_metrics or entry.entry_timing == "after"
                }
            )
            for entry in event_entries
        ]

    # Формирование ответа
    response = AnalyticsResponse()
    if entry_type == EntryType.personal:
        response.personal = personal_data
    elif entry_type == EntryType.event:
        response.event = event_data
    else:  # EntryType.all
        response.personal = personal_data
        response.event = event_data

    return response

@router.get("/wellbeing")
def get_wellbeing_data(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение данных о самочувствии за период."""
    personal_entries = crud_personal_training.get_entries_by_date_range(
        db, user_id=current_user.id, start_date=start_date, end_date=end_date
    )
    event_entries = crud_event_training.get_entries_by_date_range(
        db, user_id=current_user.id, start_date=start_date, end_date=end_date
    )
    # Объединяем данные и форматируем для фронтенда
    data = [
        {"date": entry.entry_date, "wellbeing": entry.wellbeing_score}
        for entry in personal_entries + event_entries
    ]
    return data
