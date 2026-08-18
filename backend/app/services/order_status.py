STATUSES = [
    "pending_confirmation",
    "no_answer",
    "callback",
    "confirmed",
    "cancelled",
    "shipped",
    "delivered",
    "returned",
    "duplicate",
]

STATUS_LABELS_AR = {
    "pending_confirmation": "جديد — بانتظار التأكيد",
    "no_answer": "ما جاوبش",
    "callback": "إعادة اتصال",
    "confirmed": "مؤكد",
    "cancelled": "ملغي",
    "shipped": "في التوصيل",
    "delivered": "تسلّم",
    "returned": "مرجع",
    "duplicate": "مكرر",
}

CONFIRMED_PLUS = {"confirmed", "shipped", "delivered", "returned"}
SHIPPED_PLUS = {"shipped", "delivered", "returned"}
PENDING_CALL = {"pending_confirmation", "no_answer", "callback"}
CANCELLED = {"cancelled", "duplicate"}
DECIDED = CONFIRMED_PLUS | CANCELLED


def is_valid_status(value: str) -> bool:
    return value in STATUSES
