from .auth import router as auth_router
from .user import router as user_router
from .health_profile import router as health_profile_router
from .personal_training import router as personal_training_router
from .event_training import router as event_training_router
from .analytics import router as analytics_router
from .sport_event import router as sport_event_router

__all__ = [
    "auth_router",
    "user_router",
    "health_profile_router",
    "personal_training_router",
    "event_training_router",
    "analytics_router",
    "sport_event_router",
]