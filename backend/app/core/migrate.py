import logging

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

from app.core.database import engine

logger = logging.getLogger("app.migrate")

ORDER_COLUMNS = {
    "notes": "TEXT",
    "ip_address": "VARCHAR(64)",
    "ip_country": "VARCHAR(8)",
    "ip_city": "VARCHAR(80)",
    "is_morocco": "BOOLEAN",
    "user_agent": "VARCHAR(500)",
    "status_updated_at": "TIMESTAMP",
    "session_id": "VARCHAR(80)",
    "utm_source": "VARCHAR(80)",
    "utm_medium": "VARCHAR(80)",
    "utm_campaign": "VARCHAR(120)",
    "sheets_synced": "BOOLEAN",
}


def _existing_columns(eng: Engine, table: str) -> set[str]:
    try:
        insp = inspect(eng)
        return {col["name"] for col in insp.get_columns(table)}
    except Exception:
        return set()


def migrate(eng: Engine | None = None) -> None:
    eng = eng or engine
    dialect = eng.dialect.name
    cols = _existing_columns(eng, "orders")
    if not cols:
        return
    with eng.begin() as conn:
        for name, col_type in ORDER_COLUMNS.items():
            if name in cols:
                continue
            sql_type = col_type
            if dialect == "sqlite":
                sql_type = {
                    "BOOLEAN": "INTEGER DEFAULT 0",
                    "TIMESTAMP": "DATETIME",
                    "TEXT": "TEXT",
                }.get(col_type, col_type)
            elif name == "is_morocco":
                sql_type = "BOOLEAN DEFAULT FALSE"
            conn.execute(text(f"ALTER TABLE orders ADD COLUMN {name} {sql_type}"))
            logger.info("Added orders.%s", name)

        if "is_morocco" not in cols:
            conn.execute(
                text(
                    "UPDATE orders SET is_morocco = true "
                    "WHERE (ip_country = 'MA') "
                    "OR (customer_phone LIKE '+212%' OR customer_phone LIKE '212%' OR customer_phone LIKE '0%')"
                )
                if dialect != "sqlite"
                else text(
                    "UPDATE orders SET is_morocco = 1 "
                    "WHERE (ip_country = 'MA') "
                    "OR (customer_phone LIKE '+212%' OR customer_phone LIKE '212%' OR customer_phone LIKE '0%')"
                )
            )
