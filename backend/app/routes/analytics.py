from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import List, Optional, Dict
import logging
from app.db.session import get_db
from app.crud.training_entry import personal_training_entry as crud_personal_training
from app.crud.training_entry import event_training_entry as crud_event_training
from app.crud.user import user as crud_user
from app.schemas.user import User
from app.core.security import get_current_user
from app.schemas.analytics import AnalyticsResponse, EntryType, MetricData
from app.model.training_entry import EntryTimingType

router = APIRouter()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_median(values: List[float]) -> Optional[float]:
    """Вычисляет медиану для списка значений."""
    if not values:
        return None
    sorted_values = sorted([v for v in values if v is not None])
    n = len(sorted_values)
    if n == 0:
        return None
    mid = n // 2
    if n % 2 == 0:
        return (sorted_values[mid - 1] + sorted_values[mid]) / 2
    return sorted_values[mid]

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
                    if metric not in after_only_metrics or entry.entry_timing == EntryTimingType.after
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
                    if metric not in after_only_metrics or entry.entry_timing == EntryTimingType.after
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

@router.get("/admin_metrics")
def get_admin_metrics_data(
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
    """Получение данных по указанным метрикам за период для всех пользователей (доступно только администраторам)."""
    # Проверка прав администратора
    if not crud_user.is_admin(current_user):
        raise HTTPException(status_code=403, detail="Только администраторы могут получать аналитику по всем пользователям")

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

    # Получение всех пользователей
    users = crud_user.get_multi(db, skip=0, limit=None)  # Получаем всех пользователей

    # Инициализация словаря для хранения данных по пользователям
    admin_response = {}

    for user in users:
        user_id = user.id
        personal_data = []
        event_data = []

        if entry_type in [EntryType.personal, EntryType.all]:
            personal_entries = crud_personal_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )
            personal_data = [
                MetricData(
                    date=entry.entry_date,
                    entry_timing=entry.entry_timing.value,
                    event_id=None,
                    metrics={
                        metric: getattr(entry, metric)
                        for metric in metrics
                        if metric not in after_only_metrics or entry.entry_timing == EntryTimingType.after
                    }
                )
                for entry in personal_entries
            ]

        if entry_type in [EntryType.event, EntryType.all]:
            event_entries = crud_event_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )
            event_data = [
                MetricData(
                    date=entry.entry_date,
                    entry_timing=entry.entry_timing.value,
                    event_id=entry.event_id,
                    metrics={
                        metric: getattr(entry, metric)
                        for metric in metrics
                        if metric not in after_only_metrics or entry.entry_timing == EntryTimingType.after
                    }
                )
                for entry in event_entries
            ]

        # Формирование ответа для каждого пользователя
        user_response = AnalyticsResponse()
        if entry_type == EntryType.personal:
            user_response.personal = personal_data
        elif entry_type == EntryType.event:
            user_response.event = event_data
        else:  # EntryType.all
            user_response.personal = personal_data
            user_response.event = event_data

        admin_response[user_id] = user_response.dict()

    return admin_response

