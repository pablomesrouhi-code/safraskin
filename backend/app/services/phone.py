import re

PHONE_RE = re.compile(r"^(?:\+212|212|0)?[67]\d{8}$")


def is_valid_ma_phone(value: str) -> bool:
    cleaned = re.sub(r"[\s-]", "", value or "")
    return bool(PHONE_RE.match(cleaned))


def to_local_ma(value: str) -> str:
    cleaned = re.sub(r"[\s-]", "", value or "")
    if cleaned.startswith("+212"):
        return f"0{cleaned[4:]}"
    if cleaned.startswith("212"):
        return f"0{cleaned[3:]}"
    if cleaned.startswith("0") and len(cleaned) == 10:
        return cleaned
    if re.fullmatch(r"[67]\d{8}", cleaned):
        return f"0{cleaned}"
    return cleaned


def to_e164(value: str) -> str:
    cleaned = re.sub(r"[\s-]", "", value or "")
    if cleaned.startswith("+212"):
        return cleaned
    if cleaned.startswith("212"):
        return f"+{cleaned}"
    if cleaned.startswith("0"):
        return f"+212{cleaned[1:]}"
    if re.fullmatch(r"[67]\d{8}", cleaned):
        return f"+212{cleaned}"
    return cleaned