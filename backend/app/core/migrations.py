import logging
import re
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)

_SQL_DIR = Path(__file__).resolve().parents[2] / "sql"


def _split_sql(raw: str) -> list[str]:
    """Split migration file into executable statements (skip comment-only lines)."""
    cleaned = re.sub(r"--[^\n]*", "", raw)
    return [s.strip() for s in cleaned.split(";") if s.strip()]


def apply_migrations(engine: Engine) -> None:
    """Run sql/*.sql on Postgres. SQLite uses create_all from models only."""
    if str(engine.url.drivername).startswith("sqlite"):
        return

    files = sorted(_SQL_DIR.glob("*.sql"))
    if not files:
        return

    with engine.begin() as conn:
        for path in files:
            statements = _split_sql(path.read_text(encoding="utf-8"))
            for stmt in statements:
                try:
                    conn.execute(text(stmt))
                except Exception as exc:
                    logger.warning("Migration skip (%s): %s", path.name, exc)
            logger.info("Applied migration: %s", path.name)
