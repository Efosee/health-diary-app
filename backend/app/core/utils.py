from datetime import datetime, timezone, timedelta

def datetime_moscow_now():
    return datetime.now(timezone(timedelta(hours=3)))
