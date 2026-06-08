"""Orchestrate Purchase CAPI calls across Meta, TikTok, and Snap."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from app.services.capi.meta import send_meta_purchase
from app.services.capi.snap import send_snap_purchase
from app.services.capi.tiktok import send_tiktok_purchase

logger = logging.getLogger(__name__)


async def fire_purchase_capi(ctx: dict[str, Any]) -> list[dict[str, Any]]:
    """
    Send Purchase to all configured CAPI endpoints in parallel.
    ctx keys: order_id, grand_total_sar, customer_phone, customer_name,
              client_ip, user_agent, fbc, fbp, ttclid, ttp, sc_click_id,
              event_source_url, content_ids (list of SKUs)
    """
    order_id = ctx.get("order_id", "?")
    logger.info(
        "CAPI Purchase dispatch order_id=%s value=%s ip=%s ua=%s fbc=%s fbp=%s ttclid=%s sc=%s",
        order_id,
        ctx.get("grand_total_sar"),
        ctx.get("client_ip"),
        bool(ctx.get("user_agent")),
        bool(ctx.get("fbc")),
        bool(ctx.get("fbp")),
        bool(ctx.get("ttclid")),
        bool(ctx.get("sc_click_id")),
    )

    results = await asyncio.gather(
        send_meta_purchase(ctx),
        send_tiktok_purchase(ctx),
        send_snap_purchase(ctx),
        return_exceptions=True,
    )

    parsed: list[dict[str, Any]] = []
    for r in results:
        if isinstance(r, Exception):
            logger.error("CAPI task exception order_id=%s: %s", order_id, r)
            parsed.append({"ok": False, "error": str(r)})
        else:
            parsed.append(r)

    ok_count = sum(1 for r in parsed if r.get("ok"))
    skip_count = sum(1 for r in parsed if r.get("skipped"))
    logger.info(
        "CAPI Purchase done order_id=%s ok=%s skipped=%s total=%s results=%s",
        order_id,
        ok_count,
        skip_count,
        len(parsed),
        [{k: v for k, v in r.items() if k in ("platform", "ok", "skipped", "event_id", "error")} for r in parsed],
    )
    return parsed
