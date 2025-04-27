from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List, Union
from enum import Enum

class EntryType(str, Enum):
    personal = "personal"
    event = "event"
    all = "all"

class MetricData(BaseModel):
    date: datetime
    entry_timing: str
    event_id: Optional[int] = None
    metrics: Dict[str, Union[int, float, bool, str, None]]

class AnalyticsResponse(BaseModel):
    personal: Optional[List[MetricData]] = None
    event: Optional[List[MetricData]] = None