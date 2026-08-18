from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

CASABLANCA = ZoneInfo("Africa/Casablanca")
UTC = timezone.utc


def now_ma() -> datetime:
    return datetime.now(CASABLANCA)


def parse_iso_date(value: str | None) -> datetime | None:
    raw = (value or "").strip()
    if not raw:
        return None
    try:
        return datetime.strptime(raw[:10], "%Y-%m-%d").replace(tzinfo=CASABLANCA)
    except ValueError:
        return None


def range_bounds(date_from: str | None, date_to: str | None) -> tuple[datetime, datetime]:
    """Inclusive Casablanca calendar dates → naive UTC bounds for DB comparison."""
    today = now_ma().date()
    start_d = parse_iso_date(date_from)
    end_d = parse_iso_date(date_to)
    start_local = (start_d or datetime.combine(today - timedelta(days=6), datetime.min.time(), tzinfo=CASABLANCA))
    end_local = end_d or datetime.combine(today, datetime.min.time(), tzinfo=CASABLANCA)
    if end_local < start_local:
        start_local, end_local = end_local, start_local
    start_utc = start_local.astimezone(UTC).replace(tzinfo=None)
    end_utc = (end_local + timedelta(days=1)).astimezone(UTC).replace(tzinfo=None)
    return start_utc, end_utc


def to_ma_iso(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(CASABLANCA).strftime("%Y-%m-%dT%H:%M:%S")


def date_keys(start_utc: datetime, end_utc: datetime) -> list[str]:
    start_local = start_utc.replace(tzinfo=UTC).astimezone(CASABLANCA).date()
    end_local = (end_utc.replace(tzinfo=UTC).astimezone(CASABLANCA) - timedelta(seconds=1)).date()
    days: list[str] = []
    cur = start_local
    while cur <= end_local:
        days.append(cur.isoformat())
        cur += timedelta(days=1)
    return days


def ma_date_key(value: datetime | None) -> str:
    if value is None:
        return ""
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(CASABLANCA).strftime("%Y-%m-%d")