@router.get("/admin_daily_aggregated")
def get_admin_daily_aggregated_data(
    start_date: date = Query(..., description="Start date of the range"),
    end_date: date = Query(..., description="End date of the range"),
    metrics: List[str] = Query(
        default=["wellbeing_score"],
        description="List of metrics to aggregate (e.g., wellbeing_score, weight, sleep_hours, etc.)",
        example=["wellbeing_score", "weight", "sleep_hours"]
    ),
    entry_type: EntryType = Query(
        default=EntryType.all,
        description="Type of entries to aggregate: personal, event, or all"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение агрегированных (медианных) данных по всем пользователям за каждый день в указанном периоде (доступно только администраторам)."""
    # Проверка прав администратора
    if not crud_user.is_admin(current_user):
        raise HTTPException(status_code=403, detail="Только администраторы могут получать агрегированные данные")

    # Доступные метрики
    available_metrics = {
        "wellbeing_score", "training_intensity", "has_injury", "injury_location",
        "weight", "height", "bmi", "blood_pressure_sys", "blood_pressure_dia",
        "food_score", "temperature", "pulse", "sleep_quality", "sleep_hours",
        "blood_sugar", "personal_notes", "medications"
    }

    # Метрики, которые нельзя агрегировать (строковые)
    non_aggregatable_metrics = {"injury_location", "personal_notes", "medications"}

    # Валидация запрошенных метрик
    invalid_metrics = [m for m in metrics if m not in available_metrics]
    if invalid_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metrics: {invalid_metrics}. Available metrics: {list(available_metrics)}"
        )

    # Проверка на строковые метрики
    non_numeric_metrics = [m for m in metrics if m in non_aggregatable_metrics]
    if non_numeric_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Metrics {non_numeric_metrics} cannot be aggregated (string values are not supported). Use numeric metrics like wellbeing_score, weight, etc."
        )

    # Метрики, доступные только для "after"
    after_only_metrics = {"training_intensity", "has_injury", "injury_location"}

    # Получение всех пользователей
    users = crud_user.get_multi(db, skip=0, limit=None)

    # Инициализация словаря для хранения агрегированных данных по дням
    aggregated_data_by_day = {}

    # Собираем все записи за период по всем пользователям
    for user in users:
        user_id = user.id
        personal_entries = []
        event_entries = []

        if entry_type in [EntryType.personal, EntryType.all]:
            personal_entries = crud_personal_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )

        if entry_type in [EntryType.event, EntryType.all]:
            event_entries = crud_event_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )

        # Объединяем записи
        all_entries = personal_entries + event_entries

        # Группируем записи по дням
        for entry in all_entries:
            entry_date = entry.entry_date.date().isoformat()
            if entry_date not in aggregated_data_by_day:
                aggregated_data_by_day[entry_date] = {metric: [] for metric in metrics}

            for metric in metrics:
                value = getattr(entry, metric)
                if metric in after_only_metrics and entry.entry_timing != EntryTimingType.after:
                    continue
                if value is not None:
                    # Преобразуем has_injury (булево) в числовое значение
                    if metric == "has_injury":
                        value = 1 if value else 0
                    aggregated_data_by_day[entry_date][metric].append(value)

    # Вычисляем медиану для каждой метрики за каждый день и исключаем дни без данных
    result = {}
    for day, metrics_data in aggregated_data_by_day.items():
        day_metrics = {}
        has_data = False
        for metric, values in metrics_data.items():
            median_value = calculate_median(values)
            day_metrics[metric] = median_value
            if median_value is not None:
                has_data = True
        if has_data:
            result[day] = day_metrics

    return result

@router.get("/admin_injuries_by_day")
def get_admin_injuries_by_day(
    start_date: date = Query(..., description="Start date of the range"),
    end_date: date = Query(..., description="End date of the range"),
    entry_type: EntryType = Query(
        default=EntryType.all,
        description="Type of entries to consider: personal, event, or all"
    ),
    include_zero_days: bool = Query(
        default=False,
        description="If true, include days with zero injuries in the result"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получение суммарного количества травм по дням для всех пользователей (доступно только администраторам)."""
    # Проверка прав администратора
    if not crud_user.is_admin(current_user):
        raise HTTPException(status_code=403, detail="Только администраторы могут получать данные о травмах")

    # Получение всех пользователей
    users = crud_user.get_multi(db, skip=0, limit=None)

    # Инициализация словаря для хранения количества травм по дням
    injuries_by_day = {}

    # Если include_zero_days=True, инициализируем все дни в диапазоне с нулём
    if include_zero_days:
        current_date = start_date
        while current_date <= end_date:
            injuries_by_day[current_date.isoformat()] = 0
            current_date += timedelta(days=1)

    # Собираем все записи за период по всем пользователям
    total_after_entries = 0
    total_injuries = 0

    for user in users:
        user_id = user.id
        personal_entries = []
        event_entries = []

        if entry_type in [EntryType.personal, EntryType.all]:
            personal_entries = crud_personal_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )

        if entry_type in [EntryType.event, EntryType.all]:
            event_entries = crud_event_training.get_entries_by_date_range(
                db, user_id=user_id, start_date=start_date, end_date=end_date
            )

        # Объединяем записи
        all_entries = personal_entries + event_entries

        # Подсчитываем травмы по дням
        for entry in all_entries:
            # Учитываем только записи с entry_timing="after", так как has_injury доступно только для них
            if entry.entry_timing != EntryTimingType.after:
                continue
            total_after_entries += 1
            entry_date = entry.entry_date.date().isoformat()

            # Логируем сырые данные

            if entry_date not in injuries_by_day:
                injuries_by_day[entry_date] = 0

            # Проверяем has_injury, учитывая возможные типы данных
            has_injury = entry.has_injury
            if isinstance(has_injury, str):
                has_injury = has_injury.lower() == "true"

            if has_injury:
                injuries_by_day[entry_date] += 1
                total_injuries += 1

    # Если include_zero_days=False, исключаем дни, где нет травм
    if not include_zero_days:
        result = {day: count for day, count in injuries_by_day.items() if count > 0}
    else:
        result = injuries_by_day

    return result