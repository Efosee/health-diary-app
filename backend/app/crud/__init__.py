from app.crud.base import CRUDBase
from app.crud.user import user
from app.crud.health_profile import health_profile
from app.crud.sport_event import sport_event
from app.crud.sleep_record import sleep_record
from app.crud.training_entry import personal_training_entry, event_training_entry

# Export all CRUD instances
__all__ = [
    "user",
    "health_profile",
    "sport_event",
    "sleep_record",
    "personal_training_entry",
    "event_training_entry"
]